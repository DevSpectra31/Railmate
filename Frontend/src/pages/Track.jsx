import { useState } from 'react';
import { Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import apiClient from '../api/axios';

const Track = () => {
    const [parcelId, setParcelId] = useState('');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setStatus(null);
        try {
            const res = await apiClient.get(`/parcels/status/${parcelId}`);
            setStatus(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Parcel not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
            <div className="max-w-xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Parcel</h1>
                    <p className="text-gray-600">Enter your parcel ID to get real-time status updates.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <form onSubmit={handleTrack} className="flex gap-2">
                        <input
                            type="text"
                            value={parcelId}
                            onChange={(e) => setParcelId(e.target.value)}
                            placeholder="e.g. 6571a..."
                            className="flex-grow px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : <Search className="h-5 w-5" />}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                {status && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-green-50 rounded-full">
                                <Package className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Parcel Found</h3>
                                <p className="text-sm text-gray-500">ID: {status._id}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <span className="text-gray-600">Current Status</span>
                                <span className={`font-bold px-3 py-1 rounded-full text-sm ${status.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {status.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                Updated at: {new Date(status.updatedAt).toLocaleString()}
                            </div>

                            {/* Detailed Tracking History Timeline (Phase 4) */}
                            {status.trackingHistory && status.trackingHistory.length > 0 && (
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="font-semibold text-gray-800 mb-4">Tracking History</h4>
                                    <div className="space-y-4 relative pl-4 border-l-2 border-gray-200 ml-2">
                                        {status.trackingHistory.slice().reverse().map((event, idx) => (
                                            <div key={idx} className="relative pl-6">
                                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                                                <p className="font-medium text-gray-900">{event.status}</p>
                                                <p className="text-sm text-gray-500">{event.location}</p>
                                                <p className="text-xs text-gray-400">{new Date(event.timestamp).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Track;
