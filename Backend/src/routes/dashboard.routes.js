import { Router } from "express";
import { getAdminStats } from "../controllers/dashboard.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/stats").get(verifyJWT, getAdminStats);

export default router;
