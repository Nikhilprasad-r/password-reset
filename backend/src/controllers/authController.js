import User from "../models/User.js";
import Token from "../models/Token.js";
import bcrypt from "bcryptjs";
import { sendResetEmail, sendActivationEmail } from "../utils/mailer.js";
import jwt from "jsonwebtoken";
export const signUp = async (req, res) => {
  const { name, email, mobileNumber, dob, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      mobileNumber,
      dob,
      password: bcrypt.hashSync(password, 10),
      isActive: false,
    });

    await user.save();
    const token = new Token({
      userId: user._id,
      token: require("crypto").randomBytes(32).toString("hex"),
      type: "activation", // Specify the type of token for clarity
    });
    await token.save();

    const activationLink = `https://yourfrontenddomain.com/activate/${token.token}`;
    await sendActivationEmail(email, activationLink);

    res.status(201).send("User registered");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const activateAccount = async (req, res) => {
  const { token } = req.params;
  try {
    const activationToken = await Token.findOne({
      token: token,
      type: "activation",
    });
    if (!activationToken) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired activation token" });
    }

    const user = await User.findById(activationToken.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.isActive = true;
    await user.save();

    await Token.findByIdAndRemove(activationToken._id); // Clean up token

    res.send("Account activated successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = new Token({
      userId: user._id,
      token: require("crypto").randomBytes(32).toString("hex"),
    });
    console.log(token.token);
    await token.save();

    await sendResetEmail(
      user.email,
      `https://resetformnikhil.netlify.app/reset/${token.token}`
    );
    res.status(200).send("Reset password link sent");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const resetPasswordForm = async (req, res) => {
  const { token } = req.params;
  try {
    const passwordResetToken = await Token.findOne({ token: token });
    if (!passwordResetToken) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired password reset token" });
    }

    res.send(`<form action="/reset/${token}" method="POST">
                <input type="password" name="password" required />
                <input type="submit" value="Reset Password" />
              </form>`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const submitNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(password);
  try {
    const passwordResetToken = await Token.findOne({ token: token });
    if (!passwordResetToken) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired password reset token" });
    }

    const user = await User.findById(passwordResetToken.userId);
    user.password = bcrypt.hashSync(password, 10);
    await user.save();

    await Token.findByIdAndRemove(passwordResetToken._id);

    res.send("Password has been reset");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
