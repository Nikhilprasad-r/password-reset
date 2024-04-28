import express from "express";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();
import {
  signIn,
  signUp,
  resetPassword,
  submitNewPassword,
  activateAccount,
} from "../controllers/authController.js";
import {
  shorten,
  redirect,
  userUrls,
  deleteUrl,
} from "../controllers/urlControllers.js";
router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/reset/:token", submitNewPassword);
router.post("/auth/activate/:token", activateAccount);
router.post("/api/shorten", shorten);
router.get("/api/:shortUrl", redirect);
router.get("/api/user-urls", auth, userUrls);
router.delete("/api/delete/:urlId", auth, deleteUrl);
export default router;
