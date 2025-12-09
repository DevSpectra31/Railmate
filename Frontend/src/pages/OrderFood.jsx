import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { ShoppingBag, UtensilsCrossed, Pizza } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

const CATEGORIES = [
    { id: 'All', name: 'All', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60' },
    { id: 'Meals', name: 'Meals', image: 'https://images.unsplash.com/photo-1546833999-b9f58161460e?w=500&auto=format&fit=crop&q=60' },
    { id: 'Biryani', name: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60' },
    { id: 'South Indian', name: 'South Indian', image: 'https://images.unsplash.com/photo-1668236543090-d2f896953f0c?w=500&auto=format&fit=crop&q=60' },
    { id: 'Italian', name: 'Italian', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60' },
    { id: 'Snacks', name: 'Snacks', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=60' },
    { id: 'Drinks', name: 'Drinks', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&auto=format&fit=crop&q=60' },
];

const OrderFood = () => {
    const [stations, setStations] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedStation, setSelectedStation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(false);

    // Payment Modal State
    const [showPayment, setShowPayment] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        apiClient.get('/stations')
            .then(res => setStations(res.data.data))
            .catch(err => console.error("Failed to load stations", err));
    }, []);

    useEffect(() => {
        if (!selectedStation) {
            setProducts([]);
            setFilteredProducts([]);
            return;
        }

        setLoading(true);
        apiClient.get(`/products/station/${selectedStation}`)
            .then(res => {
                setProducts(res.data.data);
                setFilteredProducts(res.data.data);
                setSelectedCategory('All');
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [selectedStation]);

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === selectedCategory));
        }
    }, [selectedCategory, products]);

    const initiateOrder = (product) => {
        setSelectedProduct(product);
        setShowPayment(true);
    };

    const handleOrderSuccess = async () => {
        setShowPayment(false);
        const product = selectedProduct;
        try {
            const payload = {
                items: [{ productId: product._id, quantity: 1, price: product.price }],
                totalAmount: product.price,
                stationId: selectedStation,
                vendorId: product.vendorId
            };
            await apiClient.post('/orders/create', payload);
            alert(`Ordered ${product.name} successfully!`);
        } catch (error) {
            alert('Failed to place order. Ensure you are logged in.');
            console.error(error);
        } finally {
            setSelectedProduct(null);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
            {showPayment && selectedProduct && (
                <PaymentModal
                    amount={selectedProduct.price}
                    onClose={() => setShowPayment(false)}
                    onSuccess={handleOrderSuccess}
                />
            )}
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header & Station Select */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Order Food on Train</h1>
                    <div className="relative w-full max-w-md">
                        <select
                            className="w-full px-4 py-3 border rounded-xl appearance-none focus:ring-2 focus:ring-secondary outline-none bg-white shadow-sm"
                            onChange={(e) => setSelectedStation(e.target.value)}
                            value={selectedStation}
                        >
                            <option value="">Select Station</option>
                            {stations.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>
                </div>

                {/* Category Navigation */}
                {products.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">What's on your mind?</h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex flex-col items-center gap-2 min-w-[100px] transition-transform hover:scale-105 ${selectedCategory === cat.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <div className={`h-24 w-24 rounded-full overflow-hidden border-4 ${selectedCategory === cat.id ? 'border-secondary shadow-md' : 'border-transparent'}`}>
                                        <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                                    </div>
                                    <span className={`text-sm font-medium ${selectedCategory === cat.id ? 'text-secondary' : 'text-gray-600'}`}>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                {loading ? (
                    <div className="flex flex-col items-center py-20 opacity-50">
                        <UtensilsCrossed className="h-12 w-12 animate-pulse mb-4" />
                        <p>Loading curated menu...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(p => (
                                <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={p.image || 'https://via.placeholder.com/300?text=Food'}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                                            {p.category}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{p.name}</h3>
                                            <span className="text-green-700 font-bold">₹{p.price}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[2.5em]">{p.description || "Freshly prepared meal for your journey."}</p>
                                        <button
                                            onClick={() => initiateOrder(p)}
                                            className="w-full bg-secondary hover:bg-orange-600 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            Order Now
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            selectedStation && (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
                                    <Pizza className="h-12 w-12 mb-2 opacity-20" />
                                    <p>No items found in {selectedCategory}.</p>
                                    <button onClick={() => setSelectedCategory('All')} className="text-secondary text-sm mt-2 hover:underline">View All</button>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderFood;
