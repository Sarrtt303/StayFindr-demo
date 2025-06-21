import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';





const Map = ({ listings, selectedListing, onListingSelect }) => {
  return (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative">
      <div className="text-center">
        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Interactive Map</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          To integrate a real map, add Leaflet library:
          <br />
          <code className="bg-gray-200 px-2 py-1 rounded text-xs mt-2 inline-block">
            npm install react-leaflet leaflet
          </code>
        </p>
      </div>
      
      {/* Sample markers visualization */}
      <div className="absolute inset-0 pointer-events-none">
        {listings.slice(0, 5).map((listing, index) => (
          <div
            key={listing._id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + index * 10}%`,
            }}
          >
            <div 
              className={`bg-white rounded-full p-2 shadow-lg border-2 cursor-pointer hover:scale-110 transition-transform ${
                selectedListing === listing._id ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => onListingSelect(listing._id)}
            >
              <span className="text-sm font-semibold text-gray-700">${listing.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;
