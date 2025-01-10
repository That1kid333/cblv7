import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../lib/services/auth.service';

interface RiderProtectedRouteProps {
  children: React.ReactNode;
}

function RiderProtectedRoute({ children }: RiderProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRider, setIsRider] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        // Check if the user is a registered rider
        const userDoc = await authService.getUserDoc(user.uid);
        setIsRider(userDoc?.type === 'rider');
      }
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#C69249] text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/rider/login" replace />;
  }

  if (!isRider) {
    // If authenticated but not a rider, redirect to signup
    return <Navigate to="/rider/signup" replace />;
  }

  return <>{children}</>;
}

export default RiderProtectedRoute;
