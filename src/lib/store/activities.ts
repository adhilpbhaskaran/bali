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

export interface Activity {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: string;
  status: 'active' | 'draft';
  location: string;
  category: string;
  image?: string;
  mediaGallery: MediaItem[];
  includedItems: string[];
  excludedItems: string[];
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

interface ActivitiesStore {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
  updateActivity: (id: string, activity: Partial<Activity>) => boolean;
  deleteActivity: (id: string) => void;
  getActivity: (id: string) => Activity | undefined;
}

export const useActivitiesStore = create<ActivitiesStore>()(
  persist(
    (set, get) => ({
      activities: [],
      
      addActivity: (activityData) => {
        try {
          set((state) => {
            const now = new Date().toISOString();
            const newActivity: Activity = {
              ...activityData,
              id: crypto.randomUUID(),
              mediaGallery: activityData.mediaGallery || [],
              createdAt: now,
              updatedAt: now,
            };
            
            return {
              activities: [...state.activities, newActivity],
            };
          });
          return true; // Return success
        } catch (error) {
          console.error('Error in addActivity:', error);
          return false; // Return failure
        }
      },

      updateActivity: (id, activityData) => {
        try {
          set((state) => ({
            activities: state.activities.map((activity) =>
              activity.id === id
                ? {
                    ...activity,
                    ...activityData,
                    updatedAt: new Date().toISOString(),
                  }
                : activity
            ),
          }));
          return true; // Return success
        } catch (error) {
          console.error('Error in updateActivity:', error);
          return false; // Return failure
        }
      },

      deleteActivity: (id) => set((state) => ({
        activities: state.activities.filter((activity) => activity.id !== id),
      })),

      getActivity: (id) => get().activities.find((activity) => activity.id === id),
    }),
    {
      name: 'bali-activities-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
); 