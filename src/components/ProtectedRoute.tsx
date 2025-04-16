
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRoles } from "@/contexts/index";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required, check if user has the required role
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!roles.includes(currentUser.role)) {
      // Redirect to appropriate dashboard based on user role
      const redirectPath = currentUser.role === "admin" ? "/admin" : "/dashboard";
      return <Navigate to={redirectPath} replace />;
    }
  }

  // If authenticated and has required role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
