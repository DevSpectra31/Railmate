import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";

dotenv.config({ path: "./.env" });

console.log("Checking Environment...");
console.log("MONGO_URI Present:", !!process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);
console.log("ACCESS_TOKEN_SECRET Present:", !!process.env.ACCESS_TOKEN_SECRET);

const connectDB = async () => {
    try {
        console.log("Attempting DB Connection...");
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
            dbName: DB_NAME,
            serverSelectionTimeoutMS: 5000
        });
        console.log(`✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
        process.exit(0);
    } catch (error) {
        console.error("❌ MONGODB connection FAILED: ", error.message);
        process.exit(1);
    }
};

connectDB();
