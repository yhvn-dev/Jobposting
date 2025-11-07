// server/utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_APP_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.GOOGLE_APP_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.GOOGLE_APP_USER,
    to: email,
    subject: "Welcome to Our Platform",
    html: `
      <h2>Welcome ${name}!</h2>
      <p>Thank you for signing up. We're excited to have you on board.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationCode = async (email, code) => {
  const mailOptions = {
    from: process.env.GOOGLE_APP_USER,
    to: email,
    subject: "Your Login Verification Code",
    html: `
      <h2>Your Login Verification Code</h2>
      <p>Use this code to complete your login: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
