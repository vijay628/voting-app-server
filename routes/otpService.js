const { MailtrapClient } = require("mailtrap");
const crypto = require('crypto');
require('dotenv').config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Online Voting System",
};

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOtpEmail = (email, otp) => {
  const recipients = [{ email }];

  return client.send({
    from: sender,
    to: recipients,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}, Otp expires in 10 min.`,
    category: "OTP Verification",
  });
};

module.exports = {
  generateOtp,
  sendOtpEmail
};
