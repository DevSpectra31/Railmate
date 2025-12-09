import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { X, CheckCircle, Loader2 } from 'lucide-react';

const PaymentModal = ({ amount, onClose, onSuccess }) => {
    const [qrCode, setQrCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const fetchQR = async () => {
            try {
                const response = await apiClient.post('/payment/generate-qr', { amount });
                setQrCode(response.data.data.qrCode);
            } catch (error) {
                console.error("Failed to generate QR", error);
                alert("Failed to load payment QR");
                onClose();
            } finally {
                setLoading(false);
            }
        };
        fetchQR();
    }, [amount, onClose]);

    const handleConfirmPayment = async () => {
        setVerifying(true);
        try {
            // Mock verification call
            await apiClient.post('/payment/verify');
            // Simulate delay for realism
            setTimeout(() => {
                onSuccess();
            }, 1000);
        } catch (error) {
            alert("Payment verification failed");
            setVerifying(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                </button>

                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Scan to Pay</h3>
                    <p className="text-gray-500 mb-6">Total Amount: <span className="font-bold text-gray-900">₹{amount}</span></p>

                    <div className="bg-gray-50 p-4 rounded-xl mb-6 flex items-center justify-center min-h-[250px]">
                        {loading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        ) : (
                            <img src={qrCode} alt="Payment QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                        )}
                    </div>

                    <p className="text-xs text-center text-gray-400 mb-6">Supported Apps: GPay, PhonePe, Paytm</p>

                    <button
                        onClick={handleConfirmPayment}
                        disabled={loading || verifying}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {verifying ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-5 w-5" /> I Have Paid
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
