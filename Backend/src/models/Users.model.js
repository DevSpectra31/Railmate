import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const Userschema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            index: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            // unique: true, // Removed: Passwords should not be unique
            // lowercase: true, // Removed: Hashing handles this, and we don't want to alter user input
            trim: true,
        },
        mobile: {
            type: String,
            unique: true,
            required: true,
            index: true,
        },
        role: {
            type: String,
            enum: ["Customer", "Staff", "Vendor", "Admin"],
            required: true,
        },
        verified: {
            type: Boolean,
            required: true,
        }
    },
    { timestamps: true }
);

Userschema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

Userschema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

Userschema.methods.isMobileCorrect = async function (mobile) {
    return await bcrypt.compare(mobile, this.mobile);
};

Userschema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this.id,
            username: this.username,
            name: this.name,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

Userschema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const User = mongoose.model("User", Userschema);