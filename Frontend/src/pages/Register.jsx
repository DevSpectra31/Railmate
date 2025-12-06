import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { User, Mail, Lock, Phone } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        mobile: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Registering with selected role (defaults to Customer if not changed)
            await apiClient.post('/users/register', { ...formData, role: formData.role || 'Customer' });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-12">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Create Account</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center font-medium">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputGroup icon={User} name="name" placeholder="Full Name" onChange={handleChange} />
                    <InputGroup icon={User} name="username" placeholder="Username" onChange={handleChange} />
                    <InputGroup icon={Mail} name="email" type="email" placeholder="Email Address" onChange={handleChange} />
                    <InputGroup icon={Phone} name="mobile" placeholder="Mobile Number" onChange={handleChange} />

                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            name="role"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white text-gray-700"
                        >
                            <option value="Customer">Customer</option>
                            <option value="Vendor">Vendor</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>

                    <InputGroup icon={Lock} name="password" type="password" placeholder="Password" onChange={handleChange} />

                    <button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 mt-4">
                        Sign Up
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};

const InputGroup = ({ icon: Icon, type = "text", ...props }) => (
    <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
            type={type}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            {...props}
            required
        />
    </div>
);

export default Register;
