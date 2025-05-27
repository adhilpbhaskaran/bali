import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  twitterHandle?: string;
  googleAnalyticsId?: string;
}

export interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  featuredPackages: string[];
  featuredActivities: string[];
  featuredTestimonials: string[];
  aboutSectionTitle: string;
  aboutSectionContent: string;
  aboutSectionImage: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  mapLocation: {
    lat: number;
    lng: number;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tripadvisor?: string;
  };
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  active: boolean;
  lastLogin?: string;
}

export interface Settings {
  seo: SeoSettings;
  homepage: HomepageSettings;
  contact: ContactSettings;
  userRoles: UserRole[];
  adminUsers: AdminUser[];
  lastUpdated: string;
}

interface SettingsStore {
  settings: Settings;
  updateSeoSettings: (seo: Partial<SeoSettings>) => void;
  updateHomepageSettings: (homepage: Partial<HomepageSettings>) => void;
  updateContactSettings: (contact: Partial<ContactSettings>) => void;
  addUserRole: (role: Omit<UserRole, 'id'>) => void;
  updateUserRole: (id: string, role: Partial<UserRole>) => void;
  deleteUserRole: (id: string) => void;
  addAdminUser: (user: Omit<AdminUser, 'id'>) => void;
  updateAdminUser: (id: string, user: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
}

// Default settings
const defaultSettings: Settings = {
  seo: {
    title: 'Bali Malayali - Discover Paradise in Bali',
    description: 'Experience the beauty of Bali with our carefully curated travel packages and activities. Book your dream vacation with Bali Malayali today!',
    keywords: ['Bali', 'travel', 'vacation', 'packages', 'activities', 'tours', 'beach', 'adventure'],
    ogImage: '/images/og-image.jpg',
    twitterHandle: '@balimalayali',
    googleAnalyticsId: 'G-XXXXXXXXXX',
  },
  homepage: {
    heroTitle: 'Discover Paradise in Bali',
    heroSubtitle: 'Experience the magic of Bali with our exclusive packages and activities',
    heroImage: '/images/hero-banner.jpg',
    featuredPackages: ['1', '2', '3'],
    featuredActivities: ['1', '3', '5', '6'],
    featuredTestimonials: ['1', '2'],
    aboutSectionTitle: 'About Bali Malayali',
    aboutSectionContent: 'Bali Malayali is a premier travel agency specializing in creating unforgettable experiences in Bali. With our deep local knowledge and commitment to excellence, we offer carefully curated packages and activities that showcase the best of this beautiful island paradise.',
    aboutSectionImage: '/images/about-us.jpg',
  },
  contact: {
    email: 'info@balimalayali.com',
    phone: '+62 812 3456 7890',
    address: 'Jl. Sunset Road No. 88, Kuta, Bali 80361, Indonesia',
    mapLocation: {
      lat: -8.695,
      lng: 115.177,
    },
    socialMedia: {
      facebook: 'https://facebook.com/balimalayali',
      instagram: 'https://instagram.com/balimalayali',
      twitter: 'https://twitter.com/balimalayali',
      youtube: 'https://youtube.com/balimalayali',
      tripadvisor: 'https://tripadvisor.com/balimalayali',
    },
  },
  userRoles: [
    {
      id: '1',
      name: 'Administrator',
      permissions: ['all'],
    },
    {
      id: '2',
      name: 'Manager',
      permissions: [
        'view_dashboard',
        'manage_packages',
        'manage_activities',
        'manage_bookings',
        'view_analytics',
        'manage_testimonials',
      ],
    },
    {
      id: '3',
      name: 'Content Editor',
      permissions: [
        'view_dashboard',
        'manage_packages',
        'manage_activities',
        'manage_testimonials',
      ],
    },
  ],
  adminUsers: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@balimalayali.com',
      roleId: '1',
      active: true,
      lastLogin: '2025-05-27T10:30:00Z',
    },
    {
      id: '2',
      name: 'Manager User',
      email: 'manager@balimalayali.com',
      roleId: '2',
      active: true,
      lastLogin: '2025-05-26T15:45:00Z',
    },
  ],
  lastUpdated: new Date().toISOString(),
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      updateSeoSettings: (seo) => set((state) => ({
        settings: {
          ...state.settings,
          seo: {
            ...state.settings.seo,
            ...seo,
          },
          lastUpdated: new Date().toISOString(),
        },
      })),
      
      updateHomepageSettings: (homepage) => set((state) => ({
        settings: {
          ...state.settings,
          homepage: {
            ...state.settings.homepage,
            ...homepage,
          },
          lastUpdated: new Date().toISOString(),
        },
      })),
      
      updateContactSettings: (contact) => set((state) => ({
        settings: {
          ...state.settings,
          contact: {
            ...state.settings.contact,
            ...contact,
            socialMedia: {
              ...state.settings.contact.socialMedia,
              ...(contact.socialMedia || {}),
            },
          },
          lastUpdated: new Date().toISOString(),
        },
      })),
      
      addUserRole: (role) => set((state) => ({
        settings: {
          ...state.settings,
          userRoles: [
            ...state.settings.userRoles,
            {
              ...role,
              id: crypto.randomUUID(),
            },
          ],
          lastUpdated: new Date().toISOString(),
        },
      })),
      
      updateUserRole: (id, role) => set((state) => ({
        settings: {
          ...state.settings,
          userRoles: state.settings.userRoles.map((r) =>
            r.id === id
              ? {
                  ...r,
                  ...role,
                }
              : r
          ),
          lastUpdated: new Date().toISOString(),
        },
      })),
      
      deleteUserRole: (id) => set((state) => ({
        settings: {
          ...state.settings,
          userRoles: state.settings.userRoles.filter((r) => r.id !== id),
          lastUpdated: new Date().toISOString(),
        },
      })),
      
      addAdminUser: (user) => set((state) => ({
        settings: {
          ...state.settings,
          adminUsers: [
            ...state.settings.adminUsers,
            {
              ...user,
              id: crypto.randomUUID(),
            },
          ],
          lastUpdated: new Date().toISOString(),
        },
      })),
      
      updateAdminUser: (id, user) => set((state) => ({
        settings: {
          ...state.settings,
          adminUsers: state.settings.adminUsers.map((u) =>
            u.id === id
              ? {
                  ...u,
                  ...user,
                }
              : u
          ),
          lastUpdated: new Date().toISOString(),
        },
      })),
      
      deleteAdminUser: (id) => set((state) => ({
        settings: {
          ...state.settings,
          adminUsers: state.settings.adminUsers.filter((u) => u.id !== id),
          lastUpdated: new Date().toISOString(),
        },
      })),
    }),
    {
      name: 'bali-settings-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
