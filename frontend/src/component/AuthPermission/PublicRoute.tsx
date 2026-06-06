import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/reduxHooks";

function PublicRoute() {
    const { isAuthenticated, loading } = useAppSelector(
        (state) => state.auth
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

export default PublicRoute;