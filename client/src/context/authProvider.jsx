import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { registerUser as registerUserAPI, loginUser as loginUserAPI } from '../services/api';
import { AuthContext } from './authContext';

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        // Decode token to get user info
        const decoded = jwtDecode(storedToken);

        // Check if token is expired; exp is in seconds
        if (decoded.exp * 1000 < Date.now()) {
          // Token expired, clear it
          localStorage.removeItem('token');
        } else {
          // Token valid, set user and token
          setToken(storedToken);
          setUser(decoded.user);
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Register function
  const register = async (name, email, password) => {
    try {
      // Call API to register user
      const data = await registerUserAPI(name, email, password);

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Decode token to get user info
      const decoded = jwtDecode(data.token);

      // Update state
      setToken(data.token);
      setUser(decoded.user);

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      return { success: false, error: errorMsg };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      // Call API to login user
      const data = await loginUserAPI(email, password);

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Decode token to get user info
      const decoded = jwtDecode(data.token);

      // Update state
      setToken(data.token);
      setUser(decoded.user);

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || 'Login failed';
      return { success: false, error: errorMsg };
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Clear state
    setToken(null);
    setUser(null);
  };

  // Context value to provide
  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
