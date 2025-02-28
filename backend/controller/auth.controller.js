import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(401).json({
      success: false,
      message: "All fields are Required.",
    });
  }

  const isValidUser = await User.findOne({ email });

  if (isValidUser) {
    return res.status(400).json({
      success: false,
      message: "User already Exist",
    });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
    });
  } catch (error) {
    console.log(`Error in SignUp Controller: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Wrong Credentials",
      });
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      success: true,
      message: "Login Successful!",
      rest,
    });
  } catch (error) {
    console.log(`Error in SignIn Controller: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("access_token");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(`Error in signout Controller: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
