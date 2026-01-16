import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes({user, isLoading}) {
    if (isLoading) return <div>Loading...</div>;
    else if (!user) {
        return <Navigate to="/login" replace />;
    } else {
        return <Outlet />;
    }
}

export default ProtectedRoutes