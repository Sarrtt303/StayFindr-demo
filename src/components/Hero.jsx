
import SearchBar from './SearchBar';

const HeroSection = ({ onSearch }) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-repeat"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Find your perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              stay anywhere
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
            Discover amazing places to stay, from cozy apartments to luxury villas. 
            Book unique accommodations around the world.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
          <SearchBar 
            onSearch={onSearch}
            className="shadow-2xl"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-yellow-400">10K+</div>
            <div className="text-blue-100">Properties</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">50K+</div>
            <div className="text-blue-100">Happy Guests</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">100+</div>
            <div className="text-blue-100">Cities</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">4.8★</div>
            <div className="text-blue-100">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;