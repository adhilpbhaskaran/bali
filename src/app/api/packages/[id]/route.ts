import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'

const updatePackageSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  basePrice: z.number().positive().optional(),
  discountPrice: z.number().positive().optional(),
  duration: z.number().positive().optional(),
  location: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  tourType: z.enum(['FIT', 'GIT']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  minParticipants: z.number().positive().optional(),
  maxParticipants: z.number().positive().optional(),
  isFlexibleDates: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  scheduledAt: z.string().optional(),
  unpublishAt: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  notIncluded: z.array(z.string()).optional(),
  language: z.enum(['EN', 'HI', 'ML']).default('EN'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  mediaIds: z.array(z.string()).optional(),
  itinerary: z.array(z.object({
    day: z.number().positive(),
    title: z.string().min(1),
    description: z.string().min(1),
    activities: z.array(z.string()).default([]),
    breakfast: z.string().optional(),
    lunch: z.string().optional(),
    dinner: z.string().optional(),
    accommodation: z.string().optional(),
  })).optional()
})

// GET /api/packages/[id] - Get single package
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
        const packageData = await prisma.package.findUnique({
          where: { id: params.id },
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

        if (!packageData) {
          return null
        }

        // Transform data
        const translation = packageData.translations[0]
        return {
          ...packageData,
          name: translation?.name || '',
          description: translation?.description || '',
          shortDescription: translation?.shortDescription || '',
          highlights: translation?.highlights || [],
          included: translation?.included || [],
          notIncluded: translation?.notIncluded || [],
          primaryImage: packageData.media.find(m => m.isPrimary)?.media?.url || packageData.media[0]?.media?.url,
          mediaGallery: packageData.media.map(m => ({
            ...m.media,
            order: m.order,
            isPrimary: m.isPrimary
          })),
          bookingsCount: packageData._count.bookings,
          testimonialsCount: packageData._count.testimonials,
          recentBookings: packageData.bookings,
          testimonials: packageData.testimonials.map(t => ({
            ...t,
            content: t.translations[0]?.content || ''
          }))
        }
      },
      // Fallback data - find matching package from mock data
      mockData.packages.find(pkg => pkg.id === params.id) || null,
      'fetch single package'
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    )
  }
}

// PUT /api/packages/[id] - Update package
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updatePackageSchema.parse(body)

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

    const result = await withDatabaseFallback(
      async () => {
        // Check if package exists
        const existingPackage = await prisma.package.findUnique({
          where: { id: params.id },
          include: {
            versions: {
              orderBy: { version: 'desc' },
              take: 1
            }
          }
        })

        if (!existingPackage) {
          return null
        }

        // Update with transaction
        return await prisma.$transaction(async (tx) => {
      // Update package
      const updatedPackage = await tx.package.update({
        where: { id: params.id },
        data: {
          ...packageData,
          startDate: packageData.startDate ? new Date(packageData.startDate) : undefined,
          endDate: packageData.endDate ? new Date(packageData.endDate) : undefined,
          scheduledAt: packageData.scheduledAt ? new Date(packageData.scheduledAt) : undefined,
          unpublishAt: packageData.unpublishAt ? new Date(packageData.unpublishAt) : undefined,
          publishedAt: packageData.published === true && !existingPackage.published 
            ? new Date() 
            : undefined,
          version: existingPackage.version + 1
        }
      })

      // Update or create translation
      if (name || description || shortDescription || highlights || included || notIncluded) {
        await tx.packageTranslation.upsert({
          where: {
            packageId_language: {
              packageId: params.id,
              language: language as any
            }
          },
          update: {
            ...(name && { name }),
            ...(description && { description }),
            ...(shortDescription !== undefined && { shortDescription }),
            ...(highlights && { highlights }),
            ...(included && { included }),
            ...(notIncluded && { notIncluded })
          },
          create: {
            packageId: params.id,
            language: language as any,
            name: name || '',
            description: description || '',
            shortDescription,
            highlights: highlights || [],
            included: included || [],
            notIncluded: notIncluded || []
          }
        })
      }

      // Update media if provided
      if (mediaIds) {
        // Remove existing media links
        await tx.packageMedia.deleteMany({
          where: { packageId: params.id }
        })

        // Add new media links
        if (mediaIds.length > 0) {
          await tx.packageMedia.createMany({
            data: mediaIds.map((mediaId, index) => ({
              packageId: params.id,
              mediaId,
              order: index,
              isPrimary: index === 0
            }))
          })
        }
      }

      // Update itinerary if provided
      if (itinerary) {
        // Remove existing itinerary
        await tx.itineraryDay.deleteMany({
          where: { packageId: params.id }
        })

        // Add new itinerary
        if (itinerary.length > 0) {
          await tx.itineraryDay.createMany({
            data: itinerary.map(day => ({
              packageId: params.id,
              ...day
            }))
          })
        }
      }

      // Create new version
      await tx.packageVersion.create({
        data: {
          packageId: params.id,
          version: updatedPackage.version,
          data: {
            ...packageData,
            ...(name || description || shortDescription || highlights || included || notIncluded) && {
              translation: {
                name,
                description,
                shortDescription,
                highlights,
                included,
                notIncluded
              }
            },
            ...(mediaIds && { mediaIds }),
            ...(itinerary && { itinerary })
          }
        }
      })

          return updatedPackage
        })
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        id: params.id,
        ...validatedData,
        updatedAt: new Date().toISOString(),
        message: 'Package updated (development mode)'
      } : null,
      'update package'
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating package:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    )
  }
}

// DELETE /api/packages/[id] - Delete package
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await withDatabaseFallback(
      async () => {
        // Check if package exists
        const existingPackage = await prisma.package.findUnique({
          where: { id: params.id },
          include: {
            bookings: {
              where: {
                status: { in: ['PENDING', 'CONFIRMED'] }
              }
            }
          }
        })

        if (!existingPackage) {
          return null
        }

        // Check for active bookings
        if (existingPackage.bookings.length > 0) {
          throw new Error('Cannot delete package with active bookings')
        }

        // Delete package (cascade will handle related records)
        await prisma.package.delete({
          where: { id: params.id }
        })

        return { message: 'Package deleted successfully' }
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        message: 'Package deleted successfully (development mode)'
      } : null,
      'delete package'
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting package:', error)
    if (error.message === 'Cannot delete package with active bookings') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    )
  }
}