import { json } from "express";
import redis from "../../../config/redis.js";

export async function createUser(email, data) {
  await redis.set(`tempUser:${email}`, JSON.stringify(data), { ex: 300 });
}
