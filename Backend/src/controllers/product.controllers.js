import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/Products.model.js";
import { ApiError } from "../utils/ApiError.js";

const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, stationId, image } = req.body;

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stationId,
        image,
        vendorId: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, product, "Product added successfully"));
});

const getProductsByStation = asyncHandler(async (req, res) => {
    const { stationId } = req.params;
    if (!stationId) {
        throw new ApiError(400, "Station ID is required");
    }
    const products = await Product.find({ stationId });
    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});

const getVendorProducts = asyncHandler(async (req, res) => {
    // Assuming verified vendor in req.user from auth middleware
    const products = await Product.find({ vendorId: req.user?._id });
    return res.status(200).json(new ApiResponse(200, products, "Vendor products fetched successfully"));
});

export {
    addProduct,
    getProductsByStation,
    getVendorProducts
};
