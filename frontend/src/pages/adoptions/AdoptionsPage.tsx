import React from 'react';
import { AdoptionRequestList } from '../../components/adoptions/AdoptionRequestList';
import { AdoptionRequestForm } from '../../components/adoptions/AdoptionRequestForm';

export function AdoptionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion de adopcion</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AdoptionRequestList />
        </div>
        <div>
          <AdoptionRequestForm />
        </div>
      </div>
    </div>
  );
}