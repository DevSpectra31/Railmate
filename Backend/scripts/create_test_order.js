import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/Users.model.js";
import { Product } from "../src/models/Products.model.js";
import { Order } from "../src/models/Order.model.js";
import { Station } from "../src/models/Station.model.js";

dotenv.config({ path: './.env' });

const createTestOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
        console.log("Connected to DB");

        // 1. Find Vendor
        const vendor = await User.findOne({ email: "haldiram@ndls.railmate.com" });
        if (!vendor) throw new Error("Vendor not found. Run seed_data.js first.");

        // 2. Find or Create Customer
        let customer = await User.findOne({ email: "customer@test.com" });
        if (!customer) {
            customer = await User.create({
                username: "testcustomer",
                email: "customer@test.com",
                name: "Test Customer",
                password: "password123", // Will be hashed if model logic runs, but direct create might create issues if hook not triggered? 
                // Model usually has pre-save. create() triggers save().
                mobile: "9988776655",
                role: "Customer",
                verified: true
            });
            console.log("Created Test Customer");
        }

        // 3. Find Product
        const product = await Product.findOne({ vendorId: vendor._id });
        if (!product) throw new Error("No products found for vendor.");

        // 4. Create Order
        const order = await Order.create({
            userId: customer._id,
            vendorId: vendor._id,
            stationId: product.stationId,
            items: [{
                product: product._id,
                quantity: 2,
                price: product.price
            }],
            totalAmount: product.price * 2,
            status: "Pending",
            deliveryDetails: { trainNumber: "12345", coachNumber: "S1", seatNumber: "45" }
        });

        console.log(`✅ Created Order: ${order._id}`);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

createTestOrder();
