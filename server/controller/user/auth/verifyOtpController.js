import redis from "../../../config/redis.js";
import { createUserModel } from "../../../models/user/auth/createUserModel.js";

export async function verifyOtpControlller(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        messsage: "all fields are required!",
      });
    }
    const tempData = await redis.get(`tempUser:${email}`);

    if (!tempData) {
      return res.status(400).json({
        success: false,
        message: "user not found!",
      });
    }
    if (tempData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "invalid otp",
      });
    }
    await createUserModel(tempData);
    redis.del(tempData);

    return res.status(201).json({
      success: true,
      message: "sign In successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "server error",
    });
  }
}
