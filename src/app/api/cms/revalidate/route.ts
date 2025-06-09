import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const revalidateSchema = z.object({
  paths: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  type: z.enum(['path', 'tag', 'all']).default('path'),
})

// POST /api/cms/revalidate
export async function POST(request: NextRequest) {
  try {
    // Handle authentication with graceful fallback for development
    let userId = null;
    try {
      const authResult = auth();
      userId = authResult.userId;
    } catch (authError) {
      console.warn('Clerk auth error in revalidate API:', authError);
      // In development mode, allow access without authentication
      if (process.env.NODE_ENV === 'development') {
        console.warn('Development mode: Allowing revalidate API access without authentication');
        userId = 'dev-user'; // Mock user ID for development
      }
    }
    
    if (!userId && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { paths, tags, type } = revalidateSchema.parse(body)

    const revalidatedPaths: string[] = []
    const revalidatedTags: string[] = []

    try {
      if (type === 'all') {
        // Revalidate common paths
        const commonPaths = [
          '/',
          '/packages',
          '/activities',
          '/testimonials',
          '/api/packages',
          '/api/activities',
          '/api/testimonials',
        ]
        
        for (const path of commonPaths) {
          revalidatePath(path)
          revalidatedPaths.push(path)
        }

        // Revalidate common tags
        const commonTags = [
          'packages',
          'activities',
          'testimonials',
          'media',
        ]
        
        for (const tag of commonTags) {
          revalidateTag(tag)
          revalidatedTags.push(tag)
        }
      } else if (type === 'path' && paths) {
        // Revalidate specific paths
        for (const path of paths) {
          revalidatePath(path)
          revalidatedPaths.push(path)
        }
      } else if (type === 'tag' && tags) {
        // Revalidate specific tags
        for (const tag of tags) {
          revalidateTag(tag)
          revalidatedTags.push(tag)
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Cache revalidated successfully',
        revalidated: {
          paths: revalidatedPaths,
          tags: revalidatedTags,
        },
      })
    } catch (revalidateError) {
      console.error('Error during revalidation:', revalidateError)
      return NextResponse.json(
        { 
          error: 'Revalidation failed',
          details: revalidateError instanceof Error ? revalidateError.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error in revalidate API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/cms/revalidate - Get information about revalidation
export async function GET() {
  try {
    // Handle authentication with graceful fallback for development
    let userId = null;
    try {
      const authResult = auth();
      userId = authResult.userId;
    } catch (authError) {
      console.warn('Clerk auth error in revalidate API:', authError);
      // In development mode, allow access without authentication
      if (process.env.NODE_ENV === 'development') {
        console.warn('Development mode: Allowing revalidate API access without authentication');
        userId = 'dev-user'; // Mock user ID for development
      }
    }
    
    if (!userId && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      message: 'Revalidation API endpoint',
      availableTypes: ['path', 'tag', 'all'],
      commonPaths: [
        '/',
        '/packages',
        '/activities',
        '/testimonials',
        '/api/packages',
        '/api/activities',
        '/api/testimonials',
      ],
      commonTags: [
        'packages',
        'activities',
        'testimonials',
        'media',
      ],
      usage: {
        path: 'POST with { "type": "path", "paths": ["/path1", "/path2"] }',
        tag: 'POST with { "type": "tag", "tags": ["tag1", "tag2"] }',
        all: 'POST with { "type": "all" }',
      },
    })
  } catch (error) {
    console.error('Error in revalidate GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}