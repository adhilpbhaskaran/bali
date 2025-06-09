import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { z } from 'zod'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Validation schemas
const createMediaSchema = z.object({
  filename: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().positive(),
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  folder: z.string().optional(),
  tags: z.array(z.string()).default([])
})

const updateMediaSchema = createMediaSchema.partial()

// GET /api/media - List all media with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const folder = searchParams.get('folder')
    const mimeType = searchParams.get('type')
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (folder) where.folder = folder
    if (mimeType) {
      if (mimeType === 'image') {
        where.mimeType = { startsWith: 'image/' }
      } else if (mimeType === 'video') {
        where.mimeType = { startsWith: 'video/' }
      } else {
        where.mimeType = mimeType
      }
    }
    
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { originalName: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags
      }
    }

    const result = await withDatabaseFallback(
      async () => {
        const [media, total, folders] = await Promise.all([
          prisma.media.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.media.count({ where }),
          prisma.media.findMany({
            select: { folder: true },
            distinct: ['folder'],
            where: { folder: { not: null } }
          })
        ])

        // Get unique folders
        const uniqueFolders = folders
          .map(f => f.folder)
          .filter(Boolean)
          .sort()

        return {
          media,
          folders: uniqueFolders,
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
        media: mockData.media,
        folders: ['uploads', 'images', 'videos'],
        pagination: {
          page: 1,
          limit: 20,
          total: mockData.media.length,
          pages: 1
        }
      },
      'fetch media'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

// POST /api/media - Upload new media
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'
    const alt = formData.get('alt') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const seoTitle = formData.get('seoTitle') as string
    const seoDescription = formData.get('seoDescription') as string
    const tags = formData.get('tags') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'application/pdf'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large (max 10MB)' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Generate URL
    const url = `/uploads/${folder}/${filename}`
    
    // Generate thumbnail for images
    let thumbnail: string | undefined
    if (file.type.startsWith('image/')) {
      // For now, use the same image as thumbnail
      // In production, you might want to generate actual thumbnails
      thumbnail = url
    }

    // Parse tags
    const parsedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : []

    // Save to database
    const result = await withDatabaseFallback(
      async () => {
        return await prisma.media.create({
          data: {
            filename,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            url,
            thumbnail,
            alt: alt || undefined,
            title: title || undefined,
            description: description || undefined,
            seoTitle: seoTitle || undefined,
            seoDescription: seoDescription || undefined,
            folder: folder || undefined,
            tags: parsedTags
          }
        })
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        id: `media-${Date.now()}`,
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url,
        thumbnail,
        alt: alt || null,
        title: title || null,
        description: description || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        folder: folder || null,
        tags: parsedTags,
        createdAt: new Date().toISOString(),
        message: 'Media uploaded (development mode)'
      } : null,
      'upload media'
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    )
  }
}

// PUT /api/media - Bulk update media
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { mediaIds, updates } = body

    if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
      return NextResponse.json(
        { error: 'Media IDs are required' },
        { status: 400 }
      )
    }

    const validatedUpdates = updateMediaSchema.parse(updates)

    const result = await withDatabaseFallback(
      async () => {
        // Bulk update
        const updateResult = await prisma.media.updateMany({
          where: {
            id: { in: mediaIds }
          },
          data: validatedUpdates
        })

        return {
          message: `Updated ${updateResult.count} media items`,
          count: updateResult.count
        }
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        message: `Updated ${mediaIds.length} media items (development mode)`,
        count: mediaIds.length
      } : null,
      'bulk update media'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error bulk updating media:', error)
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

// DELETE /api/media - Bulk delete media
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mediaIds = searchParams.get('ids')?.split(',').filter(Boolean)

    if (!mediaIds || mediaIds.length === 0) {
      return NextResponse.json(
        { error: 'Media IDs are required' },
        { status: 400 }
      )
    }

    const result = await withDatabaseFallback(
      async () => {
        // Check if any media is being used
        const [packageMedia, activityMedia, testimonialMedia] = await Promise.all([
          prisma.packageMedia.findMany({
            where: { mediaId: { in: mediaIds } },
            select: { mediaId: true }
          }),
          prisma.activityMedia.findMany({
            where: { mediaId: { in: mediaIds } },
            select: { mediaId: true }
          }),
          prisma.testimonialMedia.findMany({
            where: { mediaId: { in: mediaIds } },
            select: { mediaId: true }
          })
        ])

        const usedMediaIds = new Set([
          ...packageMedia.map(m => m.mediaId),
          ...activityMedia.map(m => m.mediaId),
          ...testimonialMedia.map(m => m.mediaId)
        ])

        const unusedMediaIds = mediaIds.filter(id => !usedMediaIds.has(id))

        if (unusedMediaIds.length === 0) {
          throw new Error('All selected media items are currently in use')
        }

        // Delete unused media
        const deleteResult = await prisma.media.deleteMany({
          where: {
            id: { in: unusedMediaIds }
          }
        })

        return {
          message: `Deleted ${deleteResult.count} media items`,
          count: deleteResult.count,
          skipped: mediaIds.length - unusedMediaIds.length
        }
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        message: `Deleted ${mediaIds.length} media items (development mode)`,
        count: mediaIds.length,
        skipped: 0
      } : null,
      'bulk delete media'
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