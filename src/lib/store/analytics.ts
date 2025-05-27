import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface DailyStats {
  date: string;
  visitors: number;
  pageViews: number;
  bookings: number;
  revenue: number;
}

export interface PopularItem {
  id: string;
  name: string;
  type: 'package' | 'activity';
  views: number;
  bookings: number;
  revenue: number;
}

export interface CustomerSource {
  source: string;
  visitors: number;
  bookings: number;
  conversionRate: number;
}

export interface AnalyticsData {
  dailyStats: DailyStats[];
  popularItems: PopularItem[];
  customerSources: CustomerSource[];
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  conversionRate: number;
  lastUpdated: string;
}

interface AnalyticsStore {
  analytics: AnalyticsData;
  updateDailyStats: (stats: DailyStats) => void;
  updatePopularItem: (item: PopularItem) => void;
  updateCustomerSource: (source: CustomerSource) => void;
  updateTotals: (data: {
    bookings?: number;
    revenue?: number;
    customers?: number;
    conversionRate?: number;
  }) => void;
  recordPageView: (pageId: string, pageType: 'package' | 'activity' | 'home' | 'other') => void;
  recordBooking: (bookingData: {
    itemId: string;
    itemType: 'package' | 'activity';
    itemName: string;
    amount: number;
    source?: string;
  }) => void;
}

