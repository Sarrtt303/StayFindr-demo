
export const SITE_TITLE = "StayFinder";
export const API_BASE_URL = "http://localhost:5173";

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const isAuthenticated = () => {
  // Check if the user is authenticated
  return !!localStorage.getItem('authToken');
};

export const getUserType = () => {
  // Get the user type from localStorage or any other storage
  return localStorage.getItem('userType') || 'guest';
};
