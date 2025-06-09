import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

// Validation schema for FIT packages
const fitPackageSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  price: z.number().positive(),
  duration: z.number().positive(),
  location: z.string().min(1),
  category: z.string().default('Bestseller'),
  tourType: z.literal('FIT'),
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
  slug: z.string().optional()
})

// GET /api/dashboard/packages/FIT - Get all FIT packages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Database operation with fallback to file system
    const result = await withDatabaseFallback(
      async () => {
        // Build where clause for FIT packages only
        const where: any = {
          tourType: 'FIT'
        }
        
        if (status) where.status = status
        
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
            orderBy: { createdAt: 'desc' },
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
            tourType: 'FIT',
            category: 'Bestseller'
          })),
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      },
      async () => {
        // Fallback: Try to read from file system, but handle missing directory
        const contentDir = path.join(process.cwd(), 'content', 'packages', 'FIT')
        
        try {
          // Check if directory exists first
          if (!fs.existsSync(contentDir)) {
            console.warn('FIT packages directory not found, using mock data')
            const fitPackages = mockData.packages.filter(pkg => pkg.tourType === 'FIT').map(pkg => ({
              ...pkg,
              category: 'Bestseller'
            }));
            console.log('FIT API returning packages:', fitPackages.map(p => ({ name: p.name, id: p.id }))); // Debug log
            return {
              packages: fitPackages,
              total: mockData.packages.filter(pkg => pkg.tourType === 'FIT').length,
              page,
              totalPages: 1
            }
          }
          
          const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'))
          const packages = []
          
          for (const file of files) {
            const filePath = path.join(contentDir, file)
            const content = fs.readFileSync(filePath, 'utf-8')
            try {
              const packageData = JSON.parse(content)
              
              // Ensure it's a FIT package
              if (packageData.tourType === 'FIT') {
                packages.push({
                  ...packageData,
                  id: packageData.id || file.replace('.json', ''),
                  category: 'Bestseller',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                })
              }
            } catch (parseError) {
              console.error(`Error parsing ${file}:`, parseError)
            }
          }
          
          // Apply filters
          let filteredPackages = packages
          
          if (status) {
            filteredPackages = filteredPackages.filter(pkg => pkg.status === status)
          }
          
          if (search) {
            const searchLower = search.toLowerCase()
            filteredPackages = filteredPackages.filter(pkg => 
              pkg.name.toLowerCase().includes(searchLower) ||
              pkg.description.toLowerCase().includes(searchLower) ||
              pkg.location.toLowerCase().includes(searchLower)
            )
          }
          
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
          console.error('Error reading FIT packages from file system:', error)
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
    console.error('Error fetching FIT packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch FIT packages' },
      { status: 500 }
    )
  }
}

// POST /api/dashboard/packages/FIT - Create new FIT package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate and ensure it's a FIT package
    const validatedData = fitPackageSchema.parse({
      ...body,
      tourType: 'FIT',
      category: 'Bestseller'
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
        const contentDir = path.join(process.cwd(), 'content', 'packages', 'FIT')
        
        // Ensure directory exists
        if (!fs.existsSync(contentDir)) {
          fs.mkdirSync(contentDir, { recursive: true })
        }
        
        const packageData = {
          ...validatedData,
          id: `fit-${Date.now()}`,
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
    console.error('Error creating FIT package:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create FIT package' },
      { status: 500 }
    )
  }
}