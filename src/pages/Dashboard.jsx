import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar, MapPin, Users, Home } from 'lucide-react';
import axios from 'axios';
import ListingForm from '../components/ListingForm';
import {jwtDecode} from 'jwt-decode';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [userId, setUserId] = useState('');
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
   
   // Decode userId from token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded)
        setUserId(decoded.userId); // Adjust if your token uses a different key
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchBookings();
    if (activeTab === 'listings') {
      fetchListings();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab, userId]);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`https://ulbservice.onrender.com/api/listings/user/${userId}`);
      setListings(res.data);
    } catch (err) {
      setError('Failed to fetch listings', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
       console.log('Fetching bookings for:', userId);
      const res = await axios.get(`https://ulbservice.onrender.com/api/bookings/user/${userId}`);
      console.log(res.data);
      setBookings(res.data);
    } catch (err) {
      setError('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleListingCreated = (newListing) => {
    setListings(prev => [...prev, newListing]);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);

  const TabButton = ({ id, label, icon, count }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      activeTab === id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {icon && React.createElement(icon, { size: 18 })}
    {label}
    {count !== undefined && (
      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
        activeTab === id ? 'bg-blue-500' : 'bg-gray-300'
      }`}>
        {count}
      </span>
    )}
  </button>
);

  

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2"> Dashboard</h1>
          <p className="text-gray-600">Manage your listings and bookings</p>
        </div>

        <div className="flex gap-2 mb-6">
          <TabButton id="listings" label="My Listings" icon={Home} count={listings.length} />
          <TabButton id="bookings" label="Bookings" icon={Calendar} count={bookings.length} />
          <TabButton id="create" label="Create Listing" icon={Edit} />
        </div>

        {activeTab === 'create' && <ListingForm onListingCreated={handleListingCreated} />}

        {/* Listings View */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">My Listings</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">{error}</div>
            ) : listings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Home size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No listings found. Create your first listing to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {listings.map(listing => (
                      <tr key={listing._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {listing.images?.[0] && (
                              <img src={listing.images[0]} alt={listing.title} className="w-12 h-12 rounded-lg object-cover mr-4" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                              <div className="text-sm text-gray-500 capitalize">{listing.propertyType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <MapPin size={14} className="mr-1 inline-block" />
                          {listing.location?.city}, {listing.location?.state}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(listing.price)}/night
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <Users size={14} className="mr-1 inline-block" />
                          {listing.maxGuests} guests • {listing.bedrooms} bed • {listing.bathrooms} bath
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {listing.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900" title="View Details"><Eye size={16} /></button>
                            <button className="text-green-600 hover:text-green-900" title="Edit Listing"><Edit size={16} /></button>
                            <button className="text-red-600 hover:text-red-900" title="Delete Listing"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Bookings View */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Received Bookings</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">{error}</div>
            ) : bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No bookings received yet. Your bookings will appear here once guests make reservations.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map(booking => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-gray-900">
                            {booking.guest?.firstName} {booking.guest?.lastName}
                          </div>
                          <div className="text-gray-500">{booking.guest?.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-gray-900">{booking.listing?.title}</div>
                          <div className="text-gray-500">{booking.listing?.location?.city}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{booking.guests}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(booking.totalPrice)}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900" title="View Details"><Eye size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
