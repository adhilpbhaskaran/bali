import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'

// Validation schemas
const createPackageSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  basePrice: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  duration: z.number().positive(),
  location: z.string().min(1),
  category: z.string().min(1),
  tourType: z.enum(['FIT', 'GIT']).default('FIT'),
  minParticipants: z.number().positive().default(1),
  maxParticipants: z.number().positive().optional(),
  isFlexibleDates: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  included: z.array(z.string()).default([]),
  notIncluded: z.array(z.string()).default([]),
  language: z.enum(['EN', 'HI', 'ML']).default('EN'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  mediaIds: z.array(z.string()).default([]),
  itinerary: z.array(z.object({
    day: z.number().positive(),
    title: z.string().min(1),
    description: z.string().min(1),
    activities: z.array(z.string()).default([]),
    breakfast: z.string().optional(),
    lunch: z.string().optional(),
    dinner: z.string().optional(),
    accommodation: z.string().optional(),
  })).default([])
})

const updatePackageSchema = createPackageSchema.partial()

// GET /api/packages - List all packages with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const tourType = searchParams.get('tourType')
    const trending = searchParams.get('trending')
    const bestSeller = searchParams.get('bestSeller')
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice') || '0') : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice') || '0') : undefined
    const minDuration = searchParams.get('minDuration') ? parseInt(searchParams.get('minDuration') || '0') : undefined
    const maxDuration = searchParams.get('maxDuration') ? parseInt(searchParams.get('maxDuration') || '0') : undefined
    const location = searchParams.get('location')
    const language = searchParams.get('language') || 'EN'
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
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
    
    // Database operation with fallback
    const result = await withDatabaseFallback<ApiResult>(
      async () => {
        // Build where clause
        const where: any = {}
        
        if (status) where.status = status
        if (category) where.category = category
        if (tourType) where.tourType = tourType
        if (published !== null) where.published = published === 'true'
        if (featured !== null) where.featured = featured === 'true'
        if (trending !== null) where.trending = trending === 'true'
        if (bestSeller !== null) where.bestSeller = bestSeller === 'true'
        if (location) where.location = { contains: location, mode: 'insensitive' }
        
        // Price range filtering
        if (minPrice !== undefined || maxPrice !== undefined) {
          where.basePrice = {}
          if (minPrice !== undefined) where.basePrice.gte = minPrice
          if (maxPrice !== undefined) where.basePrice.lte = maxPrice
        }
        
        // Duration range filtering
        if (minDuration !== undefined || maxDuration !== undefined) {
          where.duration = {}
          if (minDuration !== undefined) where.duration.gte = minDuration
          if (maxDuration !== undefined) where.duration.lte = maxDuration
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

        const [packages, total] = await Promise.all([
          prisma.package.findMany({
            where,
            include: {
              translations: {
                where: { language: language as any }
              },
              media: {
                include: { media: true },
                orderBy: { order: 'asc' }
              },
              itinerary: {
                orderBy: { day: 'asc' }
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
          prisma.package.count({ where })
        ])

        // Transform data to include translation fields at root level and format for our utility functions
        const transformedPackages = packages.map(pkg => {
          const translation = pkg.translations[0]
          const itineraryItems = pkg.itinerary.map(item => ({
            day: item.day,
            title: item.title,
            description: item.description,
            activities: item.activities || [],
            meals: {
              breakfast: !!item.breakfast,
              lunch: !!item.lunch,
              dinner: !!item.dinner
            },
            accommodation: item.accommodation || ''
          }))
          
          // Prepare media gallery with proper URLs
          const mediaGallery = pkg.media
            .filter(m => m.media?.url)
            .map(m => m.media?.url || '')
          
          // Ensure at least one image, with a fallback
          if (mediaGallery.length === 0) {
            mediaGallery.push('/images/fallback-package.jpg')
          }
          
          // Extract properties safely with proper type checking
          const pkgData = pkg as any; // Use any temporarily to extract fields that might not be in the type but exist in data
          
          return {
            id: pkg.id,
            name: translation?.name || (pkgData.title as string) || '',
            title: (pkgData.title as string) || translation?.name || '',
            description: translation?.description || '',
            shortDescription: translation?.shortDescription || '',
            price: pkg.basePrice || 0,
            discountPrice: pkg.discountPrice,
            duration: pkg.duration || 1,
            location: pkg.location || 'Bali',
            category: pkg.category || '',
            tourType: pkg.tourType || 'FIT',
            status: pkg.status || 'PUBLISHED',
            minParticipants: pkg.minParticipants || 1,
            maxParticipants: pkg.maxParticipants || 10,
            isFlexibleDates: pkg.isFlexibleDates || false,
            startDate: pkg.startDate?.toISOString() || new Date().toISOString(),
            endDate: pkg.endDate?.toISOString() || new Date().toISOString(),
            slug: pkg.slug || '',
            image: pkg.media.find(m => m.isPrimary)?.media?.url || pkg.media[0]?.media?.url || '/images/fallback-package.jpg',
            mediaGallery,
            highlights: translation?.highlights || [],
            included: translation?.included || [],
            notIncluded: translation?.notIncluded || [],
            itinerary: itineraryItems,
            rating: (pkgData.rating as number) || 4.5,
            reviews: pkg._count.testimonials || 0,
            reviewCount: pkg._count.testimonials || 0,
            featured: pkg.featured || false,
            trending: pkg.trending || false,
            bestSeller: pkg.bestSeller || false,
            language: language
          }
        })

        return {
          data: transformedPackages,
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
        data: mockData.packages,
        pagination: {
          page: 1,
          limit: 10,
          total: mockData.packages.length,
          pages: 1
        }
      }),
      'fetch packages'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}

// POST /api/packages - Create new package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPackageSchema.parse(body)

    const {
      name,
      description,
      shortDescription,
      highlights,
      included,
      notIncluded,
      language,
      mediaIds,
      itinerary,
      ...packageData
    } = validatedData

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create package with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create package
      const newPackage = await tx.package.create({
        data: {
          ...packageData,
          slug: `${slug}-${Date.now()}`, // Ensure uniqueness
          startDate: packageData.startDate ? new Date(packageData.startDate) : null,
          endDate: packageData.endDate ? new Date(packageData.endDate) : null
        }
      })

      // Create translation
      await tx.packageTranslation.create({
        data: {
          packageId: newPackage.id,
          language: language as any,
          name,
          description,
          shortDescription,
          highlights,
          included,
          notIncluded
        }
      })

      // Link media
      if (mediaIds.length > 0) {
        await tx.packageMedia.createMany({
          data: mediaIds.map((mediaId, index) => ({
            packageId: newPackage.id,
            mediaId,
            order: index,
            isPrimary: index === 0
          }))
        })
      }

      // Create itinerary
      if (itinerary.length > 0) {
        await tx.itineraryDay.createMany({
          data: itinerary.map(day => ({
            packageId: newPackage.id,
            ...day
          }))
        })
      }

      // Create initial version
      await tx.packageVersion.create({
        data: {
          packageId: newPackage.id,
          version: 1,
          data: {
            ...packageData,
            translation: {
              name,
              description,
              shortDescription,
              highlights,
              included,
              notIncluded
            },
            mediaIds,
            itinerary
          }
        }
      })

      return newPackage
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating package:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    )
  }
}