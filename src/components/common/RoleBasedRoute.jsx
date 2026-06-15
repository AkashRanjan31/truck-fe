import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { can } from '../utils/roleUtils';

const RoleBasedRoute = ({ children, requiredRole, requiredAction }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!auth) {
    return <Navigate to="/auth" replace />;
  }

  const userRole = auth.role;

  if (requiredRole && !requiredRole.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredAction && !can(userRole, requiredAction)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;
