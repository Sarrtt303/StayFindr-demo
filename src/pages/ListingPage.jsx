import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Gallery from '../components/Gallery';
import PriceDisplay from '../components/PriceDisplay';
import Amenities from '../components/Amenities';

const ListingPage = () => {
  const { id } = useParams(); // Get :id from the route
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`https://ulbservice.onrender.com/api/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        setError('Failed to fetch listing');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading listing...
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        {error || 'Listing not found'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      <p className="text-gray-600 mb-4">{listing.description}</p>

      {/* Image Gallery */}
      <Gallery images={listing.images || []} />

      {/* Amenities */}
      <Amenities amenities={listing.amenities} />

      {/* Price Calculation with integrated Calendar */}
      <PriceDisplay pricePerNight={listing.price} listingId={id} />
    </div>
  );
};

export default ListingPage;
