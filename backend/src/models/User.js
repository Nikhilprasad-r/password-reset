import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: false }, // defaulting to false to require activation
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const originalPassword = this.password;
      this.password = await bcrypt.hash(this.password, 10);
      console.log(
        `Password was hashed successfully: from ${originalPassword} to ${this.password}`
      );
    } catch (error) {
      console.error("Error hashing password:", error);
      return next(error);
    }
  }
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log(this.email);
    console.log(
      `Password comparison result for ${candidatePassword}: ${isMatch}`
    );
    return isMatch;
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Password comparison failed");
  }
};

export default mongoose.model("User", UserSchema);
