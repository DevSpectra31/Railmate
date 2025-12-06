import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: { // Price per unit at time of order
        type: Number,
        required: true
    }
});

const Orderschema = new Schema(
    {
        vendorId: {
            type: Schema.Types.ObjectId,
            ref: "User", // Role: Vendor
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", // Role: Customer
            required: true
        },
        stationId: {
            type: Schema.Types.ObjectId,
            ref: "Station",
            required: true
        },
        items: [OrderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
            default: "Pending"
        },
        deliveryDetails: {
            trainNumber: String,
            coachNumber: String,
            seatNumber: String
        }
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", Orderschema);