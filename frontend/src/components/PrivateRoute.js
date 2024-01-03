import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element }) => {
  const { user } = useAuth();

  // If user is authenticated, render the route, else redirect to login
  return user ? <Route element={element} /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
