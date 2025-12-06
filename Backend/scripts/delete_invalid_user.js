import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/Users.model.js";

dotenv.config({ path: "./.env" });

const fixUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Railmate", { dbName: "Railmate" });

        const username = "Vineet_72";
        const result = await User.deleteOne({ username: username });

        if (result.deletedCount > 0) {
            console.log(`✅ Successfully deleted user '${username}'. Please register again.`);
        } else {
            console.log(`User '${username}' not found.`);
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

fixUser();
