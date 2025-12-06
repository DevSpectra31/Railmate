import mongoose, { Schema } from "mongoose";

const ParcelSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        order_id: {
            type: String,
            required: true,
        },
        pickupStation: {
            type: String,
            required: true
        },
        destinationStation: {
            type: String,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        amount: {
            type: Number,
            required: true,
            index: true,
        },
        paymentMode: {
            type: String,
            enum: ["Cash", "Online"],
            required: true,
        },
        paymentGateway_id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Success', 'Failed', 'Pending'],
            default: 'Pending',
            required: true,
        },
        receiverDetails: {
            name: { type: String, required: true },
            mobile: { type: String, required: true },
            address: { type: String } // Optional
        },
        senderDetails: {
            name: { type: String },
            mobile: { type: String },
            address: { type: String }
        },
        trackingHistory: [
            {
                status: { type: String },
                location: { type: String },
                timestamp: { type: Date, default: Date.now }
            }
        ],
        qrCode: {
            type: String // Base64 Data URL
        }
    },
    { timestamps: true },
)

export const Parcel = mongoose.model("Parcel", ParcelSchema);