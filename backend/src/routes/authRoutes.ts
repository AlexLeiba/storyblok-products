import { Router } from "express";
import {
  signIn,
  signUp,
  logOut,
  sendOTPforgotPassword,
  verifyOTPforgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/authControllers";
import { requireAuth } from "../middleware/authMiddleware";

// route definitions
// Here we keep route definitions/ route listeners
const router = Router();

router.post("/signup", signUp); //the business logic is extracted in controllers

router.post("/signin", signIn);

router.post("/logout", logOut);

router.post("/forgot-password", sendOTPforgotPassword);
router.post("/verify-otp", verifyOTPforgotPassword);
router.post("/reset-password", resetPassword);
router.get("/refresh-token", refreshToken);

export default router;
