import express from "express";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();
import {
  signIn,
  signUp,
  resetPassword,
  resetPasswordForm,
  submitNewPassword,
} from "../controllers/authController.js";
import { shorten, redirect, userUrls } from "../controllers/urlControllers.js";
router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);
router.post("/auth/reset-password", resetPassword);
router.get("/auth/reset/:token", resetPasswordForm);
router.post("/auth/reset/:token", submitNewPassword);
router.post("/api/shorten", shorten);
router.get("/api/:shortUrl", redirect);
router.get("/api/user-urls", auth, userUrls);

export default router;
