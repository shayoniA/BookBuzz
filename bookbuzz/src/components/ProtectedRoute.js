import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

// const ProtectedRoute = ({ children }) => {
//   const user = auth.currentUser;
//   return user ? children : <Navigate to="/login" />;
// };

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('userId');  // Check localStorage
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;