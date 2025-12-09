import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/Order.model.js";
import { Product } from "../models/Products.model.js";
import { ApiError } from "../utils/ApiError.js";

const createOrder = asyncHandler(async (req, res) => {
    const { stationId, items, deliveryDetails } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0) {
        throw new ApiError(400, "No items in order");
    }

    // Verify items and calculate total
    let totalAmount = 0;
    const orderItems = [];
    let vendorId = null;

    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
            throw new ApiError(404, `Product not found: ${item.productId}`);
        }

        // Ensure all items are from same vendor (Simplification for MVP)
        if (vendorId && vendorId.toString() !== product.vendorId.toString()) {
            throw new ApiError(400, "All items must be from the same vendor");
        }
        vendorId = product.vendorId;

        totalAmount += product.price * item.quantity;
        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price
        });
    }

    const order = await Order.create({
        userId,
        vendorId,
        stationId,
        items: orderItems,
        totalAmount,
        status: "Pending", // Or "Paid" if we simulate payment success immediately
        deliveryDetails
    });

    return res
        .status(201)
        .json(new ApiResponse(201, order, "Order created successfully"));
});

const getOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("items.product").populate("stationId");
    if (!order) {
        throw new ApiError(404, "Order not found");
    }
    return res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

const getVendorOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ vendorId: req.user._id }).populate("items.product").populate("userId", "name mobile");
    return res.status(200).json(new ApiResponse(200, orders, "Vendor orders fetched successfully"));
});

const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).populate("items.product").populate("stationId");
    // Sort by latest
    orders.sort((a, b) => b.createdAt - a.createdAt);
    return res.status(200).json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Verify vendor ownership
    if (order.vendorId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this order");
    }

    order.status = status;
    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order status updated successfully"));
});

export {
    createOrder,
    getOrderDetails,
    getVendorOrders,
    getUserOrders,
    updateOrderStatus
};
