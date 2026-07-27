"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Calendar as CalendarIcon, User, Hotel, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'occupied' | 'cancelled'>('all');
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [amountFilter, setAmountFilter] = useState({ min: '', max: '' });

  // Manage Booking State
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiFetch<any[]>('/bookings');
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const openManageModal = (booking: any) => {
    setSelectedBooking(booking);
    setIsManageModalOpen(true);
  };

  const updateBookingStatus = async (status: string) => {
    if (!selectedBooking) return;
    
    let confirmMessage = '';
    if (status === 'cancelled') confirmMessage = 'Are you sure you want to cancel this booking?';
    if (status === 'completed') confirmMessage = 'Are you sure you want to check out this guest?';
    
    if (!window.confirm(confirmMessage)) return;

    setIsUpdating(true);
    try {
      await apiFetch(`/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      alert(`Booking successfully marked as ${status}.`);
      setIsManageModalOpen(false);
      // Refresh bookings
      const data = await apiFetch<any[]>('/bookings');
      setBookings(data);
    } catch (err: any) {
      alert(err.message || `Failed to update booking to ${status}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Bookings</h1>
          <p className="text-zinc-400 mt-1">Manage customer reservations and check-ins.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-zinc-800/50 overflow-x-auto whitespace-nowrap pb-1">
        {[
          { id: 'all', label: 'All Reservations' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'occupied', label: 'Occupied' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input 
            placeholder="Search by guest name or ID..." 
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className={`shrink-0 ${showFilters ? 'bg-zinc-800' : ''}`} onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" className={`shrink-0 ${showFilters ? 'bg-zinc-800' : ''}`} onClick={() => setShowFilters(!showFilters)}>
          <CalendarIcon className="w-4 h-4 mr-2" />
          Date Range
        </Button>
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Check-in From</label>
            <Input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Check-out Until</label>
            <Input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Min Amount ($)</label>
            <Input type="number" placeholder="0" value={amountFilter.min} onChange={(e) => setAmountFilter({...amountFilter, min: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Max Amount ($)</label>
            <Input type="number" placeholder="Any" value={amountFilter.max} onChange={(e) => setAmountFilter({...amountFilter, max: e.target.value})} />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800/50">
              <tr>
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Check In - Out</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">Loading bookings...</td>
                </tr>
              ) : (() => {
                const filteredBookings = bookings.filter((b) => {
                  // Tab filter
                  if (activeTab === 'upcoming' && b.bookingStatus !== 'confirmed') return false;
                  if (activeTab === 'occupied' && b.bookingStatus !== 'checked-in') return false;
                  if (activeTab === 'cancelled' && b.bookingStatus !== 'cancelled') return false;
                  
                  // Search filter
                  if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    const idMatch = String(b.id).toLowerCase().includes(query);
                    const nameMatch = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.toLowerCase().includes(query);
                    if (!idMatch && !nameMatch) return false;
                  }

                  // Date range filter
                  if (dateRange.start && new Date(b.checkInDate) < new Date(dateRange.start)) return false;
                  if (dateRange.end && new Date(b.checkOutDate) > new Date(dateRange.end)) return false;
                  
                  // Amount filter
                  if (amountFilter.min && Number(b.totalPrice) < Number(amountFilter.min)) return false;
                  if (amountFilter.max && Number(b.totalPrice) > Number(amountFilter.max)) return false;

                  return true;
                });

                if (filteredBookings.length === 0) {
                  return (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">No bookings found for this category.</td>
                    </tr>
                  );
                }

                return filteredBookings.map((booking) => {
                  const start = new Date(booking.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const end = new Date(booking.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                return (
                  <tr key={booking.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-300 uppercase">{booking.id.split('-')[0]}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                          <User className="w-4 h-4 text-zinc-400" />
                        </div>
                        <span className="text-white font-medium">{booking.user?.firstName} {booking.user?.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Hotel className="w-4 h-4 text-zinc-500" />
                        {booking.room?.roomNumber || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      <div className="flex flex-col">
                        <span>{start}</span>
                        <span className="text-xs text-zinc-500">{end}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">${Number(booking.totalPrice).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                          booking.bookingStatus === 'confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          booking.bookingStatus === 'checked-in' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          booking.bookingStatus === 'completed' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {booking.isNoShow ? 'Cancelled (No-Show)' : (booking.bookingStatus || 'pending')}
                        </span>
                        {booking.checkedInBy && (
                          <span className="text-[10px] text-zinc-500 font-medium">
                            by {booking.checkedInBy.firstName} {booking.checkedInBy.lastName}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openManageModal(booking)}
                        className="text-zinc-400 hover:text-white font-medium text-sm transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Booking Modal */}
      {isManageModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
              <h3 className="text-lg font-semibold text-white">Manage Booking</h3>
              <button onClick={() => setIsManageModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Guest Information</h4>
                <p className="text-white font-medium">{selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</p>
                <p className="text-zinc-400 text-sm">{selectedBooking.user?.email}</p>
                <p className="text-zinc-400 text-sm">{selectedBooking.user?.phoneNumber}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Reservation Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-zinc-400">Reference ID</p>
                    <p className="text-white font-medium uppercase">{selectedBooking.id.split('-')[0]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Room</p>
                    <p className="text-white font-medium">{selectedBooking.room?.roomNumber} ({selectedBooking.room?.type})</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Check In</p>
                    <p className="text-white font-medium">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Check Out</p>
                    <p className="text-white font-medium">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Status</p>
                    <p className="text-white font-medium capitalize">{selectedBooking.isNoShow ? 'No-Show' : selectedBooking.bookingStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Total Price</p>
                    <p className="text-white font-medium">${Number(selectedBooking.totalPrice).toFixed(2)}</p>
                  </div>
                  {selectedBooking.actualCheckInTime && (
                    <div>
                      <p className="text-sm text-zinc-400">Actual Check-In</p>
                      <p className="text-white font-medium">{new Date(selectedBooking.actualCheckInTime).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedBooking.actualCheckOutTime && (
                    <div>
                      <p className="text-sm text-zinc-400">Actual Check-Out</p>
                      <p className="text-white font-medium">{new Date(selectedBooking.actualCheckOutTime).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/50 flex flex-col gap-3">
                {selectedBooking.bookingStatus === 'confirmed' && !selectedBooking.isNoShow && (
                  <Button 
                    onClick={() => updateBookingStatus('cancelled')}
                    disabled={isUpdating}
                    variant="outline"
                    className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10"
                  >
                    {isUpdating ? 'Updating...' : 'Cancel Booking'}
                  </Button>
                )}
                {selectedBooking.bookingStatus === 'checked-in' && (
                  <Button 
                    onClick={() => updateBookingStatus('completed')}
                    disabled={isUpdating}
                    className="w-full bg-[#c79635] hover:bg-[#c79635]/90 text-zinc-950"
                  >
                    {isUpdating ? 'Updating...' : 'Check Out Guest'}
                  </Button>
                )}
                <Button 
                  onClick={() => setIsManageModalOpen(false)}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
