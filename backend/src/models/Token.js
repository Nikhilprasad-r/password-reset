import mongoose from "mongoose";
const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // expires in 1 hour
});

module.exports = mongoose.model("Token", TokenSchema);
