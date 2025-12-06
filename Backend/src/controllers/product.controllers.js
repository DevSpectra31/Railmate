import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/Products.model.js";

const addProduct = asyncHandler(async (req, res) => {
    const { name, price, description, category, stationId, image } = req.body;

    if (!name || !price || !stationId) {
        throw new ApiError(400, "Name, price and station are required");
    }

    const product = await Product.create({
        vendorId: req.user?._id, // Assuming vendor is the logged-in user
        name,
        price,
        description,
        category,
        stationId,
        image // Assuming image URL is passed or handled elsewhere
    });

    return res.status(201).json(
        new ApiResponse(201, product, "Product added successfully")
    );
});

const getProductsByStation = asyncHandler(async (req, res) => {
    const { stationId } = req.params;

    if (!stationId) {
        throw new ApiError(400, "Station ID is required");
    }

    const products = await Product.find({ stationId });

    return res.status(200).json(
        new ApiResponse(200, products, "Products fetched successfully")
    );
});

const getVendorProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ vendorId: req.user._id });
    return res.status(200).json(
        new ApiResponse(200, products, "Vendor products fetched successfully")
    );
});

export { addProduct, getProductsByStation, getVendorProducts };
