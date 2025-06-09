import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

// Google My Business API types
interface GoogleBusinessReview {
  name: string;
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

interface SyncRequest {
  businessId?: string;
  itemType: 'package' | 'activity';
  itemId: string;
  itemName: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SyncRequest = await request.json();
    const { businessId, itemType, itemId, itemName } = body;
    
    // Validate required fields
    if (!itemType || !itemId || !itemName) {
      return NextResponse.json(
        { error: 'Missing required fields: itemType, itemId, itemName' },
        { status: 400 }
      );
    }
    
    // Check if Google My Business API is configured
    const googleApiKey = process.env.GOOGLE_MY_BUSINESS_API_KEY;
    const googleBusinessId = businessId || process.env.GOOGLE_BUSINESS_ID;
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!googleApiKey || !googleBusinessId || !serviceAccountKey) {
      return NextResponse.json(
        { error: 'Google My Business API not configured' },
        { status: 503 }
      );
    }
    
    // Initialize Google Auth
    let auth: GoogleAuth;
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      auth = new GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/business.manage']
      });
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
      return NextResponse.json(
        { error: 'Invalid Google service account configuration' },
        { status: 500 }
      );
    }
    
    // Get authenticated client
    const authClient = await auth.getClient();
    
    // Fetch reviews from Google My Business API
    const reviewsUrl = `https://mybusiness.googleapis.com/v4/accounts/${googleBusinessId}/locations/${googleBusinessId}/reviews`;
    
    try {
      const response = await authClient.request({
        url: reviewsUrl,
        method: 'GET',
        params: {
          pageSize: 50, // Maximum allowed by API
          orderBy: 'updateTime desc'
        }
      });
      
      const googleReviews = response.data.reviews || [];
      
      // Transform Google reviews to our format
      const transformedReviews = googleReviews.map((review: GoogleBusinessReview) => ({
        reviewId: review.reviewId,
        reviewer: {
          displayName: review.reviewer.displayName,
          profilePhotoUrl: review.reviewer.profilePhotoUrl
        },
        starRating: convertStarRating(review.starRating),
        comment: review.comment || '',
        createTime: review.createTime,
        updateTime: review.updateTime,
        reviewReply: review.reviewReply ? {
          comment: review.reviewReply.comment,
          updateTime: review.reviewReply.updateTime
        } : undefined
      }));
      
      // Filter reviews that might be relevant to the specific item
      // This is a basic implementation - you might want to implement more sophisticated matching
      const relevantReviews = transformedReviews.filter(review => {
        const comment = review.comment.toLowerCase();
        const itemNameLower = itemName.toLowerCase();
        
        // Check if review mentions the item name or related keywords
        return comment.includes(itemNameLower) || 
               comment.includes(itemType) ||
               comment.includes('package') ||
               comment.includes('tour') ||
               comment.includes('activity');
      });
      
      // TODO: Save synced reviews to database
      // Example: await db.googleReviews.upsert({ where: { reviewId }, data: review });
      
      // Log successful sync
      console.log(`Synced ${relevantReviews.length} Google reviews for ${itemType} ${itemId}`);
      
      return NextResponse.json({
        success: true,
        message: `Successfully synced ${relevantReviews.length} reviews`,
        reviews: relevantReviews,
        totalGoogleReviews: transformedReviews.length,
        relevantReviews: relevantReviews.length,
        syncedAt: new Date().toISOString()
      });
      
    } catch (apiError: any) {
      console.error('Google My Business API Error:', apiError);
      
      // Handle specific API errors
      if (apiError.response?.status === 403) {
        return NextResponse.json(
          { error: 'Access denied. Check Google My Business API permissions.' },
          { status: 403 }
        );
      } else if (apiError.response?.status === 404) {
        return NextResponse.json(
          { error: 'Business location not found. Check your Google Business ID.' },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          { error: 'Failed to fetch reviews from Google My Business API' },
          { status: 500 }
        );
      }
    }
    
  } catch (error) {
    console.error('Error syncing Google reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error while syncing reviews' },
      { status: 500 }
    );
  }
}

// Helper function to convert Google's star rating format to number
function convertStarRating(starRating: string): number {
  switch (starRating) {
    case 'ONE': return 1;
    case 'TWO': return 2;
    case 'THREE': return 3;
    case 'FOUR': return 4;
    case 'FIVE': return 5;
    default: return 0;
  }
}

// Alternative implementation using Google My Business API v4.9 (newer version)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const businessId = searchParams.get('businessId');
  const itemType = searchParams.get('itemType');
  const itemId = searchParams.get('itemId');
  
  if (!businessId || !itemType || !itemId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }
  
  // Return mock data for development/testing
  const mockReviews = [
    {
      reviewId: 'mock-review-1',
      reviewer: {
        displayName: 'John Smith',
        profilePhotoUrl: '/images/testimonials/person1.jpg'
      },
      starRating: 5,
      comment: 'Amazing experience with Bali Malayali! The package was well organized and our guide was fantastic.',
      createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      reviewId: 'mock-review-2',
      reviewer: {
        displayName: 'Sarah Johnson'
      },
      starRating: 4,
      comment: 'Great service and beautiful locations. Highly recommend for anyone visiting Bali!',
      createTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      reviewReply: {
        comment: 'Thank you for your wonderful review! We\'re glad you enjoyed your experience with us.',
        updateTime: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  ];
  
  return NextResponse.json({
    success: true,
    reviews: mockReviews,
    message: 'Mock Google reviews (replace with real API in production)',
    syncedAt: new Date().toISOString()
  });
}