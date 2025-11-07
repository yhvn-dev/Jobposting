import pool from "../../../config/database.js";

export async function emailExists(email) {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows;
  } catch (error) {
    console.error("error selecting from database", error);
  }
}
