import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiClient.post('/users/login', formData);
            // Store user data/token logic here
            console.log('Login success:', res.data);
            login(res.data.data.user);
            navigate(res.data.data.user.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard');
        } catch (err) {
            console.error("Login Error Details:", err);
            console.error("Response Data:", err.response?.data);
            setError(err.response?.data?.message || err.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Welcome Back</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center font-medium">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Enter your email or username"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Enter your password"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                        Sign In
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600">
                    New to Railmate? <Link to="/register" className="text-primary font-semibold hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
