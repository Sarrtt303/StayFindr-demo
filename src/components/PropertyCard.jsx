import React, { useState } from 'react';
import { Heart, Star, Users, Bed, Bath, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ 
  property, 
  onFavoriteToggle,
  isFavorited = false,
  className = '' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/listings/${property._id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setFavorited(!favorited);
    if (onFavoriteToggle) {
      onFavoriteToggle(property._id, !favorited);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const truncateTitle = (title, maxLength = 40) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-xl aspect-[4/3]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={property.images?.[0] || '/placeholder-property.jpg'}
          alt={property.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = '/placeholder-property.jpg';
            setImageLoaded(true);
          }}
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <Heart 
            className={`w-4 h-4 ${
              favorited 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>

        {/* Property Type Badge */}
        {property.propertyType && (
          <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium capitalize">
            {property.propertyType}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
          {truncateTitle(property.title)}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{property.location?.city}, {property.location?.state}</span>
        </div>

        {/* Rating */}
        {property.rating && (
          <div className="flex items-center mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium text-gray-900">
              {property.rating.toFixed(1)}
            </span>
            {property.reviewCount && (
              <span className="text-sm text-gray-600 ml-1">
                ({property.reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Amenities */}
        <div className="flex items-center text-gray-600 text-sm mb-3 space-x-4">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          
          {property.maxGuests && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{property.maxGuests} guests</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(property.price)}
              <span className="text-sm font-normal text-gray-600"> /night</span>
            </div>
            {property.totalPrice && (
              <div className="text-sm text-gray-600">
                Total: {formatPrice(property.totalPrice)} before taxes
              </div>
            )}
          </div>
          
          {/* Availability indicator */}
          <div className="text-right">
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              property.isAvailable 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {property.isAvailable ? 'Available' : 'Booked'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;