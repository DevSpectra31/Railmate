import mongoose, { Schema } from "mongoose";

const StationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            index: true
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        }
    },
    { timestamps: true }
);
export const Station = mongoose.model("Station", StationSchema);
