import express from "express";
import { registeruser } from "../controllers/users.controllers.js";

const router = express.Router();
router.post("/register",registeruser);
export default router;