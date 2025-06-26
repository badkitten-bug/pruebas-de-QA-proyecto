import React from 'react';
import { InventoryList } from '../../components/inventory/InventoryList';
import { InventoryForm } from '../../components/inventory/InventoryForm';

export function InventoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion de inventario</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <InventoryList />
        </div>
        <div>
          <InventoryForm />
        </div>
      </div>
    </div>
  );
}