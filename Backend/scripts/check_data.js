import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../src/models/Products.model.js";
import { Station } from "../src/models/Station.model.js";
import { User } from "../src/models/Users.model.js";

dotenv.config({ path: "./.env" });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Railmate", { dbName: "Railmate" });

        const u = await User.countDocuments();
        const s = await Station.countDocuments();
        const p = await Product.countDocuments();

        console.log(`\n\nCOUNTS:\nUsers: ${u}\nStations: ${s}\nProducts: ${p}\n\n`);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

check();
