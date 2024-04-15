const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcryptjs");
const { sendResetEmail } = require("../utils/mailer");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  const { name, email, mobileNumber, dob, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      mobileNumber,
      dob,
      password: bcrypt.hashSync(password, 10),
    });

    await user.save();
    res.status(201).send("User registered");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = new Token({
      userId: user._id,
      token: require("crypto").randomBytes(32).toString("hex"),
    });

    await token.save();

    await sendResetEmail(
      user.email,
      `http://localhost:${process.env.PORT}/reset/${token.token}`
    );
    res.status(200).send("Reset password link sent");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.resetPasswordForm = async (req, res) => {
  const { token } = req.params;
  try {
    const passwordResetToken = await Token.findOne({ token });
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

exports.submitNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const passwordResetToken = await Token.findOne({ token });
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
exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
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
