import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface CMSSettings {
  defaultLanguage: 'en' | 'hi' | 'ml'
  enabledLanguages: ('en' | 'hi' | 'ml')[]
  autoSave: boolean
  autoSaveInterval: number // in seconds
  enableVersioning: boolean
  maxVersions: number
  enableScheduledPublishing: boolean
  enablePreviewMode: boolean
  siteUrl: string
  mediaUploadPath: string
  maxFileSize: number // in MB
  allowedFileTypes: string[]
}

export interface CMSStats {
  totalPackages: number
  totalActivities: number
  totalTestimonials: number
  totalMedia: number
  publishedPackages: number
  publishedActivities: number
  publishedTestimonials: number
  draftPackages: number
  draftActivities: number
  draftTestimonials: number
  scheduledPackages: number
  scheduledActivities: number
  scheduledTestimonials: number
}

export interface BackupInfo {
  id: string
  name: string
  description?: string
  createdAt: Date
  size: number
  type: 'manual' | 'automatic'
  status: 'completed' | 'in_progress' | 'failed'
}

interface CMSState {
  settings: CMSSettings
  stats: CMSStats
  backups: BackupInfo[]
  loading: boolean
  error: string | null
  previewMode: boolean
  currentLanguage: 'en' | 'hi' | 'ml'
  unsavedChanges: boolean
  lastSaved: Date | null
  
  // Actions
  fetchSettings: () => Promise<void>
  updateSettings: (settings: Partial<CMSSettings>) => Promise<boolean>
  fetchStats: () => Promise<void>
  fetchBackups: () => Promise<void>
  createBackup: (name: string, description?: string) => Promise<boolean>
  restoreBackup: (backupId: string) => Promise<boolean>
  deleteBackup: (backupId: string) => Promise<boolean>
  migrateDemoData: () => Promise<boolean>
  revalidateCache: (paths?: string[]) => Promise<boolean>
  
  // UI State
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPreviewMode: (enabled: boolean) => void
  setCurrentLanguage: (language: 'en' | 'hi' | 'ml') => void
  setUnsavedChanges: (hasChanges: boolean) => void
  setLastSaved: (date: Date) => void
}

const defaultSettings: CMSSettings = {
  defaultLanguage: 'en',
  enabledLanguages: ['en', 'hi', 'ml'],
  autoSave: true,
  autoSaveInterval: 30,
  enableVersioning: true,
  maxVersions: 10,
  enableScheduledPublishing: true,
  enablePreviewMode: true,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  mediaUploadPath: '/uploads',
  maxFileSize: 10,
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4', 'application/pdf'],
}

const defaultStats: CMSStats = {
  totalPackages: 0,
  totalActivities: 0,
  totalTestimonials: 0,
  totalMedia: 0,
  publishedPackages: 0,
  publishedActivities: 0,
  publishedTestimonials: 0,
  draftPackages: 0,
  draftActivities: 0,
  draftTestimonials: 0,
  scheduledPackages: 0,
  scheduledActivities: 0,
  scheduledTestimonials: 0,
}

export const useCMSStore = create<CMSState>()(devtools(
  (set, get) => ({
    settings: defaultSettings,
    stats: defaultStats,
    backups: [],
    loading: false,
    error: null,
    previewMode: false,
    currentLanguage: 'en',
    unsavedChanges: false,
    lastSaved: null,

    fetchSettings: async () => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/cms/settings')
        if (!response.ok) {
          throw new Error('Failed to fetch settings')
        }

        const settings = await response.json()
        set({ settings, loading: false })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch settings',
          loading: false 
        })
      }
    },

    updateSettings: async (newSettings) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/cms/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSettings),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update settings')
        }

        const updatedSettings = await response.json()
        set({ settings: updatedSettings, loading: false })
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update settings',
          loading: false 
        })
        return false
      }
    },

    fetchStats: async () => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/cms/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }

        const stats = await response.json()
        set({ stats, loading: false })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch stats',
          loading: false 
        })
      }
    },

    fetchBackups: async () => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/cms/backups')
        if (!response.ok) {
          throw new Error('Failed to fetch backups')
        }

        const backups = await response.json()
        set({ backups, loading: false })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch backups',
          loading: false 
        })
      }
    },

    createBackup: async (name, description) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/cms/backups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, description }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create backup')
        }

        const newBackup = await response.json()
        set((state) => ({
          backups: [newBackup, ...state.backups],
          loading: false
        }))
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create backup',
          loading: false 
        })
        return false
      }
    },

    restoreBackup: async (backupId) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/cms/backups/${backupId}/restore`, {
          method: 'POST',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to restore backup')
        }

        set({ loading: false })
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to restore backup',
          loading: false 
        })
        return false
      }
    },

    deleteBackup: async (backupId) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/cms/backups/${backupId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete backup')
        }

        set((state) => ({
          backups: state.backups.filter(backup => backup.id !== backupId),
          loading: false
        }))
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to delete backup',
          loading: false 
        })
        return false
      }
    },

    migrateDemoData: async () => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/migrate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_MIGRATION_SECRET }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to migrate demo data')
        }

        set({ loading: false })
        // Refresh stats after migration
        get().fetchStats()
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to migrate demo data',
          loading: false 
        })
        return false
      }
    },

    revalidateCache: async (paths) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/cms/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paths }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to revalidate cache')
        }

        set({ loading: false })
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to revalidate cache',
          loading: false 
        })
        return false
      }
    },

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setPreviewMode: (enabled) => set({ previewMode: enabled }),
    setCurrentLanguage: (language) => set({ currentLanguage: language }),
    setUnsavedChanges: (hasChanges) => set({ unsavedChanges: hasChanges }),
    setLastSaved: (date) => set({ lastSaved: date }),
  }),
  { name: 'cms-store' }
))