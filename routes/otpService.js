const nodemailer = require("nodemailer");
require("dotenv").config();
const crypto = require('crypto');

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Online Voting System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}, Otp expires in 10 min.`,
      category: "OTP Verification",
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 OTP sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

module.exports = {
  generateOtp,
  sendOtpEmail
};
