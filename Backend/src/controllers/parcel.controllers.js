import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Parcel } from "../models/Parcel.model.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from 'crypto';

const createParcel = asyncHandler(async (req, res) => {
    const { pickupStation, destinationStation, weight, description, amount, paymentMode, receiverDetails, senderDetails } = req.body;

    // Simulate Payment Gateway ID
    const paymentGateway_id = "PAY_" + crypto.randomBytes(4).toString("hex").toUpperCase();
    const order_id = "ORD_" + crypto.randomBytes(4).toString("hex").toUpperCase();

    console.log("Creating Parcel for User:", req.user?._id);

    const parcel = await Parcel.create({
        user_id: req.user?._id, // Optional if guest booking allowed, but logic implies logged in
        pickupStation,
        destinationStation,
        weight,
        description,
        amount,
        paymentMode,
        paymentGateway_id,
        order_id, // Unique ID for tracking
        receiverDetails,
        senderDetails,
        status: "Pending",
        trackingHistory: [
            {
                status: "Booking Created",
                location: pickupStation,
                timestamp: new Date()
            }
        ]
    });
    console.log("Parcel Created:", parcel);

    return res.status(201).json(new ApiResponse(201, parcel, "Parcel created successfully"));
});

const getParcelStatus = asyncHandler(async (req, res) => {
    const { parcelId } = req.params;
    // Search by _id or order_id
    const parcel = await Parcel.findOne({
        $or: [{ _id: parcelId.match(/^[0-9a-fA-F]{24}$/) ? parcelId : null }, { order_id: parcelId }]
    });

    if (!parcel) {
        throw new ApiError(404, "Parcel not found");
    }

    return res.status(200).json(new ApiResponse(200, parcel, "Parcel status fetched successfully"));
});

const updateParcelStatus = asyncHandler(async (req, res) => {
    const { parcelId } = req.params;
    const { status, location } = req.body;

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new ApiError(404, "Parcel not found");
    }

    parcel.status = status;
    parcel.trackingHistory.push({
        status: status,
        location: location || "In Transit",
        timestamp: new Date()
    });

    await parcel.save();

    return res.status(200).json(new ApiResponse(200, parcel, "Parcel status updated successfully"));
});

const getUserParcels = asyncHandler(async (req, res) => {
    const parcels = await Parcel.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, parcels, "User parcels fetched successfully"));
});

const updateParcelTracking = asyncHandler(async (req, res) => {
    // Reusing update logic or separating if detailed tracking needed
    // For now, same as updateParcelStatus
    return updateParcelStatus(req, res);
});

export {
    createParcel,
    getParcelStatus,
    updateParcelStatus,
    getUserParcels,
    updateParcelTracking
};
