import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const updateMediaSchema = z.object({
  alt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  folder: z.string().optional(),
  tags: z.array(z.string()).optional()
})

// GET /api/media/[id] - Get single media item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await withDatabaseFallback(
      async () => {
        const mediaItem = await prisma.media.findUnique({
          where: { id: params.id },
          include: {
            packageMedia: {
              include: {
                package: {
                  select: {
                    id: true,
                    slug: true,
                    translations: {
                      select: { name: true, language: true }
                    }
                  }
                }
              }
            },
            activityMedia: {
              include: {
                activity: {
                  select: {
                    id: true,
                    slug: true,
                    translations: {
                      select: { name: true, language: true }
                    }
                  }
                }
              }
            },
            testimonialMedia: {
              include: {
                testimonial: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        })

        if (!mediaItem) {
          throw new Error('Media not found')
        }

        // Transform usage data
        const usage = {
          packages: mediaItem.packageMedia.map(pm => ({
            id: pm.package.id,
            slug: pm.package.slug,
            name: pm.package.translations[0]?.name || 'Untitled',
            isPrimary: pm.isPrimary
          })),
          activities: mediaItem.activityMedia.map(am => ({
            id: am.activity.id,
            slug: am.activity.slug,
            name: am.activity.translations[0]?.name || 'Untitled',
            isPrimary: am.isPrimary
          })),
          testimonials: mediaItem.testimonialMedia.map(tm => ({
            id: tm.testimonial.id,
            name: tm.testimonial.name
          }))
        }

        return {
          ...mediaItem,
          usage
        }
      },
      // Fallback data
      process.env.NODE_ENV === 'development' ? {
        ...mockData.media[0],
        id: params.id,
        usage: {
          packages: [],
          activities: [],
          testimonials: []
        },
        message: 'Media data (development mode)'
      } : null,
      'fetch media item'
    )

    if (!result && process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

// PUT /api/media/[id] - Update media item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateMediaSchema.parse(body)

    const result = await withDatabaseFallback(
      async () => {
        // Check if media exists
        const existingMedia = await prisma.media.findUnique({
          where: { id: params.id }
        })

        if (!existingMedia) {
          throw new Error('Media not found')
        }

        // Update media
        const updatedMedia = await prisma.media.update({
          where: { id: params.id },
          data: validatedData
        })

        return updatedMedia
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        ...mockData.media[0],
        id: params.id,
        ...validatedData,
        message: 'Media updated (development mode)'
      } : null,
      'update media'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating media:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    )
  }
}

// DELETE /api/media/[id] - Delete media item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await withDatabaseFallback(
      async () => {
        // Check if media exists and get file info
        const existingMedia = await prisma.media.findUnique({
          where: { id: params.id },
          include: {
            packageMedia: true,
            activityMedia: true,
            testimonialMedia: true
          }
        })

        if (!existingMedia) {
          throw new Error('Media not found')
        }

        // Check if media is being used
        const isInUse = existingMedia.packageMedia.length > 0 ||
                       existingMedia.activityMedia.length > 0 ||
                       existingMedia.testimonialMedia.length > 0

        if (isInUse) {
          throw new Error('Cannot delete media that is currently in use')
        }

        // Delete file from filesystem
        try {
          const filePath = join(process.cwd(), 'public', existingMedia.url)
          if (existsSync(filePath)) {
            await unlink(filePath)
          }
        } catch (fileError) {
          console.warn('Failed to delete file from filesystem:', fileError)
          // Continue with database deletion even if file deletion fails
        }

        // Delete from database
        await prisma.media.delete({
          where: { id: params.id }
        })

        return { message: 'Media deleted successfully' }
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        message: 'Media deleted successfully (development mode)'
      } : null,
      'delete media'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}