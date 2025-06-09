import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { auth } from '@clerk/nextjs/server'

const settingsSchema = z.object({
  defaultLanguage: z.enum(['en', 'hi', 'ml']).optional(),
  enabledLanguages: z.array(z.enum(['en', 'hi', 'ml'])).optional(),
  autoSave: z.boolean().optional(),
  autoSaveInterval: z.number().min(10).max(300).optional(),
  enableVersioning: z.boolean().optional(),
  maxVersions: z.number().min(1).max(50).optional(),
  enableScheduledPublishing: z.boolean().optional(),
  enablePreviewMode: z.boolean().optional(),
  siteUrl: z.string().url().optional(),
  mediaUploadPath: z.string().optional(),
  maxFileSize: z.number().min(1).max(100).optional(),
  allowedFileTypes: z.array(z.string()).optional(),
})

// GET /api/cms/settings
export async function GET() {
  try {
    // Handle authentication with graceful fallback for development
    let userId = null;
    try {
      const authResult = auth();
      userId = authResult.userId;
    } catch (authError) {
      console.warn('Clerk auth error in settings API:', authError);
      // In development mode, allow access without authentication
      if (process.env.NODE_ENV === 'development') {
        console.warn('Development mode: Allowing settings API access without authentication');
        userId = 'dev-user'; // Mock user ID for development
      }
    }
    
    if (!userId && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await withDatabaseFallback(
      async () => {
        // Get settings from database or return defaults
        let settings = await prisma.cMSSettings.findFirst()
        
        if (!settings) {
          // Create default settings if none exist
          settings = await prisma.cMSSettings.create({
            data: {
              defaultLanguage: 'en',
              enabledLanguages: ['en', 'hi', 'ml'],
              autoSave: true,
              autoSaveInterval: 30,
              enableVersioning: true,
              maxVersions: 10,
              enableScheduledPublishing: true,
              enablePreviewMode: true,
              siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
              mediaUploadPath: '/uploads',
              maxFileSize: 10,
              allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4', 'application/pdf'],
            },
          })
        }

        return settings
      },
      // Fallback data for development mode
      {
        id: 1,
        defaultLanguage: 'en',
        enabledLanguages: ['en', 'hi', 'ml'],
        autoSave: true,
        autoSaveInterval: 30,
        enableVersioning: true,
        maxVersions: 10,
        enableScheduledPublishing: true,
        enablePreviewMode: true,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        mediaUploadPath: '/uploads',
        maxFileSize: 10,
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4', 'application/pdf'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        message: 'CMS settings (development mode)'
      },
      'fetch CMS settings'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching CMS settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/cms/settings
export async function PUT(request: NextRequest) {
  try {
    // Handle authentication with graceful fallback for development
    let userId = null;
    try {
      const authResult = auth();
      userId = authResult.userId;
    } catch (authError) {
      console.warn('Clerk auth error in settings API:', authError);
      // In development mode, allow access without authentication
      if (process.env.NODE_ENV === 'development') {
        console.warn('Development mode: Allowing settings API access without authentication');
        userId = 'dev-user'; // Mock user ID for development
      }
    }
    
    if (!userId && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    const result = await withDatabaseFallback(
      async () => {
        // Update or create settings
        const settings = await prisma.cMSSettings.upsert({
          where: { id: 1 }, // Assuming single settings record
          update: {
            ...validatedData,
            updatedAt: new Date(),
          },
          create: {
            id: 1,
            defaultLanguage: validatedData.defaultLanguage || 'en',
            enabledLanguages: validatedData.enabledLanguages || ['en', 'hi', 'ml'],
            autoSave: validatedData.autoSave ?? true,
            autoSaveInterval: validatedData.autoSaveInterval || 30,
            enableVersioning: validatedData.enableVersioning ?? true,
            maxVersions: validatedData.maxVersions || 10,
            enableScheduledPublishing: validatedData.enableScheduledPublishing ?? true,
            enablePreviewMode: validatedData.enablePreviewMode ?? true,
            siteUrl: validatedData.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            mediaUploadPath: validatedData.mediaUploadPath || '/uploads',
            maxFileSize: validatedData.maxFileSize || 10,
            allowedFileTypes: validatedData.allowedFileTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4', 'application/pdf'],
          },
        })

        return settings
      },
      // Fallback for development mode
      process.env.NODE_ENV === 'development' ? {
        id: 1,
        ...validatedData,
        defaultLanguage: validatedData.defaultLanguage || 'en',
        enabledLanguages: validatedData.enabledLanguages || ['en', 'hi', 'ml'],
        autoSave: validatedData.autoSave ?? true,
        autoSaveInterval: validatedData.autoSaveInterval || 30,
        enableVersioning: validatedData.enableVersioning ?? true,
        maxVersions: validatedData.maxVersions || 10,
        enableScheduledPublishing: validatedData.enableScheduledPublishing ?? true,
        enablePreviewMode: validatedData.enablePreviewMode ?? true,
        siteUrl: validatedData.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        mediaUploadPath: validatedData.mediaUploadPath || '/uploads',
        maxFileSize: validatedData.maxFileSize || 10,
        allowedFileTypes: validatedData.allowedFileTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4', 'application/pdf'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        message: 'CMS settings updated (development mode)'
      } : null,
      'update CMS settings'
    )

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating CMS settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}