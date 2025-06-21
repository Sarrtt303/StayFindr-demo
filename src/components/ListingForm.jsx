import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, MapPin, Loader2 } from 'lucide-react';
// Note: axios import removed for artifact compatibility - replace with your HTTP client
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const ListingForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    price: '',
    images: [''],
    amenities: [],
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 1,
    availableFrom: '',
    availableTo: '',
  });

  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingStates, setUploadingStates] = useState({});

  const amenityOptions = [
    'wifi',
    'kitchen',
    'dedicated workspace',
    'free parking',
    'coffee',
    'tv',
    'hot water',
    'air conditioning'
  ];

  // Load Cloudinary script
  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Geocoding function using fetch API
  const geocodeLocation = async (location) => {
    if (!location || location.trim().length < 3) return null;

    try {
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.append('q', location);
      url.searchParams.append('format', 'json');
      url.searchParams.append('addressdetails', '1');
      url.searchParams.append('limit', '1');

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
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

  // Generate coordinates from location fields
  const handleGeocoding = async () => {
    const { address, city, state, country } = formData;
    
    if (!address && !city && !state && !country) {
      setMessage('❌ Please fill in at least one location field before generating coordinates.');
      return;
    }

    setGeocoding(true);
    setMessage('');

    try {
      // Try different combinations of location data
      const locationQueries = [
        `${address}, ${city}, ${state}, ${country}`.replace(/,\s*,/g, ',').replace(/^,|,$/g, ''),
        `${city}, ${state}, ${country}`.replace(/,\s*,/g, ',').replace(/^,|,$/g, ''),
        `${address}, ${city}`.replace(/,\s*,/g, ',').replace(/^,|,$/g, ''),
        `${city}, ${country}`.replace(/,\s*,/g, ',').replace(/^,|,$/g, ''),
      ].filter(query => query.length > 0);

      let coordinates = null;
      
      for (const query of locationQueries) {
        coordinates = await geocodeLocation(query);
        if (coordinates) break;
      }

      if (coordinates) {
        setFormData(prev => ({
          ...prev,
          lat: coordinates.lat.toString(),
          lng: coordinates.lng.toString()
        }));
        setMessage('✅ Coordinates generated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Could not generate coordinates for this location. Please enter them manually.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setMessage('❌ Error generating coordinates. Please try again or enter them manually.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleAddImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleRemoveImage = (index) => {
    if (formData.images.length > 1) {
      const updatedImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: updatedImages }));
    }
  };

  // Cloudinary upload handler
  const handleImageUpload = (index) => {
    if (!window.cloudinary) {
      alert('Cloudinary is not loaded yet. Please try again.');
      return;
    }

    setUploadingStates(prev => ({ ...prev, [index]: true }));
    
    window.cloudinary.openUploadWidget(
      {
        cloudName: import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
        uploadPreset: "images-listings",
        sources: ["local", "url"],
        multiple: false,
        
        clientAllowedFormats: ["jpg", "png", "jpeg"],
        maxImageFileSize: 3000000,
      },
      (error, result) => {
        setUploadingStates(prev => ({ ...prev, [index]: false }));
        if (!error && result && result.event === "success") {
          handleImageChange(index, result.info.secure_url);
        } else if (error) {
          console.error('Upload error:', error);
          alert('Upload failed. Please try again.');
        }
      }
    );
  };

  // Function to get the user ID from the token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
  
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const hostId = getUserIdFromToken();

      const payload = {
        title: formData.title,
        description: formData.description,
        host: hostId,
        propertyType: formData.propertyType.toLowerCase(),
        price: parseFloat(formData.price),
        maxGuests: parseInt(formData.maxGuests),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        images: formData.images.filter((img) => img.trim() !== ''),
        amenities: formData.amenities,
        availableFrom: new Date(formData.availableFrom),
        availableTo: new Date(formData.availableTo),
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          coordinates: {
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
          },
        },
        isActive: true,
      };

      console.log('📦 Submitting listing payload:', payload);

      // Replace with your actual API call using axios or fetch
      const response = await axios.post('https://ulbservice.onrender.com/api/listings', payload);
      

      console.log('✅ Listing created:', response.data);
      setMessage('✅ Listing created successfully!');

      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          address: '',
          city: '',
          state: '',
          country: '',
          lat: '',
          lng: '',
          price: '',
          images: [''],
          amenities: [],
          propertyType: '',
          bedrooms: 1,
          bathrooms: 1,
          maxGuests: 1,
          availableFrom: '',
          availableTo: '',
        });
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('❌ Error creating listing:', error);
      setMessage('❌ Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a New Listing</h2>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="Enter listing title" 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Describe your property" 
                  rows="3"
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="Address" 
                  className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
                <input 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  placeholder="City" 
                  className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
                <input 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange} 
                  placeholder="State/Province" 
                  className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
                <input 
                  name="country" 
                  value={formData.country} 
                  onChange={handleChange} 
                  placeholder="Country" 
                  className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              {/* Coordinates Section */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Coordinates</label>
                  <button
                    type="button"
                    onClick={handleGeocoding}
                    disabled={geocoding}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {geocoding ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <MapPin size={16} />
                        <span>Generate Coordinates</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                    <input 
                      name="lat" 
                      type="number" 
                      step="any"
                      value={formData.lat} 
                      onChange={handleChange} 
                      placeholder="e.g., 40.7128" 
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                    <input 
                      name="lng" 
                      type="number" 
                      step="any"
                      value={formData.lng} 
                      onChange={handleChange} 
                      placeholder="e.g., -74.0060" 
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Fill in the location fields above and click "Generate Coordinates", or enter latitude and longitude manually.
                </p>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per night</label>
                <input 
                  name="price" 
                  type="number" 
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="0" 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <input 
                  name="propertyType" 
                  value={formData.propertyType} 
                  onChange={handleChange} 
                  placeholder="e.g., apartment, villa" 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input 
                  name="bedrooms" 
                  type="number" 
                  value={formData.bedrooms} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input 
                  name="bathrooms" 
                  type="number" 
                  value={formData.bathrooms} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                <input 
                  name="maxGuests" 
                  type="number" 
                  value={formData.maxGuests} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>

            {/* Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                <input 
                  name="availableFrom" 
                  type="date" 
                  value={formData.availableFrom} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available To</label>
                <input 
                  name="availableTo" 
                  type="date" 
                  value={formData.availableTo} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Property Images</label>
              <div className="space-y-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <input
                        value={img}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder={`Image ${index + 1} URL`}
                        className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImageUpload(index)}
                      disabled={uploadingStates[index]}
                      className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 min-w-[120px] justify-center"
                    >
                      {uploadingStates[index] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>Upload</span>
                        </>
                      )}
                    </button>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={handleAddImageField} 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Plus size={16} />
                  Add another image
                </button>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenityOptions.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
              disabled={loading}
            >
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </button>

            {message && (
              <div className={`p-4 rounded-md text-center ${
                message.includes('✅') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingForm;