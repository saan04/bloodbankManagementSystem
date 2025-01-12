'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryTable from './components/InventoryTable';
import InventoryForm from './components/InventoryForm';
import InventoryStats from './components/InventoryStats';
import SearchBar from './components/SearchBar';

interface InventoryItem {
  id: number;
  bloodGroup: string;
  quantity: number;
  minThreshold: number;
  lastUpdated: string;
}

interface Transaction {
  id: number;
  bloodGroup: string;
  quantity: number;
  type: 'DONATION' | 'REQUEST';
  timestamp: string;
  transactionType: string;
  remarks: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddingInventory, setIsAddingInventory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchInventory();
    fetchTransactions();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/inventory');
      const inventoryData = response.data;
      setInventory(inventoryData);
      setFilteredInventory(inventoryData);
      
      // Filter low stock items
      const lowStockItems = inventoryData.filter(
        (item: InventoryItem) => item.quantity <= item.minThreshold
      );
      setLowStock(lowStockItems);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/inventory/transactions');
      // Transform the data to match our interface
      const transformedTransactions = response.data.map((transaction: any) => ({
        ...transaction,
        type: transaction.transactionType
      }));
      setTransactions(transformedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    
    const filtered = inventory.filter(item =>
      item.bloodGroup.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  const handleAddInventory = async (newInventory: { bloodGroup: string; quantity: number; minThreshold: number }) => {
    try {
      await axios.post('http://localhost:8080/api/inventory', newInventory);
      setIsAddingInventory(false);
      fetchInventory();
    } catch (error) {
      console.error('Error adding inventory:', error);
    }
  };

  const handleDonation = async (bloodGroup: string, quantity: number) => {
    try {
      await axios.post(`http://localhost:8080/api/inventory/${bloodGroup}/donate`, { quantity });
      fetchInventory();
      fetchTransactions();
    } catch (error) {
      console.error('Error processing donation:', error);
    }
  };

  const handleRequest = async (bloodGroup: string, quantity: number) => {
    try {
      const checkAvailability = await axios.get(
        `http://localhost:8080/api/inventory/${bloodGroup}/check?quantity=${quantity}`
      );
      
      if (!checkAvailability.data) {
        alert('Insufficient blood quantity available!');
        return;
      }

      await axios.post(`http://localhost:8080/api/inventory/${bloodGroup}/request`, { quantity });
      fetchInventory();
      fetchTransactions();
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Blood Inventory Management</h1>
          <button
            onClick={() => setIsAddingInventory(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Add Inventory
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-8rem)]">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />
              <InventoryTable
                inventory={currentItems}
                onDonation={handleDonation}
                onRequest={handleRequest}
              />
              {/* Pagination */}
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
              <InventoryStats
                lowStock={lowStock}
                recentTransactions={transactions.slice(0, 5)}
              />
            </div>
          </div>
        </div>
      </div>

      {isAddingInventory && (
        <InventoryForm
          onSubmit={handleAddInventory}
          onCancel={() => setIsAddingInventory(false)}
        />
      )}
    </div>
  );
}
