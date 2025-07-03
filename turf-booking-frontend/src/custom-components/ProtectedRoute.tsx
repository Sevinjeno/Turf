import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    role:string;
    allowedRoles:string[];
    children:React.ReactNode
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, allowedRoles, children }) => {
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }
  
    return <>{children}</>;
  };
  
  export default ProtectedRoute;