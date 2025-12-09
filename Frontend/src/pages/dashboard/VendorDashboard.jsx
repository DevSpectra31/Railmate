import { useEffect, useState } from 'react';
import apiClient from '../../api/axios';
import { Package, Plus, ShoppingBag, X, Store } from 'lucide-react';

const VendorDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Food',
        stationId: ''
    });

    const fetchData = async () => {
        try {
            const [prodRes, orderRes, stationRes] = await Promise.all([
                apiClient.get('/products/vendor'),
                apiClient.get('/orders/vendor/list'),
                apiClient.get('/stations') // Need stations for dropdown
            ]);
            setProducts(prodRes.data.data);
            setOrders(orderRes.data.data);
            setStations(stationRes.data.data);
        } catch (error) {
            console.error("Failed to fetch vendor data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/products/add', formData);
            setShowModal(false);
            setFormData({ name: '', price: '', description: '', category: 'Food', stationId: '' });
            fetchData(); // Refresh list
            alert("Product added successfully!");
        } catch (error) {
            console.error("Failed to add product", error);
            alert("Failed to add product. Please check all fields.");
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Vendor Portal</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add Product
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Orders Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-secondary" />
                            Recent Orders
                        </h2>
                        {orders.length > 0 ? (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {orders.map(order => (
                                    <div key={order._id} className="p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold text-gray-900">Order #{order._id.slice(-6)}</span>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className={`px-2 py-0.5 rounded-full text-xs font-bold border-none focus:ring-2 focus:ring-offset-1 ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 focus:ring-yellow-500' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700 focus:ring-red-500' :
                                                        'bg-green-100 text-green-700 focus:ring-green-500'
                                                    }`}
                                            >
                                                {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1 mb-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm text-gray-600">
                                                    <span>{item.quantity}x {item.product?.name || 'Item'}</span>
                                                    <span>₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-gray-900">
                                            <span>Customer: {order.userId?.name}</span>
                                            <span>Total: ₹{order.totalAmount}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
                                No new orders yet.
                            </div>
                        )}
                    </div>

                    {/* Products Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Store className="h-5 w-5 text-primary" />
                            My Products
                        </h2>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {products.length > 0 ? (
                                products.map(p => (
                                    <div key={p._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                                {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover rounded-lg" /> : <Package className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{p.name}</p>
                                                <p className="text-xs text-gray-500">{p.category}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-900">₹{p.price}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No products added.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add Product Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Add New Product</h3>
                                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
                                    <select
                                        name="stationId"
                                        value={formData.stationId}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                        required
                                    >
                                        <option value="">Select Station</option>
                                        {stations.map(s => (
                                            <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Attributes</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            placeholder="Category (e.g. Lunch)"
                                            className="px-3 py-2 border rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Description"
                                            className="px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors mt-6">
                                    Create Product
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorDashboard;
