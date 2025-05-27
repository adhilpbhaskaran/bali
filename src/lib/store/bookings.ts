import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'paid' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  specialRequests?: string;
}

export interface BookingItem {
  type: 'package' | 'activity';
  id: string;
  name: string;
  date: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Payment {
  id: string;
  amount: number;
  method: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
  status: PaymentStatus;
  transactionId?: string;
  date: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customer: Customer;
  items: BookingItem[];
  totalAmount: number;
  status: BookingStatus;
  payments: Payment[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingsStore {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  addPayment: (bookingId: string, payment: Omit<Payment, 'id' | 'date'>) => void;
}

// Generate a booking number with format BM-YYYYMMDD-XXXX
const generateBookingNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  
  return `BM-${year}${month}${day}-${random}`;
};

export const useBookingsStore = create<BookingsStore>()(
  persist(
    (set, get) => ({
      bookings: [
        {
          id: '1',
          bookingNumber: 'BM-20250510-1234',
          customer: {
            id: 'c1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+1-555-123-4567',
            country: 'United States',
            specialRequests: 'Vegetarian meals preferred'
          },
          items: [
            {
              type: 'package',
              id: '1',
              name: 'Bali Adventure Package',
              date: '2025-06-15',
              quantity: 2,
              unitPrice: 1200,
              totalPrice: 2400
            }
          ],
          totalAmount: 2400,
          status: 'confirmed',
          payments: [
            {
              id: 'p1',
              amount: 1200,
              method: 'credit_card',
              status: 'completed',
              transactionId: 'txn_123456789',
              date: '2025-05-10T14:30:00Z'
            }
          ],
          notes: 'Honeymoon trip',
          createdAt: '2025-05-10T14:30:00Z',
          updatedAt: '2025-05-10T14:30:00Z'
        },
        {
          id: '2',
          bookingNumber: 'BM-20250512-5678',
          customer: {
            id: 'c2',
            name: 'Maria Rodriguez',
            email: 'maria.r@example.com',
            phone: '+34-555-987-6543',
            country: 'Spain'
          },
          items: [
            {
              type: 'activity',
              id: '3',
              name: 'Bali Swing Experience',
              date: '2025-05-20',
              quantity: 4,
              unitPrice: 35,
              totalPrice: 140
            },
            {
              type: 'activity',
              id: '5',
              name: 'Uluwatu Temple & Kecak Dance',
              date: '2025-05-21',
              quantity: 4,
              unitPrice: 40,
              totalPrice: 160
            }
          ],
          totalAmount: 300,
          status: 'paid',
          payments: [
            {
              id: 'p2',
              amount: 300,
              method: 'paypal',
              status: 'completed',
              transactionId: 'paypal_987654321',
              date: '2025-05-12T10:15:00Z'
            }
          ],
          createdAt: '2025-05-12T10:15:00Z',
          updatedAt: '2025-05-12T10:15:00Z'
        }
      ],
      
      addBooking: (bookingData) => set((state) => {
        const now = new Date().toISOString();
        const newBooking: Booking = {
          ...bookingData,
          id: crypto.randomUUID(),
          bookingNumber: generateBookingNumber(),
          createdAt: now,
          updatedAt: now,
        };
        
        return {
          bookings: [...state.bookings, newBooking],
        };
      }),

      updateBooking: (id, bookingData) => set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                ...bookingData,
                updatedAt: new Date().toISOString(),
              }
            : booking
        ),
      })),

      deleteBooking: (id) => set((state) => ({
        bookings: state.bookings.filter((booking) => booking.id !== id),
      })),

      getBooking: (id) => get().bookings.find((booking) => booking.id === id),
      
      updateBookingStatus: (id, status) => set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status,
                updatedAt: new Date().toISOString(),
              }
            : booking
        ),
      })),
      
      addPayment: (bookingId, paymentData) => set((state) => {
        const booking = state.bookings.find((b) => b.id === bookingId);
        
        if (!booking) return state;
        
        const payment = {
          ...paymentData,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        };
        
        // Update booking status based on payment
        let newStatus = booking.status;
        if (paymentData.status === 'completed') {
          const totalPaid = [...booking.payments, payment]
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
            
          if (totalPaid >= booking.totalAmount) {
            newStatus = 'paid';
          } else if (totalPaid > 0) {
            newStatus = 'confirmed';
          }
        }
        
        return {
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  payments: [...b.payments, payment],
                  status: newStatus as BookingStatus,
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        };
      }),
    }),
    {
      name: 'bali-bookings-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
