import express from "express";
import { verifyEmailController } from "../controller/user/auth/verifyEmailController.js";
import { verifyOtpControlller } from "../controller/user/auth/verifyOtpController.js";
const router = express.Router();

router.post("/verifyEmail", verifyEmailController);
router.post("/verifyOtp", verifyOtpControlller);
export default router;
