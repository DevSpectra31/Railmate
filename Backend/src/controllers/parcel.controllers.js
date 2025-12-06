import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Parcel } from "../models/Parcel.model.js";
import QRCode from "qrcode";

const createParcel = asyncHandler(async (req, res) => {
    const { order_id, paymentMode, paymentGateway_id, pickupStation, destinationStation, weight, description, receiverDetails, senderDetails } = req.body;

    if (!paymentMode || !pickupStation || !destinationStation || !weight || !receiverDetails?.name || !receiverDetails?.mobile) {
        throw new ApiError(400, "All required fields (including Receiver Name & Mobile) must be provided");
    }

    // Mock Cost Calculation: Base 50 + 10 per kg
    const calculatedAmount = 50 + (Number(weight) * 10);

    // Generate QR Code Data
    const qrData = JSON.stringify({
        order_id,
        pickup: pickupStation,
        drop: destinationStation,
        receiver: receiverDetails.name,
        amount: calculatedAmount
    });

    const qrCodeImage = await QRCode.toDataURL(qrData);

    const parcel = await Parcel.create({
        user_id: req.user?._id,
        order_id,
        amount: calculatedAmount,
        paymentMode,
        paymentGateway_id,
        pickupStation,
        destinationStation,
        weight,
        description,
        receiverDetails,
        senderDetails,
        qrCode: qrCodeImage,
        status: "Success",
        trackingHistory: [{
            status: "Booked",
            location: pickupStation,
            timestamp: new Date()
        }]
    });

    return res.status(201).json(
        new ApiResponse(201, parcel, "Parcel created successfully")
    );
});

const getParcelStatus = asyncHandler(async (req, res) => {
    const { parcelId } = req.params;

    if (!parcelId) {
        throw new ApiError(400, "Parcel ID is required");
    }

    const parcel = await Parcel.findById(parcelId);

    if (!parcel) {
        throw new ApiError(404, "Parcel not found");
    }

    return res.status(200).json(
        new ApiResponse(200, parcel, "Parcel status fetched successfully")
    );
});

const updateParcelStatus = asyncHandler(async (req, res) => {
    const { parcelId } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const parcel = await Parcel.findByIdAndUpdate(
        parcelId,
        {
            $set: { status }
        },
        { new: true }
    );

    if (!parcel) {
        throw new ApiError(404, "Parcel not found");
    }

    return res.status(200).json(
        new ApiResponse(200, parcel, "Parcel status updated successfully")
    );
});

const getUserParcels = asyncHandler(async (req, res) => {
    const parcels = await Parcel.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(
        new ApiResponse(200, parcels, "User parcels fetched successfully")
    );
});

const updateParcelTracking = asyncHandler(async (req, res) => {
    const { parcelId } = req.params;
    const { location, status } = req.body;

    if (!location || !status) {
        throw new ApiError(400, "Location and Status are required");
    }

    const parcel = await Parcel.findByIdAndUpdate(
        parcelId,
        {
            $push: {
                trackingHistory: {
                    status,
                    location,
                    timestamp: new Date()
                }
            },
            $set: { status }
        },
        { new: true }
    );

    if (!parcel) {
        throw new ApiError(404, "Parcel not found");
    }

    return res.status(200).json(
        new ApiResponse(200, parcel, "Parcel tracking updated successfully")
    );
});

export { createParcel, getParcelStatus, updateParcelStatus, getUserParcels, updateParcelTracking };
