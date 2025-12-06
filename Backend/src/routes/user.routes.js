import { Router } from "express";
import { registeruser, loginUser } from "../controllers/users.controllers.js";

const router = Router();

// ❌ Don't use upload.single("avatar")
// ✅ Just handle normal form-data
router.post("/register", registeruser);
router.route("/login").post(loginUser);

export default router;
