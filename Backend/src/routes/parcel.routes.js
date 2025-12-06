import { Router } from "express";
import { createParcel, getParcelStatus, updateParcelStatus, getUserParcels, updateParcelTracking } from "../controllers/parcel.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Assuming auth middleware exists

const router = Router();

router.route("/create").post(verifyJWT, createParcel);
router.route("/status/:parcelId").get(getParcelStatus); // Made public
router.route("/user").get(verifyJWT, getUserParcels);
router.route("/update/:parcelId").patch(verifyJWT, updateParcelStatus);
router.route("/track/:parcelId").patch(verifyJWT, updateParcelTracking); // New endpoint for detailed tracking updates

export default router;
