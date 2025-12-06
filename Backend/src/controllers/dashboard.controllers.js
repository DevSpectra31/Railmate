import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/Users.model.js";
import { Parcel } from "../models/Parcel.model.js";
import { Station } from "../models/Station.model.js";

const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalParcels = await Parcel.countDocuments();
    const totalStations = await Station.countDocuments();

    return res.status(200).json(
        new ApiResponse(200, { totalUsers, totalParcels, totalStations }, "Admin stats fetched successfully")
    );
});

export { getAdminStats };
