import express from "express";
const router = express.Router();
import {
  signIn,
  signUp,
  resetPassword,
  resetPasswordForm,
  submitNewPassword,
} from "../controllers/authController";
import { shorten, redirect } from "../controllers/urlControllers";
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/reset-password", resetPassword);
router.get("/reset/:token", resetPasswordForm);
router.post("/reset/:token", submitNewPassword);
router.post("/shorten", shorten);
router.get("/:shortUrl", redirect);

module.exports = router;
