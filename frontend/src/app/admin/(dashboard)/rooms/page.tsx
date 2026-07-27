"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Home, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Walk-in state
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [walkInForm, setWalkInForm] = useState({
    guestFirstName: '',
    guestLastName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });
  
  // Edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRoomForm, setEditRoomForm] = useState({
    id: '',
    roomNumber: '',
    type: '',
    basePricePerNight: '',
    status: '',
  });
  
  const [roomNumber, setRoomNumber] = useState('');
  const [type, setType] = useState('double');
  const [basePricePerNight, setBasePricePerNight] = useState('');

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<any[]>('/rooms');
      setRooms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch('/rooms', {
        method: 'POST',
        body: JSON.stringify({
          roomNumber,
          type,
          basePricePerNight: Number(basePricePerNight),
          status: 'available'
        })
      });
      setIsAddModalOpen(false);
      setRoomNumber('');
      setBasePricePerNight('');
      fetchRooms();
    } catch (err: any) {
      alert(err.message || 'Failed to add room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWalkInModal = (room: any) => {
    setSelectedRoom(room);
    setWalkInForm({
      ...walkInForm,
      checkInDate: new Date().toISOString().split('T')[0],
      checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    });
    setIsWalkInModalOpen(true);
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch('/bookings/walk-in', {
        method: 'POST',
        body: JSON.stringify({
          roomId: selectedRoom.id,
          ...walkInForm
        })
      });
      setIsWalkInModalOpen(false);
      alert('Room successfully booked and checked in!');
      fetchRooms();
    } catch (err: any) {
      alert(err.message || 'Failed to process walk-in booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async (room: any) => {
    if (!room.currentBooking) {
      alert("No active booking found to check out.");
      return;
    }
    
    const confirmCheckOut = window.confirm(`Are you sure you want to check out ${room.currentBooking.user.firstName} ${room.currentBooking.user.lastName} from Room ${room.roomNumber}?`);
    if (!confirmCheckOut) return;
    
    try {
      await apiFetch(`/bookings/${room.currentBooking.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' })
      });
      alert('Guest successfully checked out. Room is now available.');
      fetchRooms();
    } catch (err: any) {
      alert(err.message || 'Failed to check out guest');
    }
  };

  const openEditModal = (room: any) => {
    setEditRoomForm({
      id: room.id,
      roomNumber: room.roomNumber,
      type: room.type,
      basePricePerNight: room.basePricePerNight,
      status: room.status,
    });
    setIsEditModalOpen(true);
  };

  const handleEditRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch(`/rooms/${editRoomForm.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          roomNumber: editRoomForm.roomNumber,
          type: editRoomForm.type,
          basePricePerNight: Number(editRoomForm.basePricePerNight),
          status: editRoomForm.status,
        })
      });
      setIsEditModalOpen(false);
      fetchRooms();
    } catch (err: any) {
      alert(err.message || 'Failed to update room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (statusFilter !== 'all' && room.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const numberMatch = String(room.roomNumber).toLowerCase().includes(query);
      const typeMatch = String(room.type).toLowerCase().includes(query);
      if (!numberMatch && !typeMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Rooms</h1>
          <p className="text-zinc-400 mt-1">Manage hotel rooms, pricing, and availability.</p>
        </div>
        <Button className="shrink-0" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input 
            placeholder="Search by room number or type..." 
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative shrink-0">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <select 
            className="pl-9 pr-8 py-2 bg-transparent border border-zinc-800 rounded-lg text-sm font-medium text-white hover:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700 appearance-none h-10 w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all" className="bg-zinc-900">All Statuses</option>
            <option value="available" className="bg-zinc-900">Available</option>
            <option value="occupied" className="bg-zinc-900">Occupied</option>
            <option value="booked" className="bg-zinc-900">Booked</option>
            <option value="maintenance" className="bg-zinc-900">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800/50">
              <tr>
                <th className="px-6 py-4 font-medium">Room No.</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Base Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-400">Loading rooms...</td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-400">No rooms found matching your filters.</td>
                </tr>
              ) : filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <Home className="w-4 h-4 text-zinc-400" />
                      </div>
                      <span className="text-white font-medium">{room.roomNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300 font-medium capitalize">{room.type}</td>
                  <td className="px-6 py-4 text-zinc-300">${Number(room.basePricePerNight).toFixed(2)} <span className="text-xs text-zinc-500 font-normal">/night</span></td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                        room.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        room.status === 'occupied' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        room.status === 'booked' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      }`}>
                        {room.status}
                      </span>
                      {room.currentBooking?.user && (
                        <span className="text-[10px] text-zinc-500 font-medium">
                          by {room.currentBooking.user.firstName} {room.currentBooking.user.lastName}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {room.status === 'available' && (
                        <button 
                          onClick={() => openWalkInModal(room)}
                          className="px-3 py-1.5 bg-[#c79635]/10 hover:bg-[#c79635]/20 text-[#c79635] text-xs font-semibold rounded-lg transition-colors"
                        >
                          Sell Room
                        </button>
                      )}
                      {room.status === 'occupied' && (
                        <button 
                          onClick={() => handleCheckOut(room)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                      <button 
                        onClick={() => openEditModal(room)}
                        className="text-zinc-400 hover:text-white font-medium text-sm transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
              <h3 className="text-lg font-semibold text-white">Add New Room</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoom} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Room Number</label>
                <Input 
                  required 
                  value={roomNumber} 
                  onChange={e => setRoomNumber(e.target.value)} 
                  placeholder="e.g. 101" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Room Type</label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-500"
                  value={type}
                  onChange={e => setType(e.target.value)}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="family">Family</option>
                  <option value="suite">Suite</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Base Price Per Night ($)</label>
                <Input 
                  required 
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePricePerNight} 
                  onChange={e => setBasePricePerNight(e.target.value)} 
                  placeholder="e.g. 150.00" 
                />
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Room'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
              <h3 className="text-lg font-semibold text-white">Edit Room</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditRoom} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Room Number</label>
                <Input 
                  required 
                  value={editRoomForm.roomNumber} 
                  onChange={e => setEditRoomForm({...editRoomForm, roomNumber: e.target.value})} 
                  placeholder="e.g. 101" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Room Type</label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-500"
                  value={editRoomForm.type}
                  onChange={e => setEditRoomForm({...editRoomForm, type: e.target.value})}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="family">Family</option>
                  <option value="suite">Suite</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Base Price Per Night ($)</label>
                <Input 
                  required 
                  type="number"
                  min="0"
                  step="0.01"
                  value={editRoomForm.basePricePerNight} 
                  onChange={e => setEditRoomForm({...editRoomForm, basePricePerNight: e.target.value})} 
                  placeholder="e.g. 150.00" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Room Status</label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-500 capitalize"
                  value={editRoomForm.status}
                  onChange={e => setEditRoomForm({...editRoomForm, status: e.target.value})}
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Walk-In Booking Modal */}
      {isWalkInModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/50 sticky top-0 bg-zinc-950 z-10">
              <div>
                <h3 className="text-lg font-semibold text-white">Walk-In Booking</h3>
                <p className="text-sm text-zinc-400">Room {selectedRoom.roomNumber} - ${selectedRoom.basePricePerNight}/night</p>
              </div>
              <button onClick={() => setIsWalkInModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleWalkInSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">First Name</label>
                  <Input 
                    required 
                    value={walkInForm.guestFirstName} 
                    onChange={e => setWalkInForm({...walkInForm, guestFirstName: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Last Name</label>
                  <Input 
                    required 
                    value={walkInForm.guestLastName} 
                    onChange={e => setWalkInForm({...walkInForm, guestLastName: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email Address</label>
                <Input 
                  required 
                  type="email"
                  value={walkInForm.guestEmail} 
                  onChange={e => setWalkInForm({...walkInForm, guestEmail: e.target.value})} 
                  placeholder="Receipt will be sent here"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Phone Number</label>
                <Input 
                  required 
                  value={walkInForm.guestPhone} 
                  onChange={e => setWalkInForm({...walkInForm, guestPhone: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Check-in Date</label>
                  <Input 
                    required 
                    type="date"
                    value={walkInForm.checkInDate} 
                    onChange={e => setWalkInForm({...walkInForm, checkInDate: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Check-out Date</label>
                  <Input 
                    required 
                    type="date"
                    min={walkInForm.checkInDate}
                    value={walkInForm.checkOutDate} 
                    onChange={e => setWalkInForm({...walkInForm, checkOutDate: e.target.value})} 
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-3 sticky bottom-0 bg-zinc-950">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsWalkInModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-[#c79635] hover:bg-[#c79635]/90 text-zinc-950" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Confirm & Check-In'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
