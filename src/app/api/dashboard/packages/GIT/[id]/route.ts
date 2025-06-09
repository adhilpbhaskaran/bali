import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

// Validation schema for updating GIT packages
const updateGitPackageSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive().optional(),
  duration: z.number().positive().optional(),
  location: z.string().min(1).optional(),
  category: z.string().default('Upcoming Group Trips').optional(),
  tourType: z.literal('GIT').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  published: z.boolean().optional(),
  mediaGallery: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  notIncluded: z.array(z.string()).optional(),
  itinerary: z.array(z.object({
    day: z.number().positive(),
    title: z.string().min(1),
    description: z.string().min(1),
    activities: z.array(z.string()).default([])
  })).optional(),
  language: z.string().optional(),
  slug: z.string().optional(),
  minParticipants: z.number().positive().optional(),
  maxParticipants: z.number().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  availableDates: z.array(z.string()).optional()
})

// GET /api/dashboard/packages/GIT/[id] - Get specific GIT package
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await withDatabaseFallback(
      async () => {
        const packageData = await prisma.package.findFirst({
          where: {
            id,
            tourType: 'GIT'
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

        if (!packageData) {
          return null
        }

        return {
          ...packageData,
          tourType: 'GIT',
          category: 'Upcoming Group Trips'
        }
      },
      async () => {
        // Fallback: Try to read from file system, but handle missing directory
        const contentDir = path.join(process.cwd(), 'content', 'packages', 'GIT')
        
        try {
          // Check if directory exists first
          if (!fs.existsSync(contentDir)) {
            console.warn('GIT packages directory not found, using mock data')
            // Try to find a matching package in mock data
            const mockPackage = mockData.packages.find(pkg => 
              pkg.tourType === 'GIT' && (pkg.id === id || pkg.name?.toLowerCase().replace(/\s+/g, '-') === id)
            )
            
            if (mockPackage) {
              return {
                ...mockPackage,
                category: 'Upcoming Group Trips'
              }
            }
            return null
          }
          
          // Try to find by ID first
          const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'))
          
          for (const file of files) {
            const filePath = path.join(contentDir, file)
            const content = fs.readFileSync(filePath, 'utf-8')
            try {
              const packageData = JSON.parse(content)
              
              if (packageData.id === id || file.replace('.json', '') === id) {
                return {
                  ...packageData,
                  tourType: 'GIT',
                  category: 'Upcoming Group Trips'
                }
              }
            } catch (parseError) {
              console.error(`Error parsing ${file}:`, parseError)
            }
          }
          
          return null
        } catch (error) {
          console.error('Error reading GIT package from file system:', error)
          return null
        }
      }
    )

    if (!result) {
      return NextResponse.json(
        { error: 'GIT package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching GIT package:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GIT package' },
      { status: 500 }
    )
  }
}

// PUT /api/dashboard/packages/GIT/[id] - Update specific GIT package
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Validate and ensure it's a GIT package
    const validatedData = updateGitPackageSchema.parse({
      ...body,
      tourType: 'GIT',
      category: 'Upcoming Group Trips'
    })

    const result = await withDatabaseFallback(
      async () => {
        // Check if package exists and is GIT type
        const existingPackage = await prisma.package.findFirst({
          where: {
            id,
            tourType: 'GIT'
          }
        })

        if (!existingPackage) {
          return null
        }

        const updatedPackage = await prisma.package.update({
          where: { id },
          data: {
            ...validatedData,
            updatedAt: new Date()
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
        
        return updatedPackage
      },
      async () => {
        // Fallback: Update file system
        const contentDir = path.join(process.cwd(), 'content', 'packages', 'GIT')
        
        try {
          const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'))
          let packageFile = null
          let packageData = null
          
          // Find the package file
          for (const file of files) {
            const filePath = path.join(contentDir, file)
            const content = fs.readFileSync(filePath, 'utf-8')
            const data = JSON.parse(content)
            
            if (data.id === id || file.replace('.json', '') === id) {
              packageFile = filePath
              packageData = data
              break
            }
          }
          
          if (!packageFile || !packageData) {
            return null
          }
          
          // Update the package data
          const updatedData = {
            ...packageData,
            ...validatedData,
            updatedAt: new Date().toISOString()
          }
          
          fs.writeFileSync(packageFile, JSON.stringify(updatedData, null, 2))
          
          return updatedData
        } catch (error) {
          console.error('Error updating GIT package in file system:', error)
          return null
        }
      }
    )

    if (!result) {
      return NextResponse.json(
        { error: 'GIT package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating GIT package:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update GIT package' },
      { status: 500 }
    )
  }
}

// DELETE /api/dashboard/packages/GIT/[id] - Delete specific GIT package
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await withDatabaseFallback(
      async () => {
        // Check if package exists and is GIT type
        const existingPackage = await prisma.package.findFirst({
          where: {
            id,
            tourType: 'GIT'
          }
        })

        if (!existingPackage) {
          return null
        }

        await prisma.package.delete({
          where: { id }
        })
        
        return { success: true }
      },
      async () => {
        // Fallback: Delete from file system
        const contentDir = path.join(process.cwd(), 'content', 'packages', 'GIT')
        
        try {
          const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'))
          
          for (const file of files) {
            const filePath = path.join(contentDir, file)
            const content = fs.readFileSync(filePath, 'utf-8')
            const packageData = JSON.parse(content)
            
            if (packageData.id === id || file.replace('.json', '') === id) {
              fs.unlinkSync(filePath)
              return { success: true }
            }
          }
          
          return null
        } catch (error) {
          console.error('Error deleting GIT package from file system:', error)
          return null
        }
      }
    )

    if (!result) {
      return NextResponse.json(
        { error: 'GIT package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'GIT package deleted successfully' })
  } catch (error) {
    console.error('Error deleting GIT package:', error)
    return NextResponse.json(
      { error: 'Failed to delete GIT package' },
      { status: 500 }
    )
  }
}