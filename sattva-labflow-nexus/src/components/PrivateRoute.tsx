// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Show while checking auth

  if (!user) {
    // Redirect to login if user is not available
    return <Navigate to="/" replace />;
  }

  return children; // Render the protected page
};

export default PrivateRoute;
