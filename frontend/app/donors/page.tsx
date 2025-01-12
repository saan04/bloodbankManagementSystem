'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import DonorTable from './components/DonorTable';
import DonorForm from './components/DonorForm';
import SearchBar from './components/SearchBar';

interface Donor {
  id: number;
  name: string;
  dateOfBirth: string;
  bloodGroup: string;
  phoneNumber: string;
  email: string;
  address: string;
  lastDonationDate: string | null;
  eligible: boolean;
}

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [isAddingDonor, setIsAddingDonor] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/donors');
      console.log(response.data);
      setDonors(response.data);
      setFilteredDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const handleSearch = (term: string, bloodGroup: string) => {
    setSearchTerm(term);
    setSelectedBloodGroup(bloodGroup);

    let filtered = donors;
    
    if (term) {
      filtered = filtered.filter(donor => 
        donor.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    if (bloodGroup) {
      filtered = filtered.filter(donor => 
        donor.bloodGroup === bloodGroup
      );
    }
    
    setFilteredDonors(filtered);
  };

  const handleAddDonor = async (newDonor: Omit<Donor, 'id'>) => {
    try {
      await axios.post('http://localhost:8080/api/donors', newDonor);
      setIsAddingDonor(false);
      fetchDonors();
    } catch (error) {
      console.error('Error adding donor:', error);
    }
  };

  const handleUpdateDonor = async (updatedDonor: Donor) => {
    try {
      await axios.put(`http://localhost:8080/api/donors/${updatedDonor.id}`, updatedDonor);
      setEditingDonor(null);
      fetchDonors();
    } catch (error) {
      console.error('Error updating donor:', error);
    }
  };

  const handleDeleteDonor = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await axios.delete(`http://localhost:8080/api/donors/${id}`);
        fetchDonors();
      } catch (error) {
        console.error('Error deleting donor:', error);
      }
    }
  };

  const handleDonation = async (id: number) => {
    try {
      await axios.post(`http://localhost:8080/api/donors/${id}/donate`);
      fetchDonors();
    } catch (error) {
      console.error('Error recording donation:', error);
    }
  };

  return (
  <div className='min-h-screen bg-gray-50'>
    <div className="container mx-auto px-4 py-8 bg-white h-screen text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Donor Management</h1>
        <button
          onClick={() => setIsAddingDonor(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Add New Donor
        </button>
      </div>

      <SearchBar 
        onSearch={handleSearch}
        searchTerm={searchTerm}
        selectedBloodGroup={selectedBloodGroup}
      />

      {isAddingDonor && (
        <DonorForm
          onSubmit={handleAddDonor}
          onCancel={() => setIsAddingDonor(false)}
        />
      )}

      {editingDonor && (
        <DonorForm
          donor={editingDonor}
          onSubmit={handleUpdateDonor}
          onCancel={() => setEditingDonor(null)}
        />
      )}

      <DonorTable
        donors={filteredDonors}
        onEdit={setEditingDonor}
        onDelete={handleDeleteDonor}
        onDonate={handleDonation}
      />
    </div>
    </div>
  );
}
