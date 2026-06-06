import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/reduxHooks";

function ProtectedRoute() {
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth,
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
