import React, { useState } from 'react';
import { SITE_TITLE } from './utils';
import { useAuth } from '../contexts/AuthContext';
import {jwtDecode} from 'jwt-decode';
import def from "../assets/default.jpg";

const Navbar = () => {
  const { isAuthenticated, userType, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (dropdown) => {
    setDropdownOpen(dropdownOpen === dropdown ? null : dropdown);
  };

  const getUserName = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      
      return decodedToken.name || 'User';
    }
    return 'User';
  };
  
  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo - Always visible */}
        <div className="text-xl font-bold">
          <a href="/">{SITE_TITLE}</a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-gray-700 items-center">
          <a href="/listingmap" className="hover:text-orange-500 cursor-pointer">Explore</a>

          {isAuthenticated ? (
            <>
              {userType === 'guest' ? (
                <>
                  <a href="/my-trips" className="hover:text-orange-500 cursor-pointer">My Trips</a>
                  <a href="/saved" className="hover:text-orange-500 cursor-pointer">Saved</a>
                </>
              ) : (
                <div
                  className="relative cursor-pointer"
                  onMouseEnter={() => toggleDropdown('hostDashboard')}
                  onMouseLeave={() => toggleDropdown(null)}
                >
                  <span className="hover:text-orange-500">Dashboard</span>
                  {dropdownOpen === 'hostDashboard' && (
                    <ul className="absolute top-6 left-0 bg-white shadow-lg py-2 w-48 rounded-md">
                      <li className="px-4 py-2 hover:bg-gray-100"><a href="/your-listings">Your Listings</a></li>
                      <li className="px-4 py-2 hover:bg-gray-100"><a href="/reservations">Reservations</a></li>
                      <li className="px-4 py-2 hover:bg-gray-100"><a href="/calendar">Calendar</a></li>
                      <li className="px-4 py-2 hover:bg-gray-100"><a href="/analytics">Analytics</a></li>
                      <li className="px-4 py-2 hover:bg-gray-100"><a href="/add-new-listing">Add New Listing</a></li>
                    </ul>
                  )}
                </div>
              )}

              <a href="/messages" className="hover:text-orange-500 cursor-pointer relative">
                Messages
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </a>

              <div
                className="relative cursor-pointer"
                onMouseEnter={() => toggleDropdown('profile')}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <div className="flex items-center hover:text-orange-500">
                  <img src={def} alt="Avatar" className="rounded-full mr-2 object-contain" style={{ width: '30px', height: '30px' }} />
                  {getUserName()}
                </div>
                {dropdownOpen === 'profile' && (
                  <ul className="absolute top-6 right-0 bg-white shadow-lg py-2 w-48 rounded-md">
                    <li className="px-4 py-2 hover:bg-gray-100"><a href="/account-settings">Account Settings</a></li>
                    <li className="px-4 py-2 hover:bg-gray-100"><a href="/payment-methods">Payment Methods</a></li>
                    {userType === 'guest' && (
                      <>
                        <li className="px-4 py-2 hover:bg-gray-100"><a href="/notifications">Notifications</a></li>
                        <li className="px-4 py-2 hover:bg-gray-100"><a href="/become-host">Host Your Space</a></li>
                      </>
                    )}
                    {userType === 'host' && (
                      <li className="px-4 py-2 hover:bg-gray-100"><a href="/switch-to-guest">Switch to Guest View</a></li>
                    )}
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <button onClick={handleLogout}>Log Out</button>
                    </li>
                  </ul>
                )}
              </div>
            </>
          ) : (
            <>
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => toggleDropdown('host')}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <span className="hover:text-orange-500">Host</span>
                {dropdownOpen === 'host' && (
                  <ul className="absolute top-6 left-0 bg-white shadow-lg py-2 w-48 rounded-md">
                    <li className="px-4 py-2 hover:bg-gray-100"><a href="/list-your-space">List Your Space</a></li>
                    <li className="px-4 py-2 hover:bg-gray-100"><a href="/host-resources">Host Resources</a></li>
                    <li className="px-4 py-2 hover:bg-gray-100"><a href="/host-community">Host Community</a></li>
                  </ul>
                )}
              </div>

              <div
                className="relative cursor-pointer"
                onMouseEnter={() => toggleDropdown('help')}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <span className="hover:text-orange-500">Help</span>
                {dropdownOpen === 'help' && (
                  <ul className="absolute top-6 left-0 bg-white shadow-lg py-2 w-48 rounded-md">
                    <li className="px-4 py-2 hover:bg-gray-100"><a href="/help-center">Help Center</a></li>
                    <li className="px-4 py-2 hover:bg-gray-100"><a href="/contact-support">Contact Support</a></li>
                    <li className="px-4 py-2 hover:bg-gray-100"><a href="/safety-guidelines">Safety Guidelines</a></li>
                  </ul>
                )}
              </div>

              <a href="/register" className="hover:text-orange-500 cursor-pointer">Sign Up</a>
              <a href="/login" className="hover:text-orange-500 cursor-pointer">Log In</a>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white">
          <a href="/listingmap" className="block hover:text-orange-500">Explore</a>

          {isAuthenticated ? (
            <>
              {userType === 'guest' ? (
                <>
                  <a href="/my-trips" className="block hover:text-orange-500">My Trips</a>
                  <a href="/saved" className="block hover:text-orange-500">Saved</a>
                </>
              ) : (
                <div>
                  <span className="block hover:text-orange-500" onClick={() => toggleDropdown('hostDashboard')}>Host Dashboard</span>
                  {dropdownOpen === 'hostDashboard' && (
                    <div className="pl-4">
                      <a href="/your-listings" className="block hover:text-orange-500 py-1">Your Listings</a>
                      <a href="/reservations" className="block hover:text-orange-500 py-1">Reservations</a>
                      <a href="/calendar" className="block hover:text-orange-500 py-1">Calendar</a>
                      <a href="/analytics" className="block hover:text-orange-500 py-1">Analytics</a>
                      <a href="/add-new-listing" className="block hover:text-orange-500 py-1">Add New Listing</a>
                    </div>
                  )}
                </div>
              )}

              <a href="/messages" className="block hover:text-orange-500 relative">
                Messages
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </a>

              <div>
                <div className="flex items-center hover:text-orange-500" onClick={() => toggleDropdown('profile')}>
                  <img src={def} alt="Avatar" className="rounded-full mr-2 object-contain" style={{ width: '30px', height: '30px' }} />
                  {getUserName()}
                </div>
                {dropdownOpen === 'profile' && (
                  <div className="pl-4">
                    <a href="/account-settings" className="block hover:text-orange-500 py-1">Account Settings</a>
                    <a href="/payment-methods" className="block hover:text-orange-500 py-1">Payment Methods</a>
                    {userType === 'guest' && (
                      <>
                        <a href="/notifications" className="block hover:text-orange-500 py-1">Notifications</a>
                        <a href="/become-host" className="block hover:text-orange-500 py-1">Host Your Space</a>
                      </>
                    )}
                    {userType === 'host' && (
                      <a href="/switch-to-guest" className="block hover:text-orange-500 py-1">Switch to Guest View</a>
                    )}
                    <a href="#" onClick={handleLogout} className="block hover:text-orange-500 py-1">Log Out</a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="block hover:text-orange-500" onClick={() => toggleDropdown('host')}>Host</span>
                {dropdownOpen === 'host' && (
                  <div className="pl-4">
                    <a href="/list-your-space" className="block hover:text-orange-500 py-1">List Your Space</a>
                    <a href="/host-resources" className="block hover:text-orange-500 py-1">Host Resources</a>
                    <a href="/host-community" className="block hover:text-orange-500 py-1">Host Community</a>
                  </div>
                )}
              </div>

              <div>
                <span className="block hover:text-orange-500" onClick={() => toggleDropdown('help')}>Help</span>
                {dropdownOpen === 'help' && (
                  <div className="pl-4">
                    <a href="/help-center" className="block hover:text-orange-500 py-1">Help Center</a>
                    <a href="/contact-support" className="block hover:text-orange-500 py-1">Contact Support</a>
                    <a href="/safety-guidelines" className="block hover:text-orange-500 py-1">Safety Guidelines</a>
                  </div>
                )}
              </div>

              <a href="/register" className="block hover:text-orange-500">Sign Up</a>
              <a href="/login" className="block hover:text-orange-500">Log In</a>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
