import React from 'react';
import {
  Wifi,
  Coffee,
  Monitor,
  Car,
  Utensils,
  Tv,
  ShowerHead,
  AirVent,
  TreePine,
  Baby,
  PawPrint,
} from 'lucide-react';

const Amenities = ({ amenities }) => {
  const amenityIcons = {
    wifi: <Wifi className="w-5 h-5" />,
    kitchen: <Utensils className="w-5 h-5" />,
    'dedicated workspace': <Monitor className="w-5 h-5" />,
    'free parking': <Car className="w-5 h-5" />,
    coffee: <Coffee className="w-5 h-5" />,
    tv: <Tv className="w-5 h-5" />,
    'hot water': <ShowerHead className="w-5 h-5" />,
    'air conditioning': <AirVent className="w-5 h-5" />,
    'garden view': <TreePine className="w-5 h-5" />,
    'child-friendly': <Baby className="w-5 h-5" />,
    'pet-friendly': <PawPrint className="w-5 h-5" />,
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold">Amenities</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {amenities.map((amenity) => {
          const normalizedKey = amenity.toLowerCase();
          return (
            <div key={amenity} className="flex items-center gap-2">
              {amenityIcons[normalizedKey] || <span className="w-5 h-5" />}
              <span>{amenity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Amenities;
