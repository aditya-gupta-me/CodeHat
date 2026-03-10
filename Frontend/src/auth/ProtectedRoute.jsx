import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ScaleLoader } from "react-spinners";

/**
 * Route guard that redirects unauthenticated users to /login.
 * Shows a loading spinner while auth state is being determined.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ScaleLoader color="#38bdf8" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
