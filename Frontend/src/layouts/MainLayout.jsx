import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-gray-900 text-gray-400 py-8 text-center border-t border-gray-800">
                <p>© 2025 Railmate. Revolutionizing Railway Logistics.</p>
            </footer>
        </div>
    );
};

export default MainLayout;
