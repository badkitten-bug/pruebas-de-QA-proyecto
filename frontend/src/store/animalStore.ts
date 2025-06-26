import { create } from 'zustand';
import type { Animal, MedicalRecord } from '../types';

interface AnimalState {
  animals: Animal[];
  addAnimal: (animal: Omit<Animal, 'id'>) => void;
  updateAnimal: (id: string, animal: Partial<Animal>) => void;
  addMedicalRecord: (animalId: string, record: Omit<MedicalRecord, 'id'>) => void;
}

export const useAnimalStore = create<AnimalState>((set) => ({
  animals: [],
  addAnimal: (newAnimal) => 
    set((state) => ({
      animals: [...state.animals, { ...newAnimal, id: crypto.randomUUID() }]
    })),
  updateAnimal: (id, updatedAnimal) =>
    set((state) => ({
      animals: state.animals.map((animal) =>
        animal.id === id ? { ...animal, ...updatedAnimal } : animal
      )
    })),
  addMedicalRecord: (animalId, record) =>
    set((state) => ({
      animals: state.animals.map((animal) =>
        animal.id === animalId
          ? {
              ...animal,
              medicalHistory: [
                ...animal.medicalHistory,
                { ...record, id: crypto.randomUUID() }
              ]
            }
          : animal
      )
    }))
}));