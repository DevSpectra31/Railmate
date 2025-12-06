import { Link } from 'react-router-dom';
import { Package, Utensils, Clock, ShieldCheck } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 drop-shadow-lg">
                        Railway Services, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Reimagined.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Book parcels, order food, and track deliveries in real-time. Experience the future of Indian Railways convenience today.
                    </p>
                    <div className="flex justify-center gap-6">
                        <Link to="/book-parcel" className="bg-primary hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full font-semibold shadow-xl shadow-blue-500/20 transition-all transform hover:scale-105">
                            Book a Parcel
                        </Link>
                        <Link to="/order-food" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-lg px-8 py-4 rounded-full font-semibold border border-white/20 transition-all">
                            Order Food
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Package className="h-10 w-10 text-primary" />}
                        title="Smart Parcel Booking"
                        desc="Book your railway parcels online. Get instant quotes and digital receipts without the queues."
                    />
                    <FeatureCard
                        icon={<Utensils className="h-10 w-10 text-secondary" />}
                        title="Station Food Delivery"
                        desc="Craving something? Order from top station vendors and get it delivered to your seat or platform."
                    />
                    <FeatureCard
                        icon={<Clock className="h-10 w-10 text-green-500" />}
                        title="Real-Time Tracking"
                        desc="Track your parcels and food orders live. Know exactly when they will arrive."
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="mb-6 p-3 bg-gray-50 rounded-xl w-fit">{icon}</div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
);

export default Home;
