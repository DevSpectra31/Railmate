import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/Users.model.js";

dotenv.config({ path: "./.env" });

const findUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Railmate", { dbName: "Railmate" });

        console.log("--- RESULTS ---");
        const searchName = "Vineet_72";
        // Find anything that looks like Vineet_72
        const users = await User.find({
            username: { $regex: new RegExp(`^${searchName}$`, 'i') }
        });

        if (users.length === 0) {
            console.log("No user found with that name (case insensitive).");
        } else {
            users.forEach(u => {
                console.log(`Username in DB: '${u.username}'`);
                console.log(`Email in DB: '${u.email}'`);
                console.log(`Password Hash: ${u.password.substring(0, 10)}...`);
            });
        }
        console.log("---------------");

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

findUser();
