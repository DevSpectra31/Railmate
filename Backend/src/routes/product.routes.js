import { Router } from "express";
import { addProduct, getProductsByStation, getVendorProducts } from "../controllers/product.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT, addProduct);
router.route("/station/:stationId").get(getProductsByStation);
router.route("/vendor").get(verifyJWT, getVendorProducts); // Public access to view products

export default router;
