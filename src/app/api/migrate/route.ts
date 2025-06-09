import { NextRequest, NextResponse } from 'next/server'
import { migrateDemoData } from '@/lib/migrate-demo-data'
import { withDatabaseFallback } from '@/lib/db-fallback'

export async function POST(request: NextRequest) {
  return withDatabaseFallback(async () => {
    // Add basic authentication check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.MIGRATION_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await migrateDemoData()
    
    return NextResponse.json({
      success: true,
      message: 'Demo data migration completed successfully',
      data: result
    })
  }, 
  NextResponse.json({
    success: false,
    message: 'Migration not available in development mode - database unavailable'
  }),
  'migrate demo data'
  )
}

export async function GET() {
  return withDatabaseFallback(async () => {
    return NextResponse.json({
      message: 'Migration endpoint ready. Use POST with proper authorization to migrate demo data.'
    })
  }, 
  NextResponse.json({
    message: 'Migration endpoint ready (development mode - database unavailable). Use POST with proper authorization to migrate demo data.'
  }),
  'check migration endpoint'
  )
}