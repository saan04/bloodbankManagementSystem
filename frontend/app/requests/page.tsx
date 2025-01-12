'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import RequestTable from './components/RequestTable';
import RequestForm from './components/RequestForm';
import FilterBar from './components/FilterBar';
import DateRangePicker from './components/DateRangePicker';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'PENDING' | 'FULFILLED' | 'CANCELLED';

export interface BloodRequest {
  id: number;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  priority: Priority;
  status: Status;
  requiredBy: string;
  contactNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterState {
  hospital: string;
  status: Status | '';
  priority: Priority | '';
  bloodGroup: string;
  dateRange: {
    start: string;
    end: string;
  } | null;
  searchTerm: string;
}

export default function RequestPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BloodRequest[]>([]);
  const [isAddingRequest, setIsAddingRequest] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    hospital: '',
    status: '',
    priority: '',
    bloodGroup: '',
    dateRange: null,
    searchTerm: '',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, filters]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleAddRequest = async (request: Omit<BloodRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await axios.post('http://localhost:8080/api/requests', request);
      setIsAddingRequest(false);
      fetchRequests();
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  const handleUpdateStatus = async (id: number, status: Status) => {
    try {
      await axios.put(`http://localhost:8080/api/requests/${id}/status?status=${status}`);
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.patientName.toLowerCase().includes(searchLower) ||
          request.hospitalName.toLowerCase().includes(searchLower) ||
          request.bloodGroup.toLowerCase().includes(searchLower)
      );
    }

    // Apply hospital filter
    if (filters.hospital) {
      filtered = filtered.filter((request) =>
        request.hospitalName.toLowerCase().includes(filters.hospital.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((request) => request.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter((request) => request.priority === filters.priority);
    }

    // Apply blood group filter
    if (filters.bloodGroup) {
      filtered = filtered.filter((request) => request.bloodGroup === filters.bloodGroup);
    }

    // Apply date range filter
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter((request) => {
        const requiredBy = new Date(request.requiredBy);
        return requiredBy >= startDate && requiredBy <= endDate;
      });
    }

    setFilteredRequests(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Blood Request Management</h1>
          <button
            onClick={() => setIsAddingRequest(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            New Request
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
          {/* Sidebar with Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
              <FilterBar
                filters={filters}
                onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
              />
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Date Range</h3>
                <DateRangePicker
                  dateRange={filters.dateRange}
                  onDateRangeChange={(dateRange) =>
                    setFilters({ ...filters, dateRange })
                  }
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RequestTable
                requests={filteredRequests}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          </div>
        </div>
      </div>

      {isAddingRequest && (
        <RequestForm
          onSubmit={handleAddRequest}
          onCancel={() => setIsAddingRequest(false)}
        />
      )}
    </div>
  );
}
