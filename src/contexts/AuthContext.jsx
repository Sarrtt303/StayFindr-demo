
import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('guest');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const type = localStorage.getItem('userType');
   
    
    if (token) {
      setIsAuthenticated(true);
      setUserType(type || 'guest');
    }
  }, []);

  const login = ({ token, type }) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userType', type);
    setIsAuthenticated(true);
    setUserType(type);
  };

  const logout = () => {
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType('guest');
    
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
