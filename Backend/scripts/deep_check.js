import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../src/models/Products.model.js";
import { Station } from "../src/models/Station.model.js";

dotenv.config({ path: "./.env" });

const deepCheck = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Railmate", { dbName: "Railmate" });

        // 1. Pick a station
        const station = await Station.findOne({ code: "SC" });
        console.log(`Station SC: ${station._id}`);

        // 2. Find products with that ID string
        const p1 = await Product.find({ stationId: station._id });
        console.log(`Query by Object: Found ${p1.length}`);

        // 3. Find products with that ID string (Explicit string)
        const p2 = await Product.find({ stationId: station._id.toString() });
        console.log(`Query by String: Found ${p2.length}`);

        if (p1.length > 0) {
            console.log("Sample:", p1[0].name);
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

deepCheck();
