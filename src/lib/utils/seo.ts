'use client';

import { Metadata } from 'next';
import { logger } from '@/lib/utils/logger';

// SEO configuration types
export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  twitterHandle: string;
  facebookAppId?: string;
  locale: string;
  alternateLocales?: string[];
}

export interface PageSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ReviewData {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}

export interface ProductData {
  name: string;
  description: string;
  image: string[];
  brand: string;
  sku?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  reviews?: ReviewData[];
}

export interface ArticleData {
  headline: string;
  description: string;
  image: string[];
  author: string;
  datePublished: string;
  dateModified?: string;
  publisher: string;
  publisherLogo: string;
}

export interface LocalBusinessData {
  name: string;
  description: string;
  image: string[];
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  email?: string;
  url: string;
  openingHours: string[];
  priceRange?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
}

// Default SEO configuration
const DEFAULT_SEO_CONFIG: SEOConfig = {
  siteName: 'Bali Malayali',
  siteUrl: 'https://balimalayali.com',
  defaultTitle: 'Bali Malayali - Your Gateway to Bali',
  defaultDescription: 'Discover the best of Bali with Bali Malayali. Travel guides, cultural insights, and authentic experiences in the Island of Gods.',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@balimalayali',
  locale: 'en_US',
  alternateLocales: ['ml_IN']
};

// SEO utility class
class SEOManager {
  private config: SEOConfig;

  constructor(config: Partial<SEOConfig> = {}) {
    this.config = { ...DEFAULT_SEO_CONFIG, ...config };
  }

  /**
   * Generate metadata for Next.js pages
   */
  generateMetadata(pageSEO: PageSEO = {}): Metadata {
    const {
      title,
      description,
      keywords,
      image,
      url,
      type = 'website',
      publishedTime,
      modifiedTime,
      author,
      section,
      tags,
      noIndex = false,
      noFollow = false,
      canonical
    } = pageSEO;

    const fullTitle = title 
      ? `${title} | ${this.config.siteName}`
      : this.config.defaultTitle;
    
    const fullDescription = description || this.config.defaultDescription;
    const fullImage = image || this.config.defaultImage;
    const fullUrl = url ? `${this.config.siteUrl}${url}` : this.config.siteUrl;
    const canonicalUrl = canonical || fullUrl;

    const metadata: Metadata = {
      title: fullTitle,
      description: fullDescription,
      keywords: keywords?.join(', '),
      authors: author ? [{ name: author }] : undefined,
      creator: author,
      publisher: this.config.siteName,
      robots: {
        index: !noIndex,
        follow: !noFollow,
        googleBot: {
          index: !noIndex,
          follow: !noFollow
        }
      },
      alternates: {
        canonical: canonicalUrl,
        languages: this.config.alternateLocales?.reduce((acc, locale) => {
          acc[locale] = `${fullUrl}?lang=${locale}`;
          return acc;
        }, {} as Record<string, string>)
      },
      openGraph: type === 'article' ? {
        type: 'article' as const,
        title: fullTitle,
        description: fullDescription,
        url: fullUrl,
        siteName: this.config.siteName,
        images: [
          {
            url: fullImage,
            width: 1200,
            height: 630,
            alt: fullTitle
          }
        ],
        locale: this.config.locale,
        alternateLocale: this.config.alternateLocales,
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags
      } : {
        type: type === 'product' ? 'website' : type as 'website' | 'profile',
        title: fullTitle,
        description: fullDescription,
        url: fullUrl,
        siteName: this.config.siteName,
        images: [
          {
            url: fullImage,
            width: 1200,
            height: 630,
            alt: fullTitle
          }
        ],
        locale: this.config.locale,
        alternateLocale: this.config.alternateLocales
      },
      twitter: {
        card: 'summary_large_image',
        site: this.config.twitterHandle,
        creator: this.config.twitterHandle,
        title: fullTitle,
        description: fullDescription,
        images: [fullImage]
      } as const,
      other: this.config.facebookAppId ? {
        'fb:app_id': this.config.facebookAppId
      } : {}
    };

    // Remove undefined values
    return this.cleanMetadata(metadata);
  }

