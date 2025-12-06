import { Router } from "express";
import { addStation, getStations } from "../controllers/station.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Assuming only admin can add station, but for now just protected
router.route("/add").post(verifyJWT, addStation);
router.route("/").get(getStations);

export default router;
