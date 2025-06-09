import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

// Validation schema for GIT packages
const gitPackageSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  price: z.number().positive(),
  duration: z.number().positive(),
  location: z.string().min(1),
  category: z.string().default('Upcoming Group Trips'),
  tourType: z.literal('GIT'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  published: z.boolean().default(false),
  mediaGallery: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  included: z.array(z.string()).default([]),
  notIncluded: z.array(z.string()).default([]),
  itinerary: z.array(z.object({
    day: z.number().positive(),
    title: z.string().min(1),
    description: z.string().min(1),
    activities: z.array(z.string()).default([])
  })).default([]),
  language: z.string().default('en'),
  slug: z.string().optional(),
  minParticipants: z.number().positive().default(2),
  maxParticipants: z.number().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  availableDates: z.array(z.string()).default([])
})

// GET /api/dashboard/packages/GIT - Get all GIT packages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const upcoming = searchParams.get('upcoming') // Filter for upcoming dates

    const skip = (page - 1) * limit

    // Database operation with fallback to file system
    const result = await withDatabaseFallback(
      async () => {
        // Build where clause for GIT packages only
        const where: any = {
          tourType: 'GIT'
        }
        
        if (status) where.status = status
        
        if (upcoming === 'true') {
          where.startDate = {
            gte: new Date().toISOString()
          }
        }
        
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } }
          ]
        }

        const [packages, total] = await Promise.all([
          prisma.package.findMany({
            where,
            skip,
            take: limit,
            orderBy: { startDate: 'asc' }, // Order by start date for group tours
            include: {
              media: {
                include: {
                  media: true
                },
                orderBy: { order: 'asc' }
              },
              itinerary: {
                orderBy: { day: 'asc' }
              }
            }
          }),
          prisma.package.count({ where })
        ])

        return {
          packages: packages.map(pkg => ({
            ...pkg,
            tourType: 'GIT',
            category: 'Upcoming Group Trips'
          })),
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      },
      async () => {
        // Fallback: Try to read from file system, but handle missing directory
        const contentDir = path.join(process.cwd(), 'content', 'packages', 'GIT')
        
        try {
          // Check if directory exists first
          if (!fs.existsSync(contentDir)) {
            console.warn('GIT packages directory not found, using mock data')
            const gitPackages = mockData.packages.filter(pkg => pkg.tourType === 'GIT').map(pkg => ({
              ...pkg,
              category: 'Group Tours'
            }));
            console.log('GIT API returning packages:', gitPackages.map(p => ({ name: p.name, id: p.id }))); // Debug log
            return {
              packages: gitPackages,
              total: mockData.packages.filter(pkg => pkg.tourType === 'GIT').length,
              page,
              totalPages: 1
            }
          }
          
          const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'))
          const packages = []
          
          for (const file of files) {
            const filePath = path.join(contentDir, file)
            const content = fs.readFileSync(filePath, 'utf-8')
            const packageData = JSON.parse(content)
            
            // Ensure it's a GIT package
            if (packageData.tourType === 'GIT') {
              packages.push({
                ...packageData,
                category: 'Upcoming Group Trips',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })
            }
          }
          
          // Apply filters
          let filteredPackages = packages
          
          if (status) {
            filteredPackages = filteredPackages.filter(pkg => pkg.status === status)
          }
          
          if (upcoming === 'true') {
            const now = new Date()
            filteredPackages = filteredPackages.filter(pkg => {
              if (pkg.startDate) {
                return new Date(pkg.startDate) >= now
              }
              return true // Include packages without start date
            })
          }
          
          if (search) {
            const searchLower = search.toLowerCase()
            filteredPackages = filteredPackages.filter(pkg => 
              pkg.name.toLowerCase().includes(searchLower) ||
              pkg.description.toLowerCase().includes(searchLower) ||
              pkg.location.toLowerCase().includes(searchLower)
            )
          }
          
          // Sort by start date for group tours
          filteredPackages.sort((a, b) => {
            if (!a.startDate && !b.startDate) return 0
            if (!a.startDate) return 1
            if (!b.startDate) return -1
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          })
          
          // Apply pagination
          const total = filteredPackages.length
          const paginatedPackages = filteredPackages.slice(skip, skip + limit)
          
          return {
            packages: paginatedPackages,
            total,
            page,
            totalPages: Math.ceil(total / limit)
          }
        } catch (error) {
          console.error('Error reading GIT packages from file system:', error)
          return {
            packages: [],
            total: 0,
            page,
            totalPages: 0
          }
        }
      }
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching GIT packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GIT packages' },
      { status: 500 }
    )
  }
}

// POST /api/dashboard/packages/GIT - Create new GIT package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate and ensure it's a GIT package
    const validatedData = gitPackageSchema.parse({
      ...body,
      tourType: 'GIT',
      category: 'Upcoming Group Trips'
    })

    const result = await withDatabaseFallback(
      async () => {
        const newPackage = await prisma.package.create({
          data: {
            ...validatedData,
            basePrice: validatedData.price
          },
          include: {
            media: {
              include: {
                media: true
              },
              orderBy: { order: 'asc' }
            },
            itinerary: {
              orderBy: { day: 'asc' }
            }
          }
        })
        return newPackage
      },
      async () => {
        // Fallback: Save to file system
        const contentDir = path.join(process.cwd(), 'content', 'packages', 'GIT')
        
        // Ensure directory exists
        if (!fs.existsSync(contentDir)) {
          fs.mkdirSync(contentDir, { recursive: true })
        }
        
        const packageData = {
          ...validatedData,
          id: `git-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        const fileName = `${packageData.slug || packageData.id}.json`
        const filePath = path.join(contentDir, fileName)
        
        fs.writeFileSync(filePath, JSON.stringify(packageData, null, 2))
        
        return packageData
      }
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating GIT package:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create GIT package' },
      { status: 500 }
    )
  }
}