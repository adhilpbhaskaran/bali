'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Star, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SafeContentRenderer from '@/components/SafeContentRenderer';

interface GoogleReview {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: number;
  comment: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

interface GoogleReviewsSyncProps {
  businessId?: string;
  itemType: 'package' | 'activity';
  itemId: string;
  itemName: string;
  className?: string;
  autoSync?: boolean;
  syncInterval?: number; // in minutes
}

export default function GoogleReviewsSync({
  businessId,
  itemType,
  itemId,
  itemName,
  className = '',
  autoSync = false,
  syncInterval = 30
}: GoogleReviewsSyncProps) {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Check if Google Business API is configured
  useEffect(() => {
    checkConfiguration();
  }, []);

  // Auto-sync setup
  useEffect(() => {
    if (autoSync && isConfigured) {
      const interval = setInterval(() => {
        syncReviews();
      }, syncInterval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [autoSync, syncInterval, isConfigured]);

  const checkConfiguration = async () => {
    try {
      const response = await fetch('/api/reviews/google/config');
      const data = await response.json();
      setIsConfigured(data.configured);
    } catch (error) {
      console.error('Error checking Google Business configuration:', error);
      setIsConfigured(false);
    }
  };

  const syncReviews = async () => {
    if (!isConfigured) {
      setError('Google Business API not configured');
      return;
    }

    setLoading(true);
    setSyncStatus('syncing');
    setError(null);

    try {
      const response = await fetch('/api/reviews/google/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: businessId || process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_ID,
          itemType,
          itemId,
          itemName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to sync reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
      setLastSync(new Date());
      setSyncStatus('success');
    } catch (error) {
      console.error('Error syncing reviews:', error);
      setError(error instanceof Error ? error.message : 'Failed to sync reviews');
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  if (!isConfigured) {
    return (
      <div className={`bento-card p-6 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Google Business Integration</h3>
          <p className="text-white/70 mb-4">
            Google My Business API is not configured. Contact your administrator to enable real-time review syncing.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              const newWindow = window.open('https://developers.google.com/my-business/content/review-data', '_blank', 'noopener,noreferrer');
              if (newWindow) newWindow.opener = null;
            }}
            aria-label="Learn more about Google My Business API integration (opens in new tab)"
          >
            <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
            Learn More
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Sync Controls */}
      <div className="bento-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">Google Business Reviews</h3>
            <Badge variant={syncStatus === 'success' ? 'default' : syncStatus === 'error' ? 'destructive' : 'secondary'}>
              {syncStatus === 'success' ? 'Synced' : syncStatus === 'error' ? 'Error' : 'Ready'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            {lastSync && (
              <span className="text-sm text-white/60">
                Last sync: {formatDate(lastSync.toISOString())}
              </span>
            )}
            
            <Button
              onClick={syncReviews}
              disabled={loading}
              size="sm"
              variant="outline"
              aria-label={loading ? 'Syncing Google reviews in progress' : 'Sync Google reviews now'}
            >
              {getStatusIcon()}
              {loading ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Reviews Display */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Google Business Reviews ({reviews.length})
          </h4>
          
          {reviews.map((review) => (
            <div key={review.reviewId} className="bento-card p-6">
              <div className="flex items-start gap-4">
                {/* Reviewer Avatar */}
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {review.reviewer.profilePhotoUrl ? (
                    <img
                      src={review.reviewer.profilePhotoUrl}
                      alt={review.reviewer.displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
                
                <div className="flex-1">
                  {/* Reviewer Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold">{review.reviewer.displayName}</h5>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.starRating ? 'text-yellow-500 fill-yellow-500' : 'text-white/30'}
                        />
                      ))}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Google
                    </Badge>
                  </div>
                  
                  {/* Review Content */}
                  <div className="text-white/80 mb-3">
                    <SafeContentRenderer 
                      content={review.comment} 
                      className="text-white/80"
                    />
                  </div>
                  
                  {/* Review Date */}
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="w-4 h-4" />
                    {formatDate(review.createTime)}
                    {review.updateTime !== review.createTime && (
                      <span>(Updated: {formatDate(review.updateTime)})</span>
                    )}
                  </div>
                  
                  {/* Business Reply */}
                  {review.reviewReply && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg border-l-4 border-primary-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Business Reply
                        </Badge>
                        <span className="text-xs text-white/60">
                          {formatDate(review.reviewReply.updateTime)}
                        </span>
                      </div>
                      <div className="text-white/80 text-sm">
                        <SafeContentRenderer 
                          content={review.reviewReply.comment} 
                          className="text-white/80 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {reviews.length === 0 && !loading && syncStatus !== 'idle' && (
        <div className="bento-card p-6 text-center">
          <p className="text-white/70">No Google Business reviews found for this {itemType}.</p>
        </div>
      )}
    </div>
  );
}