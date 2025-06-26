import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDonationStore } from '../../store/donationStore';
import { Plus, X } from 'lucide-react';

const monetaryDonationSchema = z.object({
  type: z.literal('monetary'),
  donorId: z.string().min(1, 'Donor information is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
});

const materialDonationSchema = z.object({
  type: z.literal('material'),
  donorId: z.string().min(1, 'Donor information is required'),
  items: z.array(
    z.object({
      name: z.string().min(1, 'Item name is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'At least one item is required'),
});

const donationSchema = z.discriminatedUnion('type', [
  monetaryDonationSchema,
  materialDonationSchema,
]);

type DonationFormData = z.infer<typeof donationSchema>;

export function DonationForm() {
  const [donationType, setDonationType] = useState<'monetary' | 'material'>('monetary');
  const [materialItems, setMaterialItems] = useState<Array<{ name: string; quantity: number }>>([]);
  const addDonation = useDonationStore((state) => state.addDonation);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
  });

  const addMaterialItem = () => {
    setMaterialItems([...materialItems, { name: '', quantity: 1 }]);
  };

  const removeMaterialItem = (index: number) => {
    setMaterialItems(materialItems.filter((_, i) => i !== index));
  };

  const updateMaterialItem = (index: number, field: 'name' | 'quantity', value: string | number) => {
    const newItems = [...materialItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setMaterialItems(newItems);
  };

  const onSubmit = (data: DonationFormData) => {
    if (data.type === 'material') {
      data.items = materialItems;
    }
    addDonation(data);
    reset();
    setMaterialItems([]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900">Registro de Donation</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">tipo de Donation</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDonationType('monetary')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              donationType === 'monetary'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Monetario
          </button>
          <button
            type="button"
            onClick={() => setDonationType('material')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              donationType === 'material'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Material
          </button>
        </div>
      </div>

      <input type="hidden" {...register('type')} value={donationType} />

      <div>
        <label htmlFor="donorId" className="block text-sm font-medium text-gray-700">
          Donador 
        </label>
        <input
          type="text"
          {...register('donorId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.donorId && (
          <p className="mt-1 text-sm text-red-600">{errors.donorId.message}</p>
        )}
      </div>

      {donationType === 'monetary' ? (
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Items</label>
            <button
              type="button"
              onClick={addMaterialItem}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>
          {materialItems.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateMaterialItem(index, 'name', e.target.value)}
                  placeholder="Item name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateMaterialItem(index, 'quantity', parseInt(e.target.value))}
                  min="1"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeMaterialItem(index)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
          {errors.items && (
            <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Record Donation
      </button>
    </form>
  );
}