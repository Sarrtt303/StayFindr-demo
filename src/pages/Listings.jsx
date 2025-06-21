import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const FlyToLocation = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 13);
    }
  }, [center]);

  return null;
};

const ListingsPage = () => {
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [mapCenter, setMapCenter] = useState([23.8386, 91.2768]);
  const [focusedLocation, setFocusedLocation] = useState(null); // Marker for selected card
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  useEffect(() => {
    if (location.state && location.state.searchData) {
      setSearchData(location.state.searchData);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('https://ulbservice.onrender.com/api/listings');
        const listingsData = response.data.listings || [];
        setListings(listingsData);
        setFilteredListings(listingsData);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
        setFilteredListings([]);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    if (listings.length > 0) {
      const filtered = listings.filter(listing => {
        const matchesLocation = listing.location.city.toLowerCase().includes(searchData.location.toLowerCase());
        const matchesGuests = listing.maxGuests >= searchData.guests;
        return matchesLocation && matchesGuests;
      });
      setFilteredListings(filtered);
    }
  }, [searchData, listings]);

  const geocodeLocation = async (location) => {
    if (!location || location.trim().length < 3) return null;

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: location,
          format: 'json',
          addressdetails: 1,
          limit: 1,
        },
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        if (
          result.type === 'country' ||
          result.type === 'continent' ||
          !result.display_name.toLowerCase().includes(location.toLowerCase())
        ) {
          return null;
        }
        const { lat, lon } = result;
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    return null;
  };

  const handleSearch = async (data) => {
    setSearchData(data);
    const coordinates = await geocodeLocation(data.location);
    if (coordinates) {
      setFocusedLocation(null); // Reset individual selection when searching
      setMapCenter([coordinates.lat, coordinates.lng]);
    }
  };

  const handleViewOnMap = async (listingId) => {
  try {
    const response = await axios.get(`https://ulbservice.onrender.com/api/listings/${listingId}`);
    
    const listing = response.data?.listing || response.data; // fallback in case it’s not wrapped

    console.log("Fetched listing:", listing); // ✅ Debug: show full data

    const coords = listing?.location?.coordinates;

    if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
      const latLngArray = [coords.lat, coords.lng];
      setMapCenter(latLngArray);
      setFocusedLocation(latLngArray);
      console.log("Set map center to:", latLngArray);
    } else {
      console.warn("Coordinates missing or malformed in listing:", coords);
    }
  } catch (error) {
    console.error('Error fetching listing by ID:', error);
  }
};



  const redIcon = new L.Icon({
  iconUrl: 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=•|ff0000',
  iconSize: [21, 34],
  iconAnchor: [10, 34],
  popupAnchor: [0, -34],
});


  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} initialData={searchData} />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-4 space-y-6">
          {Array.isArray(filteredListings) && filteredListings.map(listing => (
            <div key={listing._id} className="relative border p-4 rounded-lg shadow">
              <PropertyCard property={listing} />
              <div className="mt-2 text-right">
                <button
                  onClick={() => handleViewOnMap(listing._id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  📍 View on Map
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-1/2 p-4" style={{ height: '600px' }}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <FlyToLocation center={mapCenter} />

            {focusedLocation && (
              <Marker position={focusedLocation} icon={redIcon}>
                <Popup>
                  <strong>Selected Listing</strong>
                </Popup>
              </Marker>
            )}

            {Array.isArray(filteredListings) &&
              filteredListings.map(listing => (
                listing.location?.coordinates && (
                  <Marker
                    key={listing._id}
                    position={[
                      listing.location.coordinates.lat,
                      listing.location.coordinates.lng
                    ]}
                  >
                    <Popup>
                      <div>
                        <h3>{listing.title}</h3>
                        <p>{listing.description}</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
