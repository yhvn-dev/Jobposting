import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";
import redis from "../config/redis.js";
import {
  createUser,
  findUserByEmail,
  comparePassword,
  findUserById,
  updatePassword,
} from "../models/User.js";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validation.js";
import {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendVerificationCode,
} from "../utils/emailService.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// 🧠 reCAPTCHA verification
const verifyRecaptcha = async (token) => {
  try {
    const res = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );
    return res.data.success;
  } catch (err) {
    console.error("reCAPTCHA error:", err);
    return false;
  }
};

// Helper: Safe Redis JSON parsing
const safeParse = (data) => {
  if (!data) return null;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      console.error("❌ Redis data not valid JSON:", data);
      return null;
    }
  }
  if (typeof data === "object") return data;
  return null;
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password, recaptchaToken } = req.body;

    if (!(await verifyRecaptcha(recaptchaToken)))
      return res.status(400).json({ message: "reCAPTCHA failed" });

    if (!validateName(name))
      return res.status(400).json({ message: "Invalid name" });

    if (!validateEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!validatePassword(password))
      return res.status(400).json({ message: "Weak password" });

    const exist = await findUserByEmail(email);
    if (exist) return res.status(400).json({ message: "Email already used" });

    const userId = await createUser(name, email, password);
    await sendWelcomeEmail(email, name).catch(() => {});

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      message: "Signup success",
      token,
      user: { id: userId, name, email },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN — generate OTP + temporary Redis session
export const login = async (req, res) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    if (!(await verifyRecaptcha(recaptchaToken)))
      return res.status(400).json({ message: "reCAPTCHA failed" });

    if (!validateEmail(email) || !password)
      return res.status(400).json({ message: "Invalid input" });

    const user = await findUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });

    const loginToken = crypto.randomBytes(24).toString("hex");
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Always store as JSON string
    const payload = { userId: user.id, code };
    await redis.set(`login:${loginToken}`, JSON.stringify(payload), {
      ex: 600,
    });

    await sendVerificationCode(email, code).catch((err) => {
      console.error("Failed to send verification code:", err);
    });

    res.json({
      message: "Verification code sent to your email",
      verificationRequired: true,
      loginToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY EMAIL (OTP)
export const verifyEmail = async (req, res) => {
  try {
    const { loginToken, code } = req.body;
    if (!loginToken || !code)
      return res.status(400).json({ message: "Missing data" });

    const data = await redis.get(`login:${loginToken}`);
    const parsed = safeParse(data);
    if (!parsed)
      return res
        .status(400)
        .json({ message: "Invalid or expired login token" });

    if (parsed.code !== String(code))
      return res.status(400).json({ message: "Invalid verification code" });

    await redis.del(`login:${loginToken}`);

    const user = await findUserById(parsed.userId);
    if (!user) return res.status(401).json({ message: "Invalid user" });

    const token = jwt.sign({ userId: parsed.userId }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login success",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("🔥 Verify email error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// RESEND VERIFICATION CODE
export const resendVerification = async (req, res) => {
  try {
    const { loginToken } = req.body;
    if (!loginToken) return res.status(400).json({ message: "Missing token" });

    const data = await redis.get(`login:${loginToken}`);
    const parsed = safeParse(data);
    if (!parsed)
      return res
        .status(400)
        .json({ message: "Invalid or expired login token" });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newPayload = { userId: parsed.userId, code: newCode };

    await redis.set(`login:${loginToken}`, JSON.stringify(newPayload), {
      ex: 600,
    });

    const user = await findUserById(parsed.userId);
    if (!user) return res.status(400).json({ message: "Invalid user" });

    await sendVerificationCode(user.email, newCode).catch((err) => {
      console.error("Resend code failed:", err);
    });

    res.json({ message: "Verification code resent" });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    const user = await findUserByEmail(email);
    if (!user) return res.json({ message: "If email exists, reset link sent" });

    const token = crypto.randomBytes(32).toString("hex");
    await redis.set(`reset:${token}`, user.id, { ex: 3600 });
    await sendPasswordResetEmail(email, token);

    res.json({ message: "If email exists, reset link sent" });
  } catch (err) {
    console.error("Forgot error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Missing data" });

    if (!validatePassword(newPassword))
      return res.status(400).json({ message: "Weak password" });

    const userId = await redis.get(`reset:${token}`);
    if (!userId)
      return res.status(400).json({ message: "Invalid or expired token" });

    await updatePassword(userId, newPassword);
    await redis.del(`reset:${token}`);

    res.json({ message: "Password reset success" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.userId);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    res.json({ user });
  } catch (err) {
    console.error("Token error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
