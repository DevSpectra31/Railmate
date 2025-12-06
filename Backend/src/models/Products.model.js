import mongoose, { Schema } from "mongoose";

const Productschema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
        },
        image: {
            type: String,
            // default: placeholder url
        },
        vendorId: {
            type: Schema.Types.ObjectId,
            ref: "User", // Linking to User model (where role='Vendor')
            required: true
        },
        stationId: {
            type: Schema.Types.ObjectId,
            ref: "Station",
            required: true,
            index: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", Productschema);
