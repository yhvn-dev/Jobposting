import express from "express";
import { verifyEmailController } from "../controller/user/auth/verifyEmailController.js";
const router = express.Router();

router.post("/verifyEmail", verifyEmailController);

export default router;
