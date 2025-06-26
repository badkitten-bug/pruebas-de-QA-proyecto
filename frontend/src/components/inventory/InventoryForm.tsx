import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useInventoryStore } from '../../store/inventoryStore';
import type { InventoryItem } from '../../types';

const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['food', 'medicine', 'supplies']),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  unit: z.string().min(1, 'Unit is required'),
  minimumRequired: z.number().min(0, 'Minimum required must be 0 or greater'),
});

type InventoryFormData = z.infer<typeof inventoryItemSchema>;

export function InventoryForm() {
  const addItem = useInventoryStore((state) => state.addItem);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InventoryFormData>({
    resolver: zodResolver(inventoryItemSchema),
  });

  const onSubmit = (data: InventoryFormData) => {
    addItem(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900">Add Inventory Item</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Item Name
        </label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="food">Food</option>
          <option value="medicine">Medicine</option>
          <option value="supplies">Supplies</option>
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          {...register('quantity', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
      </div>

      <div>
        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
          Unit
        </label>
        <input
          type="text"
          {...register('unit')}
          placeholder="e.g., kg, pieces, bottles"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>}
      </div>

      <div>
        <label htmlFor="minimumRequired" className="block text-sm font-medium text-gray-700">
          Minimum Required
        </label>
        <input
          type="number"
          {...register('minimumRequired', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.minimumRequired && (
          <p className="mt-1 text-sm text-red-600">{errors.minimumRequired.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Item
      </button>
    </form>
  );
}