import redis from "../../../config/redis.js";

export async function createTempUser(email, data) {
  await redis.set(`tempUser:${email}`, JSON.stringify(data), { ex: 300 });
}
