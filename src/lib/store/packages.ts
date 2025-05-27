import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

export interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  accommodation?: string;
}

export interface Package {
  id: string;
  name?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  duration?: number;
  minParticipants?: number;
  startDate?: string;
  endDate?: string;
  included: string[];
  notIncluded: string[];
  highlights: string[];
  location?: string;
  // Updated status system
  tourType: 'FIT' | 'GIT'; // New field for tour type
  status: 'available' | 'almost_full' | 'full' | 'draft' | 'trending' | 'best_seller' | 'sold_out'; // Extended status options
  // GIT-specific fields
  maxParticipants?: number; // For GIT tours
  currentBookings?: number; // For GIT tours to track slots
  // FIT-specific fields
  isFlexibleDates?: boolean; // For FIT tours
  image: string;
  mediaGallery: MediaItem[];
  category?: string;
  itinerary: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
}

interface PackagesStore {
  packages: Package[];
  addPackage: (packageData: Omit<Package, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => boolean;
  updatePackage: (id: string, packageData: Partial<Package>) => boolean;
  deletePackage: (id: string) => void;
  getPackage: (id: string) => Package | undefined;
}

export const usePackagesStore = create<PackagesStore>()(
  persist(
    (set, get) => ({
      packages: [],
      
      addPackage: (packageData) => {
        try {
          set((state) => {
            const now = new Date().toISOString();
            const newPackage: Package = {
              ...packageData,
              id: crypto.randomUUID(),
              status: 'draft',
              included: packageData.included || [],
              notIncluded: packageData.notIncluded || [],
              highlights: packageData.highlights || [],
              mediaGallery: packageData.mediaGallery || [],
              itinerary: packageData.itinerary || [],
              createdAt: now,
              updatedAt: now,
            };
            
            return {
              packages: [...state.packages, newPackage],
            };
          });
          return true; // Return success
        } catch (error) {
          console.error('Error in addPackage:', error);
          return false; // Return failure
        }
      },

      updatePackage: (id, packageData) => {
        try {
          set((state) => ({
            packages: state.packages.map((pkg) =>
              pkg.id === id
                ? {
                    ...pkg,
                    ...packageData,
                    updatedAt: new Date().toISOString(),
                  }
                : pkg
            ),
          }));
          return true; // Return success
        } catch (error) {
          console.error('Error in updatePackage:', error);
          return false; // Return failure
        }
      },

      deletePackage: (id) => set((state) => ({
        packages: state.packages.filter((pkg) => pkg.id !== id),
      })),

      getPackage: (id) => get().packages.find((pkg) => pkg.id === id),
    }),
    {
      name: 'bali-packages-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);