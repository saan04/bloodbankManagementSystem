'use client';

import { useState } from 'react';

interface InventoryItem {
  id: number;
  bloodGroup: string;
  quantity: number;
  lastUpdated: string;
}

interface InventoryTableProps {
  inventory: InventoryItem[];
  onDonation: (bloodGroup: string, quantity: number) => void;
  onRequest: (bloodGroup: string, quantity: number) => void;
}

export default function InventoryTable({ inventory, onDonation, onRequest }: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<{
    bloodGroup: string;
    action: 'donate' | 'request';
  } | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const handleAction = () => {
    if (!selectedItem || quantity <= 0) return;

    if (selectedItem.action === 'donate') {
      onDonation(selectedItem.bloodGroup, quantity);
    } else {
      onRequest(selectedItem.bloodGroup, quantity);
    }

    setSelectedItem(null);
    setQuantity(0);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Blood Group
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Available Units
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{item.bloodGroup}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm font-semibold ${
                  item.quantity < 10 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {item.quantity} units
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(item.lastUpdated).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setSelectedItem({ bloodGroup: item.bloodGroup, action: 'donate' })}
                    className="px-4 py-2 text-sm border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Record Donation
                  </button>
                  <button
                    onClick={() => setSelectedItem({ bloodGroup: item.bloodGroup, action: 'request' })}
                    className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Process Request
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Quantity Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {selectedItem.action === 'donate' ? 'Record Donation' : 'Process Request'} for {selectedItem.bloodGroup}
              </h3>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (units)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setQuantity(0);
                  }}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
