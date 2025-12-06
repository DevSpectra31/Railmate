import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/Order.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const { items, totalAmount, stationId, vendorId, deliveryDetails } = req.body;

    if (!items || items.length === 0 || !totalAmount || !stationId || !vendorId) {
        throw new ApiError(400, "Items, Total Amount, Station, and Vendor are required");
    }

    const order = await Order.create({
        userId: req.user?._id,
        items, // Assumes items have { product, quantity, price }
        totalAmount,
        stationId,
        vendorId,
        deliveryDetails,
        status: "Pending"
    });

    return res.status(201).json(
        new ApiResponse(201, order, "Order created successfully")
    );
});

const getOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    // Populate deeply nested product details
    const order = await Order.findById(orderId)
        .populate({
            path: "items.product",
            model: "Product" // Ensure explicit model ref if needed
        })
        .populate("stationId")
        .populate("vendorId", "name email");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order fetched successfully")
    );
});

const getVendorOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ vendorId: req.user._id })
        .populate("items.product")
        .populate("userId", "name mobile")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, orders, "Vendor orders fetched successfully")
    );
});

const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id })
        .populate("items.product")
        .populate("stationId")
        .populate("vendorId", "name")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, orders, "User orders fetched successfully")
    );
});

export { createOrder, getOrderDetails, getVendorOrders, getUserOrders };
