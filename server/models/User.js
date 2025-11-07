import db from "../config/database.js";
import bcrypt from "bcrypt";

export const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())";
  const [result] = await db.execute(query, [name, email, hashedPassword]);

  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = ?";
  const [rows] = await db.execute(query, [email]);

  return rows[0] || null;
};

export const findUserById = async (id) => {
  const query = "SELECT id, name, email, created_at FROM users WHERE id = ?";
  const [rows] = await db.execute(query, [id]);

  return rows[0] || null;
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const query = "UPDATE users SET password = ? WHERE id = ?";
  await db.execute(query, [hashedPassword, userId]);
};
