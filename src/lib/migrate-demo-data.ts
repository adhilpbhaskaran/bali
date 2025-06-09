import { prisma } from './prisma'
import { withDatabaseFallback } from '@/lib/db-fallback'

// Demo packages data from the main site
const demoPackages = [
  {
    title: "Romantic Bali Honeymoon",
    description: "Experience 7 days of pure romance in the island of gods. This carefully crafted honeymoon package includes luxury accommodations, romantic dinners, couple spa treatments, and visits to Bali's most romantic destinations. Create unforgettable memories with your loved one in paradise.",
    shortDescription: "7 days of pure romance in the island of gods",
    price: 899,
    duration: 7,
    image: "/images/packages/honeymoon.jpg",
    category: "honeymoon",
    location: "Ubud, Seminyak, Nusa Dua",
    highlights: [
      "Luxury beachfront resort accommodation",
      "Private romantic dinner on the beach",
      "Couple spa treatment at award-winning spa",
      "Sunset cruise with champagne",
      "Private guided tour of Ubud",
      "Traditional Balinese blessing ceremony"
    ],
    included: [
      "7 nights accommodation in luxury resorts",
      "Daily breakfast and 3 romantic dinners",
      "Airport transfers in private vehicle",
      "Couple spa treatment (2 hours)",
      "Sunset cruise with drinks",
      "Private guided tours",
      "Traditional blessing ceremony"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Additional meals not mentioned",
      "Optional activities"
    ]
  },
  {
    title: "Bali Adventure Package",
    description: "Embark on thrilling adventures across Bali's most exciting spots. This action-packed package includes volcano trekking, white water rafting, jungle swings, and cultural experiences. Perfect for adventure seekers looking to explore Bali's natural wonders.",
    shortDescription: "Thrilling adventures across Bali's most exciting spots",
    price: 749,
    duration: 5,
    image: "/images/packages/adventure.jpg",
    category: "adventure",
    location: "Mount Batur, Ubud, Ayung River",
    highlights: [
      "Mount Batur sunrise trekking",
      "White water rafting on Ayung River",
      "Bali swing and zip-lining",
      "ATV ride through rice terraces",
      "Traditional village visit",
      "Waterfall exploration"
    ],
    included: [
      "5 nights accommodation",
      "Daily breakfast and 2 lunches",
      "All adventure activities",
      "Professional guides",
      "Safety equipment",
      "Transportation"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Dinner meals",
      "Personal expenses",
      "Tips for guides"
    ]
  },
  {
    title: "Luxury Bali Retreat",
    description: "Experience Bali's finest luxury resorts and spas in this premium package. Indulge in world-class amenities, gourmet dining, and exclusive experiences. Perfect for those seeking the ultimate in comfort and sophistication.",
    shortDescription: "Experience Bali's finest luxury resorts and spas",
    price: 1299,
    duration: 6,
    image: "/images/packages/luxury.jpg",
    category: "luxury",
    location: "Seminyak, Jimbaran, Nusa Dua",
    highlights: [
      "5-star luxury resort accommodation",
      "Private villa with infinity pool",
      "Michelin-starred restaurant dining",
      "Helicopter tour of the island",
      "Private yacht charter",
      "Exclusive spa treatments"
    ],
    included: [
      "6 nights in luxury villas",
      "All meals at premium restaurants",
      "Private butler service",
      "Helicopter island tour",
      "Private yacht charter (half day)",
      "Luxury spa treatments",
      "Private transfers"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Alcoholic beverages",
      "Personal shopping",
      "Additional excursions"
    ]
  },
  {
    title: "Family Fun in Bali",
    description: "Create unforgettable memories with your loved ones in this family-friendly package. Includes kid-friendly activities, cultural experiences, and comfortable accommodations suitable for all ages.",
    shortDescription: "Create unforgettable memories with your loved ones",
    price: 849,
    duration: 6,
    image: "/images/packages/family.jpg",
    category: "family",
    location: "Sanur, Ubud, Kuta",
    highlights: [
      "Family-friendly resort with kids club",
      "Bali Safari and Marine Park visit",
      "Traditional cooking class for families",
      "Beach activities and water sports",
      "Cultural performances",
      "Educational temple visits"
    ],
    included: [
      "6 nights family accommodation",
      "Daily breakfast and 3 family dinners",
      "Kids club activities",
      "Safari park entrance",
      "Family cooking class",
      "Cultural show tickets",
      "Family-friendly transportation"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Lunch meals",
      "Personal expenses",
      "Optional activities"
    ]
  }
]

