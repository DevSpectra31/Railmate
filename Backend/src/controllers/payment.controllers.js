import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import QRCode from "qrcode";

const generatePaymentQR = asyncHandler(async (req, res) => {
    const { amount, upiId = "merchant@railmate" } = req.body;

    if (!amount) {
        return res.status(400).json(new ApiResponse(400, null, "Amount is required"));
    }

    // UPI Intent format: upi://pay?pa=<upi_id>&pn=<name>&am=<amount>&cu=INR
    const upiLink = `upi://pay?pa=${upiId}&pn=Railmate&am=${amount}&cu=INR`;

    try {
        const qrCodeDataURL = await QRCode.toDataURL(upiLink);
        return res.status(200).json(
            new ApiResponse(200, { qrCode: qrCodeDataURL, upiLink }, "QR Code generated successfully")
        );
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to generate QR Code"));
    }
});

const verifyPayment = asyncHandler(async (req, res) => {
    // Mock verification
    return res.status(200).json(
        new ApiResponse(200, { success: true, paymentId: `PAY_${Date.now()}` }, "Payment verified successfully")
    );
});

export {
    generatePaymentQR,
    verifyPayment
};
