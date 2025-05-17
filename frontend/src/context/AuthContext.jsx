import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user on component mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Set token for authenticated requests
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      
      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Set token for authenticated requests
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred during login',
      };
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/users', { name, email, password });
      
      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Set token for authenticated requests
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred during registration',
      };
    }
  };

  // Logout user
  const logout = () => {
    // Remove user from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
    
    // Remove token from api headers
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};