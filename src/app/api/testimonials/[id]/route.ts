import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'

const updateTestimonialSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  content: z.string().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  status: z.enum(['PUBLISHED', 'PENDING', 'REJECTED']).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  packageId: z.string().optional(),
  activityId: z.string().optional(),
  language: z.enum(['EN', 'HI', 'ML']).default('EN'),
  mediaIds: z.array(z.string()).optional()
})

// GET /api/testimonials/[id] - Get single testimonial
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
        const testimonialData = await prisma.testimonial.findUnique({
          where: { id: params.id },
          include: {
            translations: {
              where: { language: language as any }
            },
            media: {
              include: { media: true },
              orderBy: { order: 'asc' }
            },
            package: {
              select: {
                id: true,
                slug: true,
                translations: {
                  where: { language: language as any },
                  select: { name: true }
                }
              }
            },
            activity: {
              select: {
                id: true,
                slug: true,
                translations: {
                  where: { language: language as any },
                  select: { name: true }
                }
              }
            },
            versions: includeVersions ? {
              orderBy: { version: 'desc' },
              take: 10
            } : false
          }
        })

        if (!testimonialData) {
          return null
        }

        // Transform data
        const translation = testimonialData.translations[0]
        return {
          ...testimonialData,
          content: translation?.content || '',
          image: testimonialData.media[0]?.media?.url,
          mediaGallery: testimonialData.media.map(m => ({
            ...m.media,
            order: m.order
          })),
          packageName: testimonialData.package?.translations[0]?.name,
          activityName: testimonialData.activity?.translations[0]?.name
        }
      },
      // Fallback data
      mockData.testimonials.find(t => t.id === params.id) || null,
      'fetch testimonial'
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    )
  }
}

// PUT /api/testimonials/[id] - Update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateTestimonialSchema.parse(body)

    const {
      content,
      language,
      mediaIds,
      ...testimonialData
    } = validatedData

    const result = await withDatabaseFallback(
      async () => {
        // Check if testimonial exists
        const existingTestimonial = await prisma.testimonial.findUnique({
          where: { id: params.id },
          include: {
            versions: {
              orderBy: { version: 'desc' },
              take: 1
            }
          }
        })

        if (!existingTestimonial) {
          return null
        }

        // Update with transaction
        return await prisma.$transaction(async (tx) => {
          // Update testimonial
          const updatedTestimonial = await tx.testimonial.update({
            where: { id: params.id },
            data: {
              ...testimonialData,
              publishedAt: testimonialData.published === true && !existingTestimonial.published 
                ? new Date() 
                : undefined,
              version: existingTestimonial.version + 1
            }
          })

          // Update or create translation
          if (content) {
            await tx.testimonialTranslation.upsert({
              where: {
                testimonialId_language: {
                  testimonialId: params.id,
                  language: language as any
                }
              },
              update: { content },
              create: {
                testimonialId: params.id,
                language: language as any,
                content
              }
            })
          }

          // Update media if provided
          if (mediaIds) {
            // Remove existing media links
            await tx.testimonialMedia.deleteMany({
              where: { testimonialId: params.id }
            })

            // Add new media links
            if (mediaIds.length > 0) {
              await tx.testimonialMedia.createMany({
                data: mediaIds.map((mediaId, index) => ({
                  testimonialId: params.id,
                  mediaId,
                  order: index
                }))
              })
            }
          }

          // Create new version
          await tx.testimonialVersion.create({
            data: {
              testimonialId: params.id,
              version: updatedTestimonial.version,
              data: {
                ...testimonialData,
                ...(content && { translation: { content } }),
                ...(mediaIds && { mediaIds })
              }
            }
          })

          return updatedTestimonial
        })
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        id: params.id,
        ...validatedData,
        updatedAt: new Date().toISOString(),
        message: 'Testimonial updated (development mode)'
      } : null,
      'update testimonial'
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE /api/testimonials/[id] - Delete testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await withDatabaseFallback(
      async () => {
        // Check if testimonial exists
        const existingTestimonial = await prisma.testimonial.findUnique({
          where: { id: params.id }
        })

        if (!existingTestimonial) {
          return null
        }

        // Delete testimonial (cascade will handle related records)
        await prisma.testimonial.delete({
          where: { id: params.id }
        })

        return { message: 'Testimonial deleted successfully' }
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        message: 'Testimonial deleted (development mode)'
      } : null,
      'delete testimonial'
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}