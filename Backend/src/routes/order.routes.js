import { Router } from "express";
import { createOrder, getOrderDetails, getVendorOrders, getUserOrders, updateOrderStatus } from "../controllers/order.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createOrder);
router.route("/:orderId").get(verifyJWT, getOrderDetails);
router.route("/vendor/list").get(verifyJWT, getVendorOrders);
router.route("/:orderId/status").patch(verifyJWT, updateOrderStatus);
router.route("/user/list").get(verifyJWT, getUserOrders);

export default router;
