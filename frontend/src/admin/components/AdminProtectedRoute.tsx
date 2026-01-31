import { Navigate, Outlet } from "react-router-dom";
import { userAuthStore } from "../../store/UseUserStore";
import { Loader } from "lucide-react";

const AdminProtectedRoute = () => {
    const { user, checkingAuth } = userAuthStore();

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
