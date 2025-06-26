import { create } from 'zustand';
import type { InventoryItem } from '../types';

interface InventoryState {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  deleteItem: (id: string) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  addItem: (newItem) =>
    set((state) => ({
      items: [...state.items, { ...newItem, id: crypto.randomUUID() }],
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));