import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'

// Validation schemas
const createTestimonialSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  content: z.string().min(1),
  rating: z.number().min(1).max(5).default(5),
  packageId: z.string().optional(),
  activityId: z.string().optional(),
  featured: z.boolean().default(false),
  language: z.enum(['EN', 'HI', 'ML']).default('EN'),
  mediaIds: z.array(z.string()).default([])
})

const updateTestimonialSchema = createTestimonialSchema.partial()

// GET /api/testimonials - List all testimonials with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const language = searchParams.get('language') || 'EN'
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const packageId = searchParams.get('packageId')
    const activityId = searchParams.get('activityId')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const result = await withDatabaseFallback(
      async () => {
        // Build where clause
        const where: any = {}
        
        if (status) where.status = status
        if (published !== null) where.published = published === 'true'
        if (featured !== null) where.featured = featured === 'true'
        if (packageId) where.packageId = packageId
        if (activityId) where.activityId = activityId
        
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { role: { contains: search, mode: 'insensitive' } },
            {
              translations: {
                some: {
                  language: language as any,
                  content: { contains: search, mode: 'insensitive' }
                }
              }
            }
          ]
        }

        const [testimonials, total] = await Promise.all([
          prisma.testimonial.findMany({
            where,
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
              }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.testimonial.count({ where })
        ])

        // Transform data to include translation fields at root level
        const transformedTestimonials = testimonials.map(testimonial => {
          const translation = testimonial.translations[0]
          return {
            ...testimonial,
            content: translation?.content || '',
            image: testimonial.media[0]?.media?.url,
            mediaGallery: testimonial.media.map(m => m.media),
            packageName: testimonial.package?.translations[0]?.name,
            activityName: testimonial.activity?.translations[0]?.name
          }
        })

        return {
          testimonials: transformedTestimonials,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      },
      // Fallback data
      {
        testimonials: mockData.testimonials,
        pagination: {
          page: 1,
          limit: 10,
          total: mockData.testimonials.length,
          pages: 1
        }
      },
      'fetch testimonials'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST /api/testimonials - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createTestimonialSchema.parse(body)

    const {
      content,
      language,
      mediaIds,
      ...testimonialData
    } = validatedData

    const result = await withDatabaseFallback(
      async () => {
        // Create testimonial with transaction
        return await prisma.$transaction(async (tx) => {
          // Create testimonial
          const newTestimonial = await tx.testimonial.create({
            data: testimonialData
          })

          // Create translation
          await tx.testimonialTranslation.create({
            data: {
              testimonialId: newTestimonial.id,
              language: language as any,
              content
            }
          })

          // Link media
          if (mediaIds.length > 0) {
            await tx.testimonialMedia.createMany({
              data: mediaIds.map((mediaId, index) => ({
                testimonialId: newTestimonial.id,
                mediaId,
                order: index
              }))
            })
          }

          // Create initial version
          await tx.testimonialVersion.create({
            data: {
              testimonialId: newTestimonial.id,
              version: 1,
              data: {
                ...testimonialData,
                translation: { content },
                mediaIds
              }
            }
          })

          return newTestimonial
        })
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        id: `testimonial-${Date.now()}`,
        ...validatedData,
        createdAt: new Date().toISOString(),
        message: 'Testimonial created (development mode)'
      } : null,
      'create testimonial'
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}