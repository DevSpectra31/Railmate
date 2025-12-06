import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axios';
import { Package, Utensils, Plus, RefreshCw, ShoppingBag } from 'lucide-react';

const UserDashboard = () => {
    const [activeParcels, setActiveParcels] = useState([]);
    const [foodOrders, setFoodOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [parcelsRes, ordersRes] = await Promise.all([
                apiClient.get('/parcels/user'),
                apiClient.get('/orders/user/list')
            ]);
            setActiveParcels(parcelsRes.data.data);
            setFoodOrders(ordersRes.data.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <div className="flex gap-4">
                        <button onClick={fetchData} className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
                            <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <Link to="/book-parcel" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                            <Plus className="h-5 w-5" />
                            Book Parcel
                        </Link>
                        <Link to="/order-food" className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                            <Utensils className="h-5 w-5" />
                            Order Food
                        </Link>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Parcels Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Active Parcels
                            </h2>
                        </div>

                        {activeParcels.length > 0 ? (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {activeParcels.map(p => (
                                    <div key={p._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900">ID: {p._id.slice(-6)}</p>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${p.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{p.pickupStation} → {p.destinationStation}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(p.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="font-bold text-gray-900">₹{p.amount}</span>
                                            <Link to="/track" className="text-xs text-primary hover:underline">Track &rarr;</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <Package className="h-12 w-12 mb-2 opacity-20" />
                                <p>No active parcels found.</p>
                            </div>
                        )}
                    </div>

                    {/* Food Orders Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-secondary" />
                                Recent Food Orders
                            </h2>
                        </div>

                        {foodOrders.length > 0 ? (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {foodOrders.map(order => (
                                    <div key={order._id} className="p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-gray-900">{order.stationId?.name || 'Unknown Station'}</p>
                                                <p className="text-xs text-gray-500">Vendor: {order.vendorId?.name}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="space-y-1 mb-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm text-gray-600">
                                                    <span>{item.quantity}x {item.product?.name || 'Item'}</span>
                                                    <span>₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="font-bold text-gray-900">Total: ₹{order.totalAmount}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <Utensils className="h-12 w-12 mb-2 opacity-20" />
                                <p>No food orders found.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
