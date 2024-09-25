// AuthGuard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleGuard = ({ children, roles }) => {
  const navigate = useNavigate();

  // Retrieve user information from local storage
  const user = JSON.parse(localStorage.getItem('user')); // Assuming you store user info here

  // Check if user is logged in
  const isLoggedIn = !!user;

  // If not logged in, redirect to login
  if (!isLoggedIn) {

    window.location.href = `/login`;
    return false; // Not authorized
  }

  // Check if user role matches the required roles
  const hasRequiredRole = roles && roles.includes(user.role);

  if (hasRequiredRole) {
    return children; // Access granted
  } else {
    window.location.href = `/unauthorized`;
    return false; // Not authorized
  }
};

export default RoleGuard;
