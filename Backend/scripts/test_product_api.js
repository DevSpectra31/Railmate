import mongoose from "mongoose";
import dotenv from "dotenv";
import { Station } from "../src/models/Station.model.js";
import fetch from 'node-fetch';

dotenv.config({ path: "./.env" });

const testApi = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Railmate", { dbName: "Railmate" });

        // 1. Get Station ID for Secunderabad
        const station = await Station.findOne({ code: "SC" });
        if (!station) {
            console.log("❌ Station Secunderabad (SC) not found in DB");
            return;
        }
        console.log(`✅ Found Station: ${station.name}, ID: ${station._id}`);

        // 2. Poll API
        const url = `http://localhost:8000/api/v1/products/station/${station._id}`;
        console.log(`Fetching: ${url}`);

        const response = await fetch(url);
        const data = await response.json();

        console.log("--- API RESPONSE ---");
        console.log(JSON.stringify(data, null, 2));
        console.log("--------------------");

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

testApi();
