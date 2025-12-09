import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAdminStats = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, {}, "Admin stats fetched successfully (Placeholder)"));
});

export {
    getAdminStats
};