  /**
   * Generate structured data for organization
   */
  generateOrganizationSchema(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.config.siteName,
      url: this.config.siteUrl,
      logo: `${this.config.siteUrl}/images/logo.png`,
      sameAs: [
        `https://twitter.com/${this.config.twitterHandle.replace('@', '')}`,
        `https://facebook.com/${this.config.siteName.toLowerCase().replace(' ', '')}`,
        `https://instagram.com/${this.config.siteName.toLowerCase().replace(' ', '')}`
      ]
    };
  }

  /**
   * Generate structured data for website
   */
  generateWebsiteSchema(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.config.siteName,
      url: this.config.siteUrl,
      description: this.config.defaultDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.config.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbSchema(items: BreadcrumbItem[]): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.config.siteUrl}${item.url}`
      }))
    };
  }

  /**
   * Generate FAQ structured data
   */
  generateFAQSchema(faqs: FAQItem[]): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  /**
   * Generate article structured data
   */
  generateArticleSchema(data: ArticleData): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      image: data.image,
      author: {
        '@type': 'Person',
        name: data.author
      },
      publisher: {
        '@type': 'Organization',
        name: data.publisher,
        logo: {
          '@type': 'ImageObject',
          url: data.publisherLogo
        }
      },
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished
    };
  }

  /**
   * Generate product structured data
   */
  generateProductSchema(data: ProductData): StructuredData {
    const schema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      image: data.image,
      brand: {
        '@type': 'Brand',
        name: data.brand
      }
    };

    if (data.sku) {
      schema.sku = data.sku;
    }

    if (data.price && data.currency) {
      schema.offers = {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: data.currency,
        availability: `https://schema.org/${data.availability || 'InStock'}`
      };
    }

    if (data.reviews && data.reviews.length > 0) {
      schema.review = data.reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5
        },
        reviewBody: review.reviewBody,
        datePublished: review.datePublished
      }));

      // Calculate aggregate rating
      const totalRating = data.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / data.reviews.length;
      
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: data.reviews.length,
        bestRating: 5
      };
    }

    return schema;
  }

  /**
   * Generate local business structured data
   */
  generateLocalBusinessSchema(data: LocalBusinessData): StructuredData {
    const schema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: data.name,
      description: data.description,
      image: data.image,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address.streetAddress,
        addressLocality: data.address.addressLocality,
        addressRegion: data.address.addressRegion,
        postalCode: data.address.postalCode,
        addressCountry: data.address.addressCountry
      },
      telephone: data.telephone,
      url: data.url,
      openingHours: data.openingHours
    };

    if (data.email) {
      schema.email = data.email;
    }

    if (data.priceRange) {
      schema.priceRange = data.priceRange;
    }

    if (data.geo) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: data.geo.latitude,
        longitude: data.geo.longitude
      };
    }

    return schema;
  }

  /**
   * Generate JSON-LD script tag
   */
  generateJSONLD(structuredData: StructuredData | StructuredData[]): string {
    const data = Array.isArray(structuredData) ? structuredData : [structuredData];
    return JSON.stringify(data, null, 2);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SEOConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): SEOConfig {
    return { ...this.config };
  }

  // Private methods
  private cleanMetadata(metadata: Metadata): Metadata {
    const cleaned: any = {};
    
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleanedObject = this.cleanObject(value);
          if (Object.keys(cleanedObject).length > 0) {
            cleaned[key] = cleanedObject;
          }
        } else {
          cleaned[key] = value;
        }
      }
    });
    
    return cleaned;
  }

  private cleanObject(obj: any): any {
    const cleaned: any = {};
    
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleanedObject = this.cleanObject(value);
          if (Object.keys(cleanedObject).length > 0) {
            cleaned[key] = cleanedObject;
          }
        } else {
          cleaned[key] = value;
        }
      }
    });
    
    return cleaned;
  }
}

// Create singleton instance
export const seoManager = new SEOManager();

// Utility functions

/**
 * Generate meta tags for HTML head
 */
