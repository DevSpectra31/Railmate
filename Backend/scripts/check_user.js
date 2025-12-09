import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/Users.model.js";

dotenv.config({ path: './.env' });

const checkUsers = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        console.log("Connecting to:", uri.split('@')[1]); // Log part of URI to verify host
        await mongoose.connect(uri);
        console.log("Connected to DB");

        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));

        const vendor = await User.findOne({ email: "haldiram@ndls.railmate.com" });
        if (vendor) {
            console.log("✅ Vendor 'haldiram@ndls.railmate.com' FOUND.");
            console.log("ID:", vendor._id);
        } else {
            console.log("❌ Vendor 'haldiram@ndls.railmate.com' NOT FOUND.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkUsers();
