import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSection from '../components/Hero';
import PropertyCard from '../components/PropertyCard';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);

  // Fetch listings from backend
  const fetchListings = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await axios.get('https://ulbservice.onrender.com/api/listings', {
        params: filters,
      });
      setListings(response.data.listings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (searchData) => {
    setSearchQuery(searchData);
    fetchListings(searchData); // Example: { location: "City" }
  };

  const handleFavoriteToggle = (propertyId, isFavorited) => {
    console.log(`Property ${propertyId} ${isFavorited ? 'added to' : 'removed from'} favorites`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery?.location
                ? `Stays in ${searchQuery.location}`
                : 'Popular stays'}
            </h2>
            {listings.length > 0 && (
              <p className="text-gray-600 mt-1">
                {listings.length} properties found
              </p>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
            Loading properties...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">
            <p className="mb-2 text-lg">Error: {error}</p>
            <button
              onClick={() => fetchListings()}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {listings.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorited={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or browse all listings
            </p>
            <button
              onClick={() => {
                setSearchQuery(null);
                fetchListings();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
