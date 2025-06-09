import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseFallback, mockData } from '@/lib/db-fallback'
import { auth } from '@clerk/nextjs/server'

// GET /api/cms/stats
export async function GET() {
  try {
    // Handle authentication with graceful fallback for development
    let userId = null;
    try {
      const authResult = auth();
      userId = authResult.userId;
    } catch (authError) {
      console.warn('Clerk auth error in stats API:', authError);
      // In development mode, allow access without authentication
      if (process.env.NODE_ENV === 'development') {
        console.warn('Development mode: Allowing stats API access without authentication');
        userId = 'dev-user'; // Mock user ID for development
      }
    }
    
    if (!userId && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await withDatabaseFallback(
      async () => {
        // Get counts for all content types
        const [packageStats, activityStats, testimonialStats, mediaStats] = await Promise.all([
          // Package statistics
          prisma.package.groupBy({
            by: ['status'],
            _count: {
              id: true,
            },
          }),
          
          // Activity statistics
          prisma.activity.groupBy({
            by: ['status'],
            _count: {
              id: true,
            },
          }),
          
          // Testimonial statistics
          prisma.testimonial.groupBy({
            by: ['status'],
            _count: {
              id: true,
            },
          }),
          
          // Media statistics
          prisma.media.count(),
        ])

        // Process package stats
        const packageCounts = {
          total: 0,
          published: 0,
          draft: 0,
          scheduled: 0,
        }

        packageStats.forEach((stat) => {
          packageCounts.total += stat._count.id
          switch (stat.status) {
            case 'PUBLISHED':
              packageCounts.published = stat._count.id
              break
            case 'DRAFT':
              packageCounts.draft = stat._count.id
              break
            case 'SCHEDULED':
              packageCounts.scheduled = stat._count.id
              break
          }
        })

        // Process activity stats
        const activityCounts = {
          total: 0,
          published: 0,
          draft: 0,
          scheduled: 0,
        }

        activityStats.forEach((stat) => {
          activityCounts.total += stat._count.id
          switch (stat.status) {
            case 'PUBLISHED':
              activityCounts.published = stat._count.id
              break
            case 'DRAFT':
              activityCounts.draft = stat._count.id
              break
            case 'SCHEDULED':
              activityCounts.scheduled = stat._count.id
              break
          }
        })

        // Process testimonial stats
        const testimonialCounts = {
          total: 0,
          published: 0,
          draft: 0,
          scheduled: 0,
        }

        testimonialStats.forEach((stat) => {
          testimonialCounts.total += stat._count.id
          switch (stat.status) {
            case 'PUBLISHED':
              testimonialCounts.published = stat._count.id
              break
            case 'DRAFT':
              testimonialCounts.draft = stat._count.id
              break
            case 'SCHEDULED':
              testimonialCounts.scheduled = stat._count.id
              break
          }
        })

        // Get additional statistics
        const [recentPackages, recentActivities, recentTestimonials] = await Promise.all([
          prisma.package.findMany({
            take: 5,
            orderBy: { updatedAt: 'desc' },
            select: {
              id: true,
              title: true,
              status: true,
              updatedAt: true,
            },
          }),
          
          prisma.activity.findMany({
            take: 5,
            orderBy: { updatedAt: 'desc' },
            select: {
              id: true,
              title: true,
              status: true,
              updatedAt: true,
            },
          }),
          
          prisma.testimonial.findMany({
            take: 5,
            orderBy: { updatedAt: 'desc' },
            select: {
              id: true,
              customerName: true,
              status: true,
              updatedAt: true,
            },
          }),
        ])

        return {
          totalPackages: packageCounts.total,
          totalActivities: activityCounts.total,
          totalTestimonials: testimonialCounts.total,
          totalMedia: mediaStats,
          publishedPackages: packageCounts.published,
          publishedActivities: activityCounts.published,
          publishedTestimonials: testimonialCounts.published,
          draftPackages: packageCounts.draft,
          draftActivities: activityCounts.draft,
          draftTestimonials: testimonialCounts.draft,
          scheduledPackages: packageCounts.scheduled,
          scheduledActivities: activityCounts.scheduled,
          scheduledTestimonials: testimonialCounts.scheduled,
          recentContent: {
            packages: recentPackages,
            activities: recentActivities,
            testimonials: recentTestimonials,
          },
        }
      },
      // Fallback data for development mode
      {
        ...mockData.stats,
        message: 'CMS statistics (development mode)'
      },
      'fetch CMS statistics'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching CMS stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}