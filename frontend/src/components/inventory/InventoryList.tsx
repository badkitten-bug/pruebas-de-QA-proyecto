import React from 'react';
import { useInventoryStore } from '../../store/inventoryStore';
import { Package, AlertTriangle, Plus, Minus } from 'lucide-react';

export function InventoryList() {
  const { items, updateQuantity } = useInventoryStore();

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change);
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Inventory Items</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {items.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No items in inventory</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      <Package className="inline-block w-4 h-4 mr-1" />
                      {item.category}
                    </span>
                    <span>• {item.unit}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {item.quantity <= item.minimumRequired && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="mr-1 h-4 w-4" />
                      Low Stock
                    </span>
                  )}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="p-1 text-gray-600 hover:text-gray-800"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="text-lg font-medium w-16 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="p-1 text-gray-600 hover:text-gray-800"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}