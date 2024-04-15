const express = require("express");
const router = express.Router();
const {
  signIn,
  signUp,
  resetPassword,
  resetPasswordForm,
  submitNewPassword,
} = require("../controllers/authController");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/reset-password", resetPassword);
router.get("/reset/:token", resetPasswordForm);
router.post("/reset/:token", submitNewPassword);

module.exports = router;
