import { create } from 'zustand';
import type { AdoptionRequest } from '../types';

interface AdoptionState {
  adoptionRequests: AdoptionRequest[];
  addRequest: (request: Omit<AdoptionRequest, 'id' | 'submissionDate' | 'lastUpdated'>) => void;
  updateStatus: (id: string, status: AdoptionRequest['status']) => void;
}

export const useAdoptionStore = create<AdoptionState>((set) => ({
  adoptionRequests: [],
  addRequest: (newRequest) =>
    set((state) => ({
      adoptionRequests: [
        ...state.adoptionRequests,
        {
          ...newRequest,
          id: crypto.randomUUID(),
          submissionDate: new Date(),
          lastUpdated: new Date(),
        },
      ],
    })),
  updateStatus: (id, status) =>
    set((state) => ({
      adoptionRequests: state.adoptionRequests.map((request) =>
        request.id === id
          ? { ...request, status, lastUpdated: new Date() }
          : request
      ),
    })),
}));