// Demo activities data
const demoActivities = [
  {
    title: "Mount Batur Sunrise Trek",
    description: "Witness a breathtaking sunrise from Bali's active volcano. This early morning trek takes you to the summit of Mount Batur, where you'll be rewarded with spectacular views of the sunrise over Lake Batur and the surrounding mountains. Includes breakfast cooked by volcanic steam.",
    shortDescription: "Witness a breathtaking sunrise from Bali's active volcano",
    price: 65,
    duration: "6 hours",
    image: "/images/activities/mount-batur.jpg",
    category: "adventure",
    location: "Mount Batur, Kintamani",
    highlights: [
      "Spectacular sunrise views from volcano summit",
      "Breakfast cooked by volcanic steam",
      "Professional local guide",
      "Small group experience",
      "Lake Batur panoramic views"
    ],
    includedItems: [
      "Professional trekking guide",
      "Flashlight and walking stick",
      "Simple breakfast at summit",
      "Hotel pickup and drop-off",
      "Entrance fees"
    ],
    excludedItems: [
      "Personal expenses",
      "Tips for guide",
      "Additional food and drinks",
      "Travel insurance"
    ]
  },
  {
    title: "Ubud Cultural Tour",
    description: "Explore the cultural heart of Bali with experienced local guides. Visit traditional villages, ancient temples, art galleries, and witness local craftsmen at work. Experience authentic Balinese culture and traditions.",
    shortDescription: "Explore the cultural heart of Bali with local guides",
    price: 45,
    duration: "8 hours",
    image: "/images/activities/ubud-tour.jpg",
    category: "cultural",
    location: "Ubud and surrounding villages",
    highlights: [
      "Traditional Balinese village visit",
      "Ancient temple exploration",
      "Local art galleries and workshops",
      "Traditional market experience",
      "Rice terrace walk"
    ],
    includedItems: [
      "Professional cultural guide",
      "Transportation",
      "Temple entrance fees",
      "Traditional lunch",
      "Bottled water"
    ],
    excludedItems: [
      "Personal purchases",
      "Tips for guide",
      "Additional meals",
      "Optional activities"
    ]
  },
  {
    title: "Bali Swing Experience",
    description: "Soar high above the jungle canopy on giant swings with breathtaking views. This Instagram-famous activity offers multiple swing options and photo opportunities in a stunning natural setting.",
    shortDescription: "Soar high above the jungle canopy on giant swings",
    price: 35,
    duration: "3 hours",
    image: "/images/activities/bali-swing.jpg",
    category: "adventure",
    location: "Ubud jungle area",
    highlights: [
      "Multiple swing options",
      "Jungle canopy views",
      "Professional photography",
      "Instagram-worthy spots",
      "Safety equipment provided"
    ],
    includedItems: [
      "Swing access",
      "Safety equipment",
      "Professional photos",
      "Welcome drink",
      "Transportation from Ubud"
    ],
    excludedItems: [
      "Hotel pickup outside Ubud",
      "Personal expenses",
      "Additional food and drinks",
      "Tips"
    ]
  },
  {
    title: "Traditional Balinese Spa",
    description: "Indulge in authentic Balinese massage and treatments using traditional techniques and natural ingredients. Relax and rejuvenate in a peaceful spa setting with experienced therapists.",
    shortDescription: "Indulge in authentic Balinese massage and treatments",
    price: 55,
    duration: "2 hours",
    image: "/images/activities/spa.jpg",
    category: "wellness",
    location: "Various spa locations",
    highlights: [
      "Traditional Balinese massage",
      "Natural ingredient treatments",
      "Experienced therapists",
      "Peaceful spa environment",
      "Herbal tea service"
    ],
    includedItems: [
      "2-hour spa treatment",
      "Traditional massage",
      "Body scrub",
      "Herbal tea",
      "Towels and amenities"
    ],
    excludedItems: [
      "Transportation",
      "Tips for therapist",
      "Additional treatments",
      "Personal expenses"
    ]
  }
]

