import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if Google My Business API credentials are configured
    const googleApiKey = process.env.GOOGLE_MY_BUSINESS_API_KEY;
    const googleBusinessId = process.env.GOOGLE_BUSINESS_ID;
    const googleServiceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    const configured = !!(googleApiKey && googleBusinessId && googleServiceAccountKey);
    
    return NextResponse.json({
      configured,
      hasApiKey: !!googleApiKey,
      hasBusinessId: !!googleBusinessId,
      hasServiceAccount: !!googleServiceAccountKey,
      message: configured 
        ? 'Google My Business API is properly configured' 
        : 'Google My Business API configuration is incomplete'
    });
  } catch (error) {
    console.error('Error checking Google Business configuration:', error);
    return NextResponse.json(
      { 
        configured: false, 
        error: 'Failed to check configuration' 
      },
      { status: 500 }
    );
  }
}