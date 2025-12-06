import { useEffect, useState } from 'react';
import apiClient from '../../api/axios';
import { Users, Package, Train } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalParcels: 0, totalStations: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get('/dashboard/stats');
                setStats(res.data.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>

                <div className="grid md:grid-cols-3 gap-6">
                    <StatCard icon={Users} title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
                    <StatCard icon={Package} title="Total Parcels" value={stats.totalParcels} color="bg-green-500" />
                    <StatCard icon={Train} title="Total Stations" value={stats.totalStations} color="bg-purple-500" />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        <p className="text-gray-500">Real-time activity logs coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-4 rounded-xl text-white ${color}`}>
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;