// Demo testimonials data
const demoTestimonials = [
  {
    name: "Sarah Johnson",
    role: "Travel Enthusiast",
    location: "United States",
    content: "Our Bali trip was absolutely magical! The team at Bali Malayali arranged everything perfectly. From the stunning beaches to the cultural experiences, every moment was special. The honeymoon package exceeded all our expectations.",
    rating: 5,
    image: "/images/testimonials/sarah.jpg",
    featured: true
  },
  {
    name: "David Chen",
    role: "Photographer",
    location: "Canada",
    content: "As a photographer, I was looking for the most scenic spots in Bali. This tour company knew exactly where to take me. I got the most amazing shots of my career! The Mount Batur sunrise trek was absolutely incredible.",
    rating: 5,
    image: "/images/testimonials/david.jpg",
    featured: true
  },
  {
    name: "Emma Garcia",
    role: "Yoga Instructor",
    location: "Spain",
    content: "The spiritual retreat in Ubud was transformative. The accommodations were peaceful, the food was amazing, and the yoga sessions with local instructors were authentic. I'll definitely be back!",
    rating: 4,
    image: "/images/testimonials/emma.jpg",
    featured: false
  }
]

export async function migrateDemoData() {
  return withDatabaseFallback(async () => {
    console.log('Starting demo data migration...')

    // Migrate packages
    console.log('Migrating packages...')
    for (const pkg of demoPackages) {
      const slug = pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      const newPackage = await prisma.package.create({
        data: {
          slug: `${slug}-${Date.now()}`,
          tourType: 'FIT',
          status: 'PUBLISHED',
          published: true,
          publishedAt: new Date(),
          basePrice: pkg.price,
          duration: pkg.duration,
          location: pkg.location,
          category: pkg.category,
          minParticipants: 1,
          isFlexibleDates: true
        }
      })

      // Create English translation
      await prisma.packageTranslation.create({
        data: {
          packageId: newPackage.id,
          language: 'EN',
          name: pkg.title,
          description: pkg.description,
          shortDescription: pkg.shortDescription,
          highlights: pkg.highlights,
          included: pkg.included,
          notIncluded: pkg.notIncluded
        }
      })

      // Create initial version
      await prisma.packageVersion.create({
        data: {
          packageId: newPackage.id,
          version: 1,
          data: {
            ...pkg,
            translation: {
              name: pkg.title,
              description: pkg.description,
              shortDescription: pkg.shortDescription,
              highlights: pkg.highlights,
              included: pkg.included,
              notIncluded: pkg.notIncluded
            }
          }
        }
      })

      console.log(`Created package: ${pkg.title}`)
    }

    // Migrate activities
    console.log('Migrating activities...')
    for (const activity of demoActivities) {
      const slug = activity.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      const newActivity = await prisma.activity.create({
        data: {
          slug: `${slug}-${Date.now()}`,
          status: 'PUBLISHED',
          published: true,
          publishedAt: new Date(),
          basePrice: activity.price,
          duration: activity.duration,
          location: activity.location,
          category: activity.category
        }
      })

      // Create English translation
      await prisma.activityTranslation.create({
        data: {
          activityId: newActivity.id,
          language: 'EN',
          name: activity.title,
          description: activity.description,
          shortDescription: activity.shortDescription,
          highlights: activity.highlights,
          includedItems: activity.includedItems,
          excludedItems: activity.excludedItems
        }
      })

      // Create initial version
      await prisma.activityVersion.create({
        data: {
          activityId: newActivity.id,
          version: 1,
          data: {
            ...activity,
            translation: {
              name: activity.title,
              description: activity.description,
              shortDescription: activity.shortDescription,
              highlights: activity.highlights,
              includedItems: activity.includedItems,
              excludedItems: activity.excludedItems
            }
          }
        }
      })

      console.log(`Created activity: ${activity.title}`)
    }

    // Migrate testimonials
    console.log('Migrating testimonials...')
    for (const testimonial of demoTestimonials) {
      const newTestimonial = await prisma.testimonial.create({
        data: {
          name: testimonial.name,
          role: testimonial.role,
          location: testimonial.location,
          rating: testimonial.rating,
          status: 'PUBLISHED',
          published: true,
          publishedAt: new Date(),
          featured: testimonial.featured
        }
      })

      // Create English translation
      await prisma.testimonialTranslation.create({
        data: {
          testimonialId: newTestimonial.id,
          language: 'EN',
          content: testimonial.content
        }
      })

      // Create initial version
      await prisma.testimonialVersion.create({
        data: {
          testimonialId: newTestimonial.id,
          version: 1,
          data: {
            ...testimonial,
            translation: {
              content: testimonial.content
            }
          }
        }
      })

      console.log(`Created testimonial: ${testimonial.name}`)
    }

    console.log('Demo data migration completed successfully!')
    return { success: true, message: 'Demo data migrated successfully' }
  }, 
  () => ({ success: false, message: 'Database unavailable in development mode' }),
  'migrate demo data'
  )
}