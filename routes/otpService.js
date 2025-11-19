const nodemailer = require("nodemailer");
require("dotenv").config();
const crypto = require('crypto');

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password ONLY
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });

    const mailOptions = {
      from: `"Online Voting System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}, OTP expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 OTP sent successfully to:", email);

  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = {
  generateOtp,
  sendOtpEmail
};
