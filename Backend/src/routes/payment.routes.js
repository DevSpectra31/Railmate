import { Router } from "express";
import { generatePaymentQR, verifyPayment } from "../controllers/payment.controllers.js";

const router = Router();

router.route("/generate-qr").post(generatePaymentQR);
router.route("/verify").post(verifyPayment);

export default router;
