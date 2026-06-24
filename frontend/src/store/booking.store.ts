import { create } from 'zustand';
import { Package, Passenger } from '@/types';

interface BookingState {
  selectedPackage: Package | null;
  travelDate: string | null;
  passengers: Passenger[];
  specialRequests: string;
  setPackage: (pkg: Package) => void;
  setTravelDate: (date: string) => void;
  setPassengers: (passengers: Passenger[]) => void;
  setSpecialRequests: (requests: string) => void;
  clearBooking: () => void;
  getTotalAmount: () => number;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedPackage: null,
  travelDate: null,
  passengers: [],
  specialRequests: '',
  setPackage: (pkg) => set({ selectedPackage: pkg }),
  setTravelDate: (date) => set({ travelDate: date }),
  setPassengers: (passengers) => set({ passengers }),
  setSpecialRequests: (specialRequests) => set({ specialRequests }),
  clearBooking: () => set({ selectedPackage: null, travelDate: null, passengers: [], specialRequests: '' }),
  getTotalAmount: () => {
    const { selectedPackage, passengers } = get();
    if (!selectedPackage) return 0;
    const unitPrice = selectedPackage.discountedPrice || selectedPackage.price;
    const subtotal = unitPrice * passengers.length;
    return subtotal + subtotal * 0.05;
  },
}));
