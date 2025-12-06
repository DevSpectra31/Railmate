import { useState } from 'react';
import apiClient from '../api/axios';
import { useNavigate } from 'react-router-dom';

const BookParcel = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        weight: '',
        description: '',
        pickupStation: '',
        destinationStation: '',
        receiverName: '',
        receiverMobile: '',
        receiverAddress: '',
        senderName: '', // Optional, could autopopulate from user profile
        senderMobile: '',
        senderAddress: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState(null); // To store parcel data including QR code

    const calculateCost = (weight) => {
        if (!weight) return 0;
        return 50 + (Number(weight) * 10);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const calculatedAmount = calculateCost(formData.weight);

            const payload = {
                weight: Number(formData.weight),
                description: formData.description,
                pickupStation: formData.pickupStation,
                destinationStation: formData.destinationStation,
                paymentMode: 'Online',
                paymentGateway_id: `PG-${Date.now()}`,
                order_id: `ORD-${Date.now()}`,
                receiverDetails: {
                    name: formData.receiverName,
                    mobile: formData.receiverMobile,
                    address: formData.receiverAddress
                },
                senderDetails: {
                    name: formData.senderName,
                    mobile: formData.senderMobile,
                    address: formData.senderAddress
                }
            };

            const response = await apiClient.post('/parcels/create', payload);
            setSuccessData(response.data.data); // Store the parcel data to show receipt
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (successData) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-100">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-500 mb-6">Your parcel ID: <span className="font-mono text-gray-900">{successData._id}</span></p>

                    <div className="bg-gray-50 p-4 rounded-xl mb-6">
                        <img src={successData.qrCode} alt="Parcel QR Code" className="mx-auto w-48 h-48 mix-blend-multiply" />
                        <p className="text-xs text-gray-500 mt-2">Scan this at the station</p>
                    </div>

                    <div className="space-y-2 text-sm text-left mb-6">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Amount Paid</span>
                            <span className="font-bold">₹{successData.amount}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Receiver</span>
                            <span className="font-medium">{successData.receiverDetails.name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Route</span>
                            <span className="font-medium">{successData.pickupStation} &rarr; {successData.destinationStation}</span>
                        </div>
                    </div>

                    <button onClick={() => navigate('/dashboard')} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Book a Parcel</h1>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Parcel Details Section */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">1</span>
                            Parcel Details
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6 pl-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Station *</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" required
                                    value={formData.pickupStation}
                                    onChange={e => setFormData({ ...formData, pickupStation: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Station *</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" required
                                    value={formData.destinationStation}
                                    onChange={e => setFormData({ ...formData, destinationStation: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                                <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" required min="0.1" step="0.1"
                                    value={formData.weight}
                                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Est. Cost: ₹{calculateCost(formData.weight)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" rows="1"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-gray-100"></div>

                    {/* Receiver Details Section */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">2</span>
                            Receiver Details
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6 pl-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name *</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" required
                                    value={formData.receiverName}
                                    onChange={e => setFormData({ ...formData, receiverName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Mobile *</label>
                                <input type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" required
                                    value={formData.receiverMobile}
                                    onChange={e => setFormData({ ...formData, receiverMobile: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Address</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.receiverAddress}
                                    onChange={e => setFormData({ ...formData, receiverAddress: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>

                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:shadow-none">
                        {loading ? 'Processing...' : `Pay ₹${calculateCost(formData.weight)} & Book`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookParcel;
