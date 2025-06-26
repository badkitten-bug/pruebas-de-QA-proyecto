import { create } from 'zustand';
import type { Donation } from '../types';

interface DonationState {
  donations: Donation[];
  addDonation: (donation: Omit<Donation, 'id' | 'date'>) => void;
  getDonationsByType: (type: 'monetary' | 'material') => Donation[];
  getTotalMonetaryDonations: () => number;
}

export const useDonationStore = create<DonationState>((set, get) => ({
  donations: [],
  addDonation: (newDonation) =>
    set((state) => ({
      donations: [
        ...state.donations,
        { ...newDonation, id: crypto.randomUUID(), date: new Date() },
      ],
    })),
  getDonationsByType: (type) => {
    return get().donations.filter((donation) => donation.type === type);
  },
  getTotalMonetaryDonations: () => {
    return get()
      .donations.filter((donation) => donation.type === 'monetary')
      .reduce((total, donation) => total + (donation.amount || 0), 0);
  },
}));