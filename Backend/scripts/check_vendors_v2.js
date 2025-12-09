import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/Users.model.js";
import { Product } from "../src/models/Products.model.js";

dotenv.config({ path: "./.env" });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: "Railmate" });
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Failed", error);
        process.exit(1);
    }
};

const checkVendors = async () => {
    await connectDB();

    console.log("Checking for Vendors...");
    const vendors = await User.find({ role: "Vendor" });

    if (vendors.length === 0) {
        console.log("No vendors found.");
    } else {
        console.log(`Found ${vendors.length} vendors:`);
        for (const v of vendors) {
            const productCount = await Product.countDocuments({ vendorId: v._id });
            console.log(`- Name: ${v.name}, Email: ${v.email}, Products: ${productCount}, ID: ${v._id}`);
        }
    }
    process.exit(0);
};

checkVendors();