// Generate sample data for the past 30 days
const generateSampleData = (): AnalyticsData => {
  const dailyStats: DailyStats[] = [];
  const now = new Date();
  let totalBookings = 0;
  let totalRevenue = 0;
  
  // Generate daily stats for the past 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const visitors = Math.floor(Math.random() * 100) + 50;
    const pageViews = visitors * (Math.random() * 3 + 2);
    const bookings = Math.floor(Math.random() * 5);
    const revenue = bookings * (Math.random() * 500 + 100);
    
    totalBookings += bookings;
    totalRevenue += revenue;
    
    dailyStats.push({
      date: date.toISOString().split('T')[0],
      visitors,
      pageViews: Math.floor(pageViews),
      bookings,
      revenue: Math.floor(revenue),
    });
  }
  
  // Popular items
  const popularItems: PopularItem[] = [
    {
      id: '1',
      name: 'Bali Adventure Package',
      type: 'package',
      views: 1245,
      bookings: 28,
      revenue: 33600,
    },
    {
      id: '2',
      name: 'Romantic Bali Getaway',
      type: 'package',
      views: 980,
      bookings: 22,
      revenue: 30800,
    },
    {
      id: '3',
      name: 'Mount Batur Sunrise Trek',
      type: 'activity',
      views: 1560,
      bookings: 45,
      revenue: 2925,
    },
    {
      id: '5',
      name: 'Uluwatu Temple & Kecak Dance',
      type: 'activity',
      views: 1320,
      bookings: 38,
      revenue: 1520,
    },
    {
      id: '6',
      name: 'Nusa Penida Island Tour',
      type: 'activity',
      views: 1480,
      bookings: 42,
      revenue: 3570,
    },
  ];
  
  // Customer sources
  const customerSources: CustomerSource[] = [
    {
      source: 'Direct',
      visitors: 1250,
      bookings: 45,
      conversionRate: 3.6,
    },
    {
      source: 'Google',
      visitors: 2340,
      bookings: 68,
      conversionRate: 2.9,
    },
    {
      source: 'Facebook',
      visitors: 980,
      bookings: 22,
      conversionRate: 2.2,
    },
    {
      source: 'Instagram',
      visitors: 1560,
      bookings: 48,
      conversionRate: 3.1,
    },
    {
      source: 'TripAdvisor',
      visitors: 720,
      bookings: 28,
      conversionRate: 3.9,
    },
  ];
  
  return {
    dailyStats,
    popularItems,
    customerSources,
    totalBookings,
    totalRevenue,
    totalCustomers: Math.floor(totalBookings * 1.8), // Some bookings have multiple customers
    conversionRate: (totalBookings / dailyStats.reduce((sum, day) => sum + day.visitors, 0)) * 100,
    lastUpdated: new Date().toISOString(),
  };
};

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      analytics: generateSampleData(),
      
      updateDailyStats: (stats) => set((state) => {
        const existingIndex = state.analytics.dailyStats.findIndex(
          (s) => s.date === stats.date
        );
        
        const updatedStats = [...state.analytics.dailyStats];
        
        if (existingIndex >= 0) {
          updatedStats[existingIndex] = stats;
        } else {
          updatedStats.push(stats);
          // Keep only the last 30 days
          if (updatedStats.length > 30) {
            updatedStats.shift();
          }
        }
        
        return {
          analytics: {
            ...state.analytics,
            dailyStats: updatedStats,
            lastUpdated: new Date().toISOString(),
          },
        };
      }),
      
      updatePopularItem: (item) => set((state) => {
        const existingIndex = state.analytics.popularItems.findIndex(
          (i) => i.id === item.id && i.type === item.type
        );
        
        const updatedItems = [...state.analytics.popularItems];
        
        if (existingIndex >= 0) {
          updatedItems[existingIndex] = item;
        } else {
          updatedItems.push(item);
        }
        
        // Sort by revenue (descending)
        updatedItems.sort((a, b) => b.revenue - a.revenue);
        
        return {
          analytics: {
            ...state.analytics,
            popularItems: updatedItems,
            lastUpdated: new Date().toISOString(),
          },
        };
      }),
      
      updateCustomerSource: (source) => set((state) => {
        const existingIndex = state.analytics.customerSources.findIndex(
          (s) => s.source === source.source
        );
        
        const updatedSources = [...state.analytics.customerSources];
        
        if (existingIndex >= 0) {
          updatedSources[existingIndex] = source;
        } else {
          updatedSources.push(source);
        }
        
        // Sort by bookings (descending)
        updatedSources.sort((a, b) => b.bookings - a.bookings);
        
        return {
          analytics: {
            ...state.analytics,
            customerSources: updatedSources,
            lastUpdated: new Date().toISOString(),
          },
        };
      }),
      
      updateTotals: (data) => set((state) => ({
        analytics: {
          ...state.analytics,
          totalBookings: data.bookings !== undefined ? data.bookings : state.analytics.totalBookings,
          totalRevenue: data.revenue !== undefined ? data.revenue : state.analytics.totalRevenue,
          totalCustomers: data.customers !== undefined ? data.customers : state.analytics.totalCustomers,
          conversionRate: data.conversionRate !== undefined ? data.conversionRate : state.analytics.conversionRate,
          lastUpdated: new Date().toISOString(),
        },
      })),
      
      recordPageView: (pageId, pageType) => set((state) => {
        // Update today's stats
        const today = new Date().toISOString().split('T')[0];
        const todayStatsIndex = state.analytics.dailyStats.findIndex(
          (s) => s.date === today
        );
        
        const updatedStats = [...state.analytics.dailyStats];
        
        if (todayStatsIndex >= 0) {
          updatedStats[todayStatsIndex] = {
            ...updatedStats[todayStatsIndex],
            pageViews: updatedStats[todayStatsIndex].pageViews + 1,
          };
        } else {
          updatedStats.push({
            date: today,
            visitors: 1,
            pageViews: 1,
            bookings: 0,
            revenue: 0,
          });
        }
        
        // Update popular item if applicable
        if (pageType === 'package' || pageType === 'activity') {
          const itemIndex = state.analytics.popularItems.findIndex(
            (i) => i.id === pageId && i.type === pageType
          );
          
          const updatedItems = [...state.analytics.popularItems];
          
          if (itemIndex >= 0) {
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              views: updatedItems[itemIndex].views + 1,
            };
          }
          
          return {
            analytics: {
              ...state.analytics,
              dailyStats: updatedStats,
              popularItems: updatedItems,
              lastUpdated: new Date().toISOString(),
            },
          };
        }
        
        return {
          analytics: {
            ...state.analytics,
            dailyStats: updatedStats,
            lastUpdated: new Date().toISOString(),
          },
        };
      }),
      
      recordBooking: (bookingData) => set((state) => {
        // Update today's stats
        const today = new Date().toISOString().split('T')[0];
        const todayStatsIndex = state.analytics.dailyStats.findIndex(
          (s) => s.date === today
        );
        
        const updatedStats = [...state.analytics.dailyStats];
        
        if (todayStatsIndex >= 0) {
          updatedStats[todayStatsIndex] = {
            ...updatedStats[todayStatsIndex],
            bookings: updatedStats[todayStatsIndex].bookings + 1,
            revenue: updatedStats[todayStatsIndex].revenue + bookingData.amount,
          };
        } else {
          updatedStats.push({
            date: today,
            visitors: 0,
            pageViews: 0,
            bookings: 1,
            revenue: bookingData.amount,
          });
        }
        
        // Update popular item
        const itemIndex = state.analytics.popularItems.findIndex(
          (i) => i.id === bookingData.itemId && i.type === bookingData.itemType
        );
        
        const updatedItems = [...state.analytics.popularItems];
        
        if (itemIndex >= 0) {
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            bookings: updatedItems[itemIndex].bookings + 1,
            revenue: updatedItems[itemIndex].revenue + bookingData.amount,
          };
        } else {
          updatedItems.push({
            id: bookingData.itemId,
            name: bookingData.itemName,
            type: bookingData.itemType,
            views: 1,
            bookings: 1,
            revenue: bookingData.amount,
          });
        }
        
        // Update customer source if available
        let updatedSources = [...state.analytics.customerSources];
        
        if (bookingData.source) {
          const sourceIndex = state.analytics.customerSources.findIndex(
            (s) => s.source === bookingData.source
          );
          
          if (sourceIndex >= 0) {
            updatedSources[sourceIndex] = {
              ...updatedSources[sourceIndex],
              bookings: updatedSources[sourceIndex].bookings + 1,
              conversionRate: ((updatedSources[sourceIndex].bookings + 1) / updatedSources[sourceIndex].visitors) * 100,
            };
          }
        }
        
        // Update totals
        const totalBookings = state.analytics.totalBookings + 1;
        const totalRevenue = state.analytics.totalRevenue + bookingData.amount;
        const totalCustomers = state.analytics.totalCustomers + 1;
        
        return {
          analytics: {
            ...state.analytics,
            dailyStats: updatedStats,
            popularItems: updatedItems,
            customerSources: updatedSources,
            totalBookings,
            totalRevenue,
            totalCustomers,
            lastUpdated: new Date().toISOString(),
          },
        };
      }),
    }),
    {
      name: 'bali-analytics-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
