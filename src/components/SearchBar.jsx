import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, className = '', initialData }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  useEffect(() => {
    if (initialData) {
      setSearchData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleSeeArea = () => {
    navigate('/listingmap', { state: { searchData } });
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded-full shadow-lg border border-gray-200 p-2 ${className}`}>
      <div className="flex items-center divide-x divide-gray-200">
        {/* Location */}
        <div className="flex-1 px-4 py-2">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Where</label>
              <input
                type="text"
                placeholder="Search destinations"
                value={searchData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full text-sm text-gray-900 placeholder-gray-500 border-none outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Check-in */}
        <div className="flex-1 px-4 py-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Check in</label>
              <input
                type="date"
                value={searchData.checkIn}
                onChange={(e) => handleInputChange('checkIn', e.target.value)}
                className="w-full text-sm text-gray-900 border-none outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Check-out */}
        <div className="flex-1 px-4 py-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Check out</label>
              <input
                type="date"
                value={searchData.checkOut}
                onChange={(e) => handleInputChange('checkOut', e.target.value)}
                className="w-full text-sm text-gray-900 border-none outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="flex-1 px-4 py-2">
          <div className="flex items-center">
            <Users className="w-4 h-4 text-gray-400 mr-2" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Guests</label>
              <select
                value={searchData.guests}
                onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                className="w-full text-sm text-gray-900 border-none outline-none bg-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>
                    {num} guest{num !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="pl-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-colors duration-200"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* See Area Button */}
        <div className="pl-2">
          <button
            type="button"
            onClick={handleSeeArea}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 transition-colors duration-200"
          >
            Open Map
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
