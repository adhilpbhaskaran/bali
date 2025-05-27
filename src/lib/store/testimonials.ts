import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  location?: string;
  content: string;
  rating: number;
  image?: string;
  packageId?: string;
  activityId?: string;
  featured: boolean;
  status: 'published' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface TestimonialsStore {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  getTestimonial: (id: string) => Testimonial | undefined;
  toggleFeatured: (id: string) => void;
  updateStatus: (id: string, status: 'published' | 'pending' | 'rejected') => void;
}

export const useTestimonialsStore = create<TestimonialsStore>()(
  persist(
    (set, get) => ({
      testimonials: [
        {
          id: '1',
          name: 'Sarah Johnson',
          role: 'Travel Enthusiast',
          location: 'United States',
          content: 'Our Bali trip was absolutely magical! The team at Bali Malayali arranged everything perfectly. From the stunning beaches to the cultural experiences, every moment was special.',
          rating: 5,
          image: '/images/testimonials/sarah.jpg',
          packageId: '1',
          featured: true,
          status: 'published',
          createdAt: '2025-04-10T08:30:00Z',
          updatedAt: '2025-04-10T08:30:00Z',
        },
        {
          id: '2',
          name: 'David Chen',
          role: 'Photographer',
          location: 'Canada',
          content: 'As a photographer, I was looking for the most scenic spots in Bali. This tour company knew exactly where to take me. I got the most amazing shots of my career!',
          rating: 5,
          image: '/images/testimonials/david.jpg',
          activityId: '3',
          featured: true,
          status: 'published',
          createdAt: '2025-04-15T10:45:00Z',
          updatedAt: '2025-04-15T10:45:00Z',
        },
        {
          id: '3',
          name: 'Emma Garcia',
          role: 'Yoga Instructor',
          location: 'Spain',
          content: 'The spiritual retreat in Ubud was transformative. The accommodations were peaceful, the food was amazing, and the yoga sessions with local instructors were authentic.',
          rating: 4,
          image: '/images/testimonials/emma.jpg',
          packageId: '2',
          featured: false,
          status: 'published',
          createdAt: '2025-04-20T14:20:00Z',
          updatedAt: '2025-04-20T14:20:00Z',
        },
      ],
      
      addTestimonial: (testimonialData) => set((state) => {
        const now = new Date().toISOString();
        const newTestimonial: Testimonial = {
          ...testimonialData,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        
        return {
          testimonials: [...state.testimonials, newTestimonial],
        };
      }),

      updateTestimonial: (id, testimonialData) => set((state) => ({
        testimonials: state.testimonials.map((testimonial) =>
          testimonial.id === id
            ? {
                ...testimonial,
                ...testimonialData,
                updatedAt: new Date().toISOString(),
              }
            : testimonial
        ),
      })),

      deleteTestimonial: (id) => set((state) => ({
        testimonials: state.testimonials.filter((testimonial) => testimonial.id !== id),
      })),

      getTestimonial: (id) => get().testimonials.find((testimonial) => testimonial.id === id),
      
      toggleFeatured: (id) => set((state) => ({
        testimonials: state.testimonials.map((testimonial) =>
          testimonial.id === id
            ? {
                ...testimonial,
                featured: !testimonial.featured,
                updatedAt: new Date().toISOString(),
              }
            : testimonial
        ),
      })),
      
      updateStatus: (id, status) => set((state) => ({
        testimonials: state.testimonials.map((testimonial) =>
          testimonial.id === id
            ? {
                ...testimonial,
                status,
                updatedAt: new Date().toISOString(),
              }
            : testimonial
        ),
      })),
    }),
    {
      name: 'bali-testimonials-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
