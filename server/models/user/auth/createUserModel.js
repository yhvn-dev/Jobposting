import pool from "../../../config/database.js";

export async function createUserModel(userData) {
  const { firstName,lastName,email,mobileNumber,role,password,} = userData
  try {
    const [rows] = await pool.query(
      "INSERT INTO users (firstName,lastName,email,mobileNumber,role,password) VALUES (?,?,?,?,?,?)",
      [firstName, lastName, email, mobileNumber, role, password]
    );
    return rows;
  } catch (error) {
    console.error("error inserting from database, creating user", error);
    throw error;
  }
}
