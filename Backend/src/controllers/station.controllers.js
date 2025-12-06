import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Station } from "../models/Station.model.js"; // Assuming Station model exists

const addStation = asyncHandler(async (req, res) => {
    const { name, code, city, state } = req.body;

    if (!name || !code) {
        throw new ApiError(400, "Name and Code are required");
    }

    const station = await Station.create({
        name,
        code,
        city,
        state
    });

    return res.status(201).json(
        new ApiResponse(201, station, "Station added successfully")
    );
});

const getStations = asyncHandler(async (req, res) => {
    const stations = await Station.find();
    return res.status(200).json(
        new ApiResponse(200, stations, "Stations fetched successfully")
    );
});

export { addStation, getStations };
