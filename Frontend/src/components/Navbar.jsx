import { Link } from 'react-router-dom';
import { Train, Package, User } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Train className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">Railmate</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-8">
                        <Link to="/track" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1 font-medium">
                            <Package className="h-5 w-5" />
                            Track Parcel
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-900 font-medium">Hello, {user.username}</span>
                                <Link to={user.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard'} className="text-primary hover:underline font-medium">
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium ml-2">
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-900 font-medium hover:text-primary px-3 py-2 rounded-md transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-primary hover:bg-blue-800 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-lg shadow-blue-500/30">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
