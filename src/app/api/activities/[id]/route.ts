import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'

const updateActivitySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  basePrice: z.number().positive().optional(),
  discountPrice: z.number().positive().optional(),
  duration: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  scheduledAt: z.string().optional(),
  unpublishAt: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  includedItems: z.array(z.string()).optional(),
  excludedItems: z.array(z.string()).optional(),
  language: z.enum(['EN', 'HI', 'ML']).default('EN'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  mediaIds: z.array(z.string()).optional()
})

// GET /api/activities/[id] - Get single activity
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'EN'
    const includeVersions = searchParams.get('versions') === 'true'

    const result = await withDatabaseFallback(
      async () => {
        const activityData = await prisma.activity.findUnique({
          where: { id: params.id },
          include: {
            translations: {
              where: { language: language as any }
            },
            media: {
              include: { media: true },
              orderBy: { order: 'asc' }
            },
            bookings: {
              select: {
                id: true,
                status: true,
                guests: true,
                totalAmount: true,
                createdAt: true
              },
              orderBy: { createdAt: 'desc' },
              take: 10
            },
            testimonials: {
              where: { published: true },
              include: {
                translations: {
                  where: { language: language as any }
                }
              },
              take: 5
            },
            versions: includeVersions ? {
              orderBy: { version: 'desc' },
              take: 10
            } : false,
            _count: {
              select: {
                bookings: true,
                testimonials: true
              }
            }
          }
        })

        if (!activityData) {
          return null
        }

        // Transform data
        const translation = activityData.translations[0]
        return {
          ...activityData,
          name: translation?.name || '',
          description: translation?.description || '',
          shortDescription: translation?.shortDescription || '',
          highlights: translation?.highlights || [],
          includedItems: translation?.includedItems || [],
          excludedItems: translation?.excludedItems || [],
          primaryImage: activityData.media.find(m => m.isPrimary)?.media?.url || activityData.media[0]?.media?.url,
          mediaGallery: activityData.media.map(m => ({
            ...m.media,
            order: m.order,
            isPrimary: m.isPrimary
          })),
          bookingsCount: activityData._count.bookings,
          testimonialsCount: activityData._count.testimonials,
          recentBookings: activityData.bookings,
          testimonials: activityData.testimonials.map(t => ({
            ...t,
            content: t.translations[0]?.content || ''
          }))
        }
      },
      // Fallback data
      mockData.activities.find(a => a.id === params.id) || null,
      'fetch activity'
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
}

// PUT /api/activities/[id] - Update activity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateActivitySchema.parse(body)

    const {
      name,
      description,
      shortDescription,
      highlights,
      includedItems,
      excludedItems,
      language,
      mediaIds,
      ...activityData
    } = validatedData

    const result = await withDatabaseFallback(
      async () => {
        // Check if activity exists
        const existingActivity = await prisma.activity.findUnique({
          where: { id: params.id },
          include: {
            versions: {
              orderBy: { version: 'desc' },
              take: 1
            }
          }
        })

        if (!existingActivity) {
          return null
        }

        // Update with transaction
        return await prisma.$transaction(async (tx) => {
      // Update activity
      const updatedActivity = await tx.activity.update({
        where: { id: params.id },
        data: {
          ...activityData,
          scheduledAt: activityData.scheduledAt ? new Date(activityData.scheduledAt) : undefined,
          unpublishAt: activityData.unpublishAt ? new Date(activityData.unpublishAt) : undefined,
          publishedAt: activityData.published === true && !existingActivity.published 
            ? new Date() 
            : undefined,
          version: existingActivity.version + 1
        }
      })

      // Update or create translation
      if (name || description || shortDescription || highlights || includedItems || excludedItems) {
        await tx.activityTranslation.upsert({
          where: {
            activityId_language: {
              activityId: params.id,
              language: language as any
            }
          },
          update: {
            ...(name && { name }),
            ...(description && { description }),
            ...(shortDescription !== undefined && { shortDescription }),
            ...(highlights && { highlights }),
            ...(includedItems && { includedItems }),
            ...(excludedItems && { excludedItems })
          },
          create: {
            activityId: params.id,
            language: language as any,
            name: name || '',
            description: description || '',
            shortDescription,
            highlights: highlights || [],
            includedItems: includedItems || [],
            excludedItems: excludedItems || []
          }
        })
      }

      // Update media if provided
      if (mediaIds) {
        // Remove existing media links
        await tx.activityMedia.deleteMany({
          where: { activityId: params.id }
        })

        // Add new media links
        if (mediaIds.length > 0) {
          await tx.activityMedia.createMany({
            data: mediaIds.map((mediaId, index) => ({
              activityId: params.id,
              mediaId,
              order: index,
              isPrimary: index === 0
            }))
          })
        }
      }

      // Create new version
      await tx.activityVersion.create({
        data: {
          activityId: params.id,
          version: updatedActivity.version,
          data: {
            ...activityData,
            ...(name || description || shortDescription || highlights || includedItems || excludedItems) && {
              translation: {
                name,
                description,
                shortDescription,
                highlights,
                includedItems,
                excludedItems
              }
            },
            ...(mediaIds && { mediaIds })
          }
        }
      })

          return updatedActivity
        })
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        id: params.id,
        ...validatedData,
        updatedAt: new Date().toISOString(),
        message: 'Activity updated (development mode)'
      } : null,
      'update activity'
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating activity:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    )
  }
}

// DELETE /api/activities/[id] - Delete activity
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await withDatabaseFallback(
      async () => {
        // Check if activity exists
        const existingActivity = await prisma.activity.findUnique({
          where: { id: params.id },
          include: {
            bookings: {
              where: {
                status: { in: ['PENDING', 'CONFIRMED'] }
              }
            }
          }
        })

        if (!existingActivity) {
          return null
        }

        // Check for active bookings
        if (existingActivity.bookings.length > 0) {
          throw new Error('Cannot delete activity with active bookings')
        }

        // Delete activity (cascade will handle related records)
        await prisma.activity.delete({
          where: { id: params.id }
        })

        return { message: 'Activity deleted successfully' }
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        message: 'Activity deleted (development mode)'
      } : null,
      'delete activity'
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting activity:', error)
    if (error.message === 'Cannot delete activity with active bookings') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 }
    )
  }
}