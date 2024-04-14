const express = require("express");
const router = express.Router();
const {
  signup,
  resetPassword,
  resetPasswordForm,
  submitNewPassword,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/reset-password", resetPassword);
router.get("/reset/:token", resetPasswordForm);
router.post("/reset/:token", submitNewPassword);

module.exports = router;
