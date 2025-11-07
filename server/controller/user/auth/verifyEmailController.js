import { createUser } from "../../../models/user/auth/createUserModel.js";
import { emailExists } from "../../../models/user/auth/emailExistsModel.js";
import { generateOtp } from "../../../utils/generateOtp.js";
import hashPassword from "../../../utils/hashPassword.js";
import transporter from "../../../utils/nodemailer.js";

export async function verifyEmailController(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      role,
      password,
      confirmPassword,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobileNumber ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "all fields are required!",
      });
    }
    const isEmailExists = await emailExists(email);
    if (isEmailExists > 0) {
      return res.status(400).json({
        success: false,
        message: "email already registered,please try another one!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password doesn't match",
      });
    }

    const otp = generateOtp();
    const hashedPassword = await hashPassword(password);

    const tempData = {
      firstName,
      lastName,
      email,
      mobileNumber,
      role,
      password,
      otp,
      password: hashedPassword,
    };
    await createUser(email, tempData);

    await transporter.sendMail({
      from: '"Job Posting" <bicojayvee4@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Hello", // Subject line
      text: "Hello world?", // plain text body
      html: `hello ${email} this is your otp ${otp}, it will expires in 3 minutes`, // html body
    });

    return res.status(201).json({
      success: true,
      message: "otp has been send to your email, plese check your email!",
      otp: otp,
    });
  } catch (error) {
    console.error("server error , error verifying email", error);
  }
}
