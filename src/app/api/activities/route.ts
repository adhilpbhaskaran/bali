import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'

// Validation schemas
const createActivitySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  basePrice: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  duration: z.string().min(1),
  location: z.string().min(1),
  category: z.string().min(1),
  highlights: z.array(z.string()).default([]),
  includedItems: z.array(z.string()).default([]),
  excludedItems: z.array(z.string()).default([]),
  language: z.enum(['EN', 'HI', 'ML']).default('EN'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  mediaIds: z.array(z.string()).default([])
})

const updateActivitySchema = createActivitySchema.partial()

// GET /api/activities - List all activities with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const language = searchParams.get('language') || 'EN'
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const trending = searchParams.get('trending')
    const popular = searchParams.get('popular')
    const difficulty = searchParams.get('difficulty')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice') || '0') : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice') || '0') : undefined
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Define result type to ensure consistency
    type ApiResult = {
      data: any[],
      pagination: {
        page: number,
        limit: number,
        total: number,
        pages: number
      }
    }
    
    const result = await withDatabaseFallback<ApiResult>(
      async () => {
        // Build where clause
        const where: any = {}
        
        if (status) where.status = status
        if (category) where.category = category
        if (published !== null) where.published = published === 'true'
        if (featured !== null) where.featured = featured === 'true'
        if (trending !== null) where.trending = trending === 'true'
        if (popular !== null) where.popular = popular === 'true'
        if (difficulty) where.difficulty = difficulty
        if (location) where.location = { contains: location, mode: 'insensitive' }
        
        // Price range filtering
        if (minPrice !== undefined || maxPrice !== undefined) {
          where.basePrice = {}
          if (minPrice !== undefined) where.basePrice.gte = minPrice
          if (maxPrice !== undefined) where.basePrice.lte = maxPrice
        }
        
        if (search) {
          where.OR = [
            {
              translations: {
                some: {
                  language: language as any,
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { shortDescription: { contains: search, mode: 'insensitive' } }
                  ]
                }
              }
            },
            { location: { contains: search, mode: 'insensitive' } },
            { category: { contains: search, mode: 'insensitive' } }
          ]
        }

        const [activities, total] = await Promise.all([
          prisma.activity.findMany({
            where,
            include: {
              translations: {
                where: { language: language as any }
              },
              media: {
                include: { media: true },
                orderBy: { order: 'asc' }
              },
              _count: {
                select: {
                  bookings: true,
                  testimonials: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.activity.count({ where })
        ])

        // Transform data to include translation fields at root level and format for our utility functions
        const transformedActivities = activities.map(activity => {
          const translation = activity.translations[0]
          
          // Prepare media gallery with proper URLs
          const mediaGallery = activity.media
            .filter(m => m.media?.url)
            .map(m => m.media?.url || '')
          
          // Ensure at least one image, with a fallback
          if (mediaGallery.length === 0) {
            mediaGallery.push('/images/fallback-activity.jpg')
          }
          
          // Extract properties safely with proper type checking
          const activityData = activity as any; // Use any temporarily to extract fields that might not be in the type
          
          return {
            id: activity.id,
            name: translation?.name || activityData.title || '',
            title: activityData.title || translation?.name || '',
            description: translation?.description || '',
            shortDescription: translation?.shortDescription || '',
            price: activity.basePrice || 0,
            discountPrice: activity.discountPrice,
            duration: activity.duration || '1 hour',
            location: activity.location || 'Bali',
            category: activity.category || 'Adventure',
            difficulty: activityData.difficulty || 'Easy',
            status: activity.status || 'PUBLISHED',
            image: activity.media.find(m => m.isPrimary)?.media?.url || activity.media[0]?.media?.url || '/images/fallback-activity.jpg',
            mediaGallery,
            highlights: translation?.highlights || [],
            included: translation?.includedItems || [],
            notIncluded: translation?.excludedItems || [],
            rating: activityData.rating || 4.5,
            reviews: activity._count.testimonials || 0,
            reviewCount: activity._count.testimonials || 0,
            featured: activity.featured || false,
            trending: activityData.trending || false,
            popular: activityData.popular || false,
            slug: activity.slug || '',
            language: language
          }
        })

        return {
          data: transformedActivities,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      },
      // Fallback data function that returns our ApiResult type
      () => ({
        data: mockData.activities,
        pagination: {
          page: 1,
          limit: 10,
          total: mockData.activities.length,
          pages: 1
        }
      }),
      'fetch activities'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

// POST /api/activities - Create new activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createActivitySchema.parse(body)

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
        // Generate slug from name
        const slug = name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        // Create activity with transaction
        return await prisma.$transaction(async (tx) => {
          // Create activity
          const newActivity = await tx.activity.create({
            data: {
              ...activityData,
              slug: `${slug}-${Date.now()}` // Ensure uniqueness
            }
          })

          // Create translation
          await tx.activityTranslation.create({
            data: {
              activityId: newActivity.id,
              language: language as any,
              name,
              description,
              shortDescription,
              highlights,
              includedItems,
              excludedItems
            }
          })

          // Link media
          if (mediaIds.length > 0) {
            await tx.activityMedia.createMany({
              data: mediaIds.map((mediaId, index) => ({
                activityId: newActivity.id,
                mediaId,
                order: index,
                isPrimary: index === 0
              }))
            })
          }

          // Create initial version
          await tx.activityVersion.create({
            data: {
              activityId: newActivity.id,
              version: 1,
              data: {
                ...activityData,
                translation: {
                  name,
                  description,
                  shortDescription,
                  highlights,
                  includedItems,
                  excludedItems
                },
                mediaIds
              }
            }
          })

          return newActivity
        })
      },
      // Fallback function for development mode
      () => {
        if (process.env.NODE_ENV === 'development') {
          const now = new Date();
          // Use type assertion to bypass type checking for the entire object
          // This is necessary because we're creating a fallback object that might
          // not match the exact structure of what Prisma expects
          return {
            id: `activity-${Date.now()}`,
            ...validatedData,
            // Add missing required properties to match Prisma Activity type
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            status: 'PUBLISHED',
            published: true,
            featured: false,
            trending: false,
            popular: false,
            publishedAt: now,
            createdAt: now,
            updatedAt: now,
            scheduledAt: null,
            unpublishAt: null,
            currency: 'USD',
            ogImage: null,
            version: 1,
            metaTitle: name || null,
            metaDescription: shortDescription || null,
            metaKeywords: highlights.join(', ') || null,
            discountPrice: null,
            // Mock message for development only
            message: 'Activity created (development mode)'
          } as any // Type assertion for the entire object
        }
        throw new Error('Database operation failed and no fallback is available in production')
      },
      'create activity'
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}