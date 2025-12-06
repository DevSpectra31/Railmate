import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Track from "./pages/Track";
import UserDashboard from "./pages/dashboard/UserDashboard";
import VendorDashboard from "./pages/dashboard/VendorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import BookParcel from "./pages/BookParcel";
import OrderFood from "./pages/OrderFood";
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/track", element: <Track /> },

            // Protected Feature Routes
            {
                element: <ProtectedRoute allowedRoles={['Customer']} />,
                children: [
                    { path: "/book-parcel", element: <BookParcel /> },
                    { path: "/order-food", element: <OrderFood /> },
                    { path: "/user/dashboard", element: <UserDashboard /> },
                    { path: "/dashboard", element: <UserDashboard /> }, // kept for backward compat if needed
                ]
            },

            // Protected Vendor Routes
            {
                element: <ProtectedRoute allowedRoles={['Vendor']} />,
                children: [
                    { path: "/vendor", element: <VendorDashboard /> },
                    { path: "/vendor/dashboard", element: <VendorDashboard /> },
                ]
            },

            // Protected Admin Routes
            {
                element: <ProtectedRoute allowedRoles={['Admin']} />,
                children: [
                    { path: "/admin", element: <AdminDashboard /> },
                    { path: "/admin/dashboard", element: <AdminDashboard /> },
                ]
            },
        ],
    },
]);

export default router;