export function generateMetaTags(pageSEO: PageSEO = {}): string {
  const metadata = seoManager.generateMetadata(pageSEO);
  const tags: string[] = [];

  // Basic meta tags
  if (metadata.title) {
    tags.push(`<title>${metadata.title}</title>`);
  }
  
  if (metadata.description) {
    tags.push(`<meta name="description" content="${metadata.description}" />`);
  }
  
  if (metadata.keywords) {
    tags.push(`<meta name="keywords" content="${metadata.keywords}" />`);
  }

  // Open Graph tags
  if (metadata.openGraph) {
    const og = metadata.openGraph;
    if (og.title) tags.push(`<meta property="og:title" content="${og.title}" />`);
    if (og.description) tags.push(`<meta property="og:description" content="${og.description}" />`);
    if ('type' in og && og.type) tags.push(`<meta property="og:type" content="${og.type}" />`);
    if (og.url) tags.push(`<meta property="og:url" content="${og.url}" />`);
    if (og.siteName) tags.push(`<meta property="og:site_name" content="${og.siteName}" />`);
    if (og.locale) tags.push(`<meta property="og:locale" content="${og.locale}" />`);
    
    if (og.images && Array.isArray(og.images) && og.images.length > 0) {
      og.images.forEach((image: any) => {
        if (typeof image === 'string') {
          tags.push(`<meta property="og:image" content="${image}" />`);
        } else {
          tags.push(`<meta property="og:image" content="${image.url}" />`);
          if (image.width) tags.push(`<meta property="og:image:width" content="${image.width}" />`);
          if (image.height) tags.push(`<meta property="og:image:height" content="${image.height}" />`);
          if (image.alt) tags.push(`<meta property="og:image:alt" content="${image.alt}" />`);
        }
      });
    }
  }

  // Twitter tags
  if (metadata.twitter) {
    const twitter = metadata.twitter;
    if ('card' in twitter && twitter.card) tags.push(`<meta name="twitter:card" content="${twitter.card}" />`);
    if (twitter.site) tags.push(`<meta name="twitter:site" content="${twitter.site}" />`);
    if (twitter.creator) tags.push(`<meta name="twitter:creator" content="${twitter.creator}" />`);
    if (twitter.title) tags.push(`<meta name="twitter:title" content="${twitter.title}" />`);
    if (twitter.description) tags.push(`<meta name="twitter:description" content="${twitter.description}" />`);
    
    if (twitter.images && Array.isArray(twitter.images) && twitter.images.length > 0) {
      const firstImage = twitter.images[0];
      const imageUrl = typeof firstImage === 'string' ? firstImage : 
        firstImage instanceof URL ? firstImage.toString() : firstImage.url;
      tags.push(`<meta name="twitter:image" content="${imageUrl}" />`);
    }
  }

  // Canonical URL
  if (metadata.alternates?.canonical) {
    tags.push(`<link rel="canonical" href="${metadata.alternates.canonical}" />`);
  }

  // Robots
  if (metadata.robots) {
    const robotsContent = [];
    if (typeof metadata.robots === 'object' && metadata.robots.index === false) robotsContent.push('noindex');
    if (typeof metadata.robots === 'object' && metadata.robots.follow === false) robotsContent.push('nofollow');
    if (robotsContent.length > 0) {
      tags.push(`<meta name="robots" content="${robotsContent.join(', ')}" />`);
    }
  }

  return tags.join('\n');
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  // Simple keyword extraction - in production, use a more sophisticated algorithm
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry(url: string, options: {
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
} = {}): string {
  const { lastmod, changefreq, priority } = options;
  
  let entry = `  <url>\n    <loc>${url}</loc>`;
  
  if (lastmod) {
    entry += `\n    <lastmod>${lastmod}</lastmod>`;
  }
  
  if (changefreq) {
    entry += `\n    <changefreq>${changefreq}</changefreq>`;
  }
  
  if (priority !== undefined) {
    entry += `\n    <priority>${priority}</priority>`;
  }
  
  entry += '\n  </url>';
  
  return entry;
}

/**
 * Validate SEO requirements
 */
export function validateSEO(pageSEO: PageSEO): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!pageSEO.title) {
    warnings.push('Missing page title');
  } else if (pageSEO.title.length > 60) {
    warnings.push('Title is too long (>60 characters)');
  } else if (pageSEO.title.length < 30) {
    warnings.push('Title is too short (<30 characters)');
  }

  // Description validation
  if (!pageSEO.description) {
    errors.push('Missing meta description');
  } else if (pageSEO.description.length > 160) {
    warnings.push('Description is too long (>160 characters)');
  } else if (pageSEO.description.length < 120) {
    warnings.push('Description is too short (<120 characters)');
  }

  // Keywords validation
  if (!pageSEO.keywords || pageSEO.keywords.length === 0) {
    warnings.push('Missing keywords');
  } else if (pageSEO.keywords.length > 10) {
    warnings.push('Too many keywords (>10)');
  }

  // Image validation
  if (!pageSEO.image) {
    warnings.push('Missing social media image');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Log SEO validation results
 */
export function logSEOValidation(pageSEO: PageSEO, pageUrl: string): void {
  const validation = validateSEO(pageSEO);
  
  if (!validation.isValid) {
    logger.error('SEO validation failed', undefined, {
      metadata: {
        url: pageUrl,
        errors: validation.errors,
        warnings: validation.warnings
      }
    });
  } else if (validation.warnings.length > 0) {
    logger.warn('SEO validation warnings', {
      metadata: {
        url: pageUrl,
        warnings: validation.warnings
      }
    });
  } else {
    logger.info('SEO validation passed', {
      metadata: { url: pageUrl }
    });
  }
}

export default seoManager;