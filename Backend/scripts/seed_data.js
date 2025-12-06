
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Station } from "../src/models/Station.model.js";
import { Product } from "../src/models/Products.model.js";
import { User } from "../src/models/Users.model.js";
import { Order } from "../src/models/Order.model.js";
import { Parcel } from "../src/models/Parcel.model.js";
import bcrypt from "bcrypt";

dotenv.config({ path: './.env' });

const stationsData = [
    { name: "New Delhi", code: "NDLS", city: "New Delhi", state: "Delhi" },
    { name: "Mumbai Central", code: "MMCT", city: "Mumbai", state: "Maharashtra" },
    { name: "Bangalore City", code: "SBC", city: "Bangalore", state: "Karnataka" },
    { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu" },
    { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal" }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
        console.log("Connected to DB");

        console.log("Cleaning existing data...");
        // await Station.deleteMany({});
        // await Product.deleteMany({});
        // await Order.deleteMany({});
        // await Parcel.deleteMany({});
        // await User.deleteMany({ email: { $regex: /railmate.com$/ } }); // Only delete seed users/vendors

        // Actually, for a clean slate, let's wipe everything except maybe User accounts created by me? 
        // No, let's keep it safe and only delete what we are about to create if possible, OR just wipe all non-User if we want strict relationships.
        // Given I want to fix ObjectId issues, wiping Stations/Products is safe.
        await Station.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        // Parcels might depend on old IDs, but let's leave them or wipe them if they cause issues. 
        // Let's wipe Parcels too to avoid invalid references.
        await Parcel.deleteMany({});

        console.log("Seeding Stations...");
        const createdStations = await Station.insertMany(stationsData);
        console.log(`Created ${createdStations.length} stations`);

        console.log("Seeding Vendors...");
        // Create a vendor for New Delhi
        const vendorPassword = await bcrypt.hash("vendor123", 10);
        const vendors = [
            {
                username: "haldiram_ndls",
                email: "haldiram@ndls.railmate.com",
                name: "Haldirams NDLS",
                password: vendorPassword, // Pre-hashed
                mobile: "9911991199",
                role: "Vendor",
                verified: true
            },
            {
                username: "dominos_mmct",
                email: "dominos@mmct.railmate.com",
                name: "Dominos MMCT",
                password: vendorPassword,
                mobile: "9922992299",
                role: "Vendor",
                verified: true
            }
        ];

        // We can't use insertMany easily with pre-save hooks for password hashing unless we manually hash or save one by one.
        // User model has pre-save hook.
        // Let's loop.
        const createdVendors = [];
        for (const v of vendors) {
            // Check existence
            let vendor = await User.findOne({ email: v.email });
            if (!vendor) {
                vendor = await User.create({ ...v, password: "vendor123" }); // Let hook hash it
                console.log(`Created Vendor: ${v.name}`);
            } else {
                console.log(`Vendor exists: ${v.name}`);
            }
            createdVendors.push(vendor);
        }

        console.log("Seeding Products...");
        const ndlsStation = createdStations.find(s => s.code === "NDLS");
        const mmctStation = createdStations.find(s => s.code === "MMCT");
        const ndlsVendor = createdVendors.find(v => v.email.includes("ndls"));
        const mmctVendor = createdVendors.find(v => v.email.includes("mmct"));

        const productsData = [
            // NDLS Products (Haldirams)
            {
                name: "Veg Thali",
                price: 150,
                description: "Complete meal with Dal, Paneer, Rice, Roti, and Salad.",
                category: "Meals",
                stationId: ndlsStation._id,
                vendorId: ndlsVendor._id,
                image: "https://images.unsplash.com/photo-1546833999-b9f58161460e?w=500&auto=format&fit=crop&q=60"
            },
            {
                name: "Chicken Biryani",
                price: 220,
                description: "Aromatic Basmati rice cooked with tender chicken and spices.",
                category: "Biryani",
                stationId: ndlsStation._id,
                vendorId: ndlsVendor._id,
                image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60"
            },
            {
                name: "Masala Dosa",
                price: 90,
                description: "Crispy rice crepe filled with spiced potato mix. Served with chutney.",
                category: "South Indian",
                stationId: ndlsStation._id,
                vendorId: ndlsVendor._id,
                image: "https://images.unsplash.com/photo-1668236543090-d2f896953f0c?w=500&auto=format&fit=crop&q=60"
            },
            {
                name: "Paneer Butter Masala",
                price: 180,
                description: "Cottage cheese cubes in a rich, creamy tomato gravy.",
                category: "Curry",
                stationId: ndlsStation._id,
                vendorId: ndlsVendor._id,
                image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60"
            },
            {
                name: "Mineral Water",
                price: 20,
                description: "Chilled 1L Mineral Water bottle.",
                category: "Drinks",
                stationId: ndlsStation._id,
                vendorId: ndlsVendor._id,
                image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&auto=format&fit=crop&q=60"
            },
            // MMCT Products (Dominos)
            {
                name: "Farmhouse Pizza",
                price: 350,
                description: "Delightful combination of onion, capsicum, tomato & grilled mushroom.",
                category: "Italian",
                stationId: mmctStation._id,
                vendorId: mmctVendor._id,
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60"
            },
            {
                name: "Garlic Breadsticks",
                price: 100,
                description: "Baked to perfection. Cheesy dip included.",
                category: "Sides",
                stationId: mmctStation._id,
                vendorId: mmctVendor._id,
                image: "https://images.unsplash.com/photo-1573145456209-2479e0a8118e?w=500&auto=format&fit=crop&q=60"
            },
            {
                name: "Choco Lava Cake",
                price: 99,
                description: "Molten chocolate cake.",
                category: "Dessert",
                stationId: mmctStation._id,
                vendorId: mmctVendor._id,
                image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&auto=format&fit=crop&q=60"
            }
        ];

        await Product.insertMany(productsData);
        console.log(`Created ${productsData.length} products`);

        console.log("✅ Seed Complete!");
        process.exit(0);

    } catch (error) {
        console.error("Seed Error:", error);
        process.exit(1);
    }
}

seedDB();
