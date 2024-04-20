const User = require("../models/User");
const Token = require("../models/Token");
const argon2 = require("argon2");
const { sendResetEmail } = require("../utils/mailer");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  const { name, email, mobileNumber, dob, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await argon2.hash(password);

    user = new User({
      name,
      email,
      mobileNumber,
      dob,
      password: hashedPassword,
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
    const user = await User.findOne({ email: email });
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
      `https://resetformnikhil.netlify.app/reset/${token.token}`
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
    user.password = await argon2.hash(password);
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
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await argon2.verify(user.password, password);
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
