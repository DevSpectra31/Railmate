import { Router } from "express";
import { registeruser } from "../controllers/users.controllers.js";

const router = Router();

// ❌ Don't use upload.single("avatar")
// ✅ Just handle normal form-data
router.post("/register", registeruser);

export default router;
