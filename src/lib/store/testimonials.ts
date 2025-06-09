import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Testimonial {
  id: string
  name: string
  role: string
  location: string
  content: string
  rating: number
  image?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  published: boolean
  publishedAt?: Date
  scheduledAt?: Date
  featured: boolean
  createdAt: Date
  updatedAt: Date
  language?: string
}

interface TestimonialsState {
  testimonials: Testimonial[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalCount: number
  searchQuery: string
  statusFilter: string
  featuredFilter: string
  
  // Actions
  fetchTestimonials: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    featured?: boolean
    language?: string
  }) => Promise<void>
  addTestimonial: (testimonialData: any) => Promise<Testimonial | null>
  updateTestimonial: (id: string, testimonialData: any) => Promise<Testimonial | null>
  deleteTestimonial: (id: string) => Promise<boolean>
  getTestimonial: (id: string) => Promise<Testimonial | null>
  publishTestimonial: (id: string) => Promise<boolean>
  unpublishTestimonial: (id: string) => Promise<boolean>
  scheduleTestimonial: (id: string, scheduledAt: Date) => Promise<boolean>
  toggleFeatured: (id: string) => Promise<boolean>
  updateStatus: (id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => Promise<boolean>
  
  // UI State
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setFeaturedFilter: (featured: string) => void
  setCurrentPage: (page: number) => void
}

export const useTestimonialsStore = create<TestimonialsState>()(devtools(
  (set, get) => ({
    testimonials: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    searchQuery: '',
    statusFilter: '',
    featuredFilter: '',

    fetchTestimonials: async (params = {}) => {
      set({ loading: true, error: null })
      try {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.set('page', params.page.toString())
        if (params.limit) queryParams.set('limit', params.limit.toString())
        if (params.search) queryParams.set('search', params.search)
        if (params.status) queryParams.set('status', params.status)
        if (params.featured !== undefined) queryParams.set('featured', params.featured.toString())
        if (params.language) queryParams.set('language', params.language)

        const response = await fetch(`/api/testimonials?${queryParams}`)
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials')
        }

        const data = await response.json()
        set({
          testimonials: data.testimonials,
          currentPage: data.pagination.page,
          totalPages: data.pagination.totalPages,
          totalCount: data.pagination.total,
          loading: false
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch testimonials',
          loading: false 
        })
      }
    },

    addTestimonial: async (testimonialData) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/testimonials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testimonialData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create testimonial')
        }

        const newTestimonial = await response.json()
        set((state) => ({
          testimonials: [newTestimonial, ...state.testimonials],
          totalCount: state.totalCount + 1,
          loading: false
        }))
        return newTestimonial
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create testimonial',
          loading: false 
        })
        return null
      }
    },

    updateTestimonial: async (id, testimonialData) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/testimonials/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testimonialData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update testimonial')
        }

        const updatedTestimonial = await response.json()
        set((state) => ({
          testimonials: state.testimonials.map((testimonial) =>
            testimonial.id === id ? updatedTestimonial : testimonial
          ),
          loading: false
        }))
        return updatedTestimonial
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update testimonial',
          loading: false 
        })
        return null
      }
    },

    deleteTestimonial: async (id) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/testimonials/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete testimonial')
        }

        set((state) => ({
          testimonials: state.testimonials.filter((testimonial) => testimonial.id !== id),
          totalCount: state.totalCount - 1,
          loading: false
        }))
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to delete testimonial',
          loading: false 
        })
        return false
      }
    },

    getTestimonial: async (id) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/testimonials/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch testimonial')
        }

        const testimonialData = await response.json()
        set({ loading: false })
        return testimonialData
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch testimonial',
          loading: false 
        })
        return null
      }
    },

    publishTestimonial: async (id) => {
      try {
        const response = await fetch(`/api/testimonials/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            published: true, 
            status: 'PUBLISHED',
            publishedAt: new Date().toISOString()
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to publish testimonial')
        }

        const updatedTestimonial = await response.json()
        set((state) => ({
          testimonials: state.testimonials.map((testimonial) =>
            testimonial.id === id ? updatedTestimonial : testimonial
          )
        }))
        return true
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Failed to publish testimonial' })
        return false
      }
    },

    unpublishTestimonial: async (id) => {
      try {
        const response = await fetch(`/api/testimonials/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            published: false, 
            status: 'DRAFT'
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to unpublish testimonial')
        }

        const updatedTestimonial = await response.json()
        set((state) => ({
          testimonials: state.testimonials.map((testimonial) =>
            testimonial.id === id ? updatedTestimonial : testimonial
          )
        }))
        return true
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Failed to unpublish testimonial' })
        return false
      }
    },

    scheduleTestimonial: async (id, scheduledAt) => {
      try {
        const response = await fetch(`/api/testimonials/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            scheduledAt: scheduledAt.toISOString(),
            status: 'DRAFT'
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to schedule testimonial')
        }

        const updatedTestimonial = await response.json()
        set((state) => ({
          testimonials: state.testimonials.map((testimonial) =>
            testimonial.id === id ? updatedTestimonial : testimonial
          )
        }))
        return true
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Failed to schedule testimonial' })
        return false
      }
    },

    toggleFeatured: async (id) => {
      try {
        const testimonial = get().testimonials.find(t => t.id === id)
        if (!testimonial) throw new Error('Testimonial not found')

        const response = await fetch(`/api/testimonials/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            featured: !testimonial.featured
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to toggle featured status')
        }

        const updatedTestimonial = await response.json()
        set((state) => ({
          testimonials: state.testimonials.map((testimonial) =>
            testimonial.id === id ? updatedTestimonial : testimonial
          )
        }))
        return true
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Failed to toggle featured status' })
        return false
      }
    },

    updateStatus: async (id, status) => {
      try {
        const response = await fetch(`/api/testimonials/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        })

        if (!response.ok) {
          throw new Error('Failed to update testimonial status')
        }

        const updatedTestimonial = await response.json()
        set((state) => ({
          testimonials: state.testimonials.map((testimonial) =>
            testimonial.id === id ? updatedTestimonial : testimonial
          )
        }))
        return true
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Failed to update testimonial status' })
        return false
      }
    },

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setStatusFilter: (status) => set({ statusFilter: status }),
    setFeaturedFilter: (featured) => set({ featuredFilter: featured }),
    setCurrentPage: (page) => set({ currentPage: page }),
  }),
  { name: 'testimonials-store' }
))
