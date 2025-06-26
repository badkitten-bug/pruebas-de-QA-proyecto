import React from 'react';
import { AnimalsList } from '../../components/animals/AnimalsList';
import { AnimalForm } from '../../components/animals/AnimalForm';

export function AnimalsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manejo de animales</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimalsList />
        </div>
        <div>
          <AnimalForm />
        </div>
      </div>
    </div>
  );
}