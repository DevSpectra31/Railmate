import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../src/models/Products.model.js";
import { Station } from "../src/models/Station.model.js";

dotenv.config({ path: "./.env" });

const debugSC = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Railmate", { dbName: "Railmate" });

        const station = await Station.findOne({ code: "SC" });
        console.log(`Station SC ID: ${station ? station._id : 'NOT FOUND'}`);

        if (station) {
            const count = await Product.countDocuments({ stationId: station._id });
            console.log(`Products for SC in DB: ${count}`);

            // Check if ANY products exist
            const total = await Product.countDocuments();
            console.log(`Total products in DB: ${total}`);
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

debugSC();
