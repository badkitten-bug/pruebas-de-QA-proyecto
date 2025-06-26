import React from 'react';
import { DonationsList } from '../../components/donations/DonationsList';
import { DonationForm } from '../../components/donations/DonationForm';

export function DonationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manejo de donaciones</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DonationsList />
        </div>
        <div>
          <DonationForm />
        </div>
      </div>
    </div>
  );
}