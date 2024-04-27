import nodemailer from "nodemailer";
import { google } from "googleapis";
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

exports.sendResetEmail = async (email, link) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: "Nikhil <process.env.GMAIL_USER>",
      to: email,
      subject: "Password Reset",
      text: `Click on this link to reset your password: ${link},If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent:", response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
