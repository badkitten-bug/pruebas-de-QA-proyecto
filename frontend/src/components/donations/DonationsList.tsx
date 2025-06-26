import React from 'react';
import { useDonationStore } from '../../store/donationStore';
import { DollarSign, Package, Calendar } from 'lucide-react';

export function DonationsList() {
  const donations = useDonationStore((state) => state.donations);
  const totalMonetary = useDonationStore((state) => state.getTotalMonetaryDonations());

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Total Monetary Donations</p>
                <p className="text-2xl font-semibold text-green-900">${totalMonetary.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Material Donations</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {donations.filter((d) => d.type === 'material').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {donations.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">No donations recorded yet</p>
          ) : (
            donations.map((donation) => (
              <div key={donation.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      {donation.type === 'monetary' ? (
                        <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <Package className="h-5 w-5 text-blue-500 mr-2" />
                      )}
                      <h3 className="text-lg font-medium text-gray-900">
                        {donation.type === 'monetary'
                          ? `$${donation.amount?.toFixed(2)}`
                          : `Material Donation`}
                      </h3>
                    </div>
                    {donation.type === 'material' && donation.items && (
                      <ul className="mt-1 text-sm text-gray-500">
                        {donation.items.map((item, index) => (
                          <li key={index}>
                            {item.quantity} x {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {donation.date.toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      donation.type === 'monetary'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {donation.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}