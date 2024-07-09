import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utility/ApiError.js";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new ApiError(401, "Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user =
      (await Student.findById(decoded.id).select("-password")) ||
      (await Teacher.findById(decoded.id).select("-password"));

    if (!user) {
      throw new ApiError(401, "Not authorized, user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error.message);
    next(new ApiError(401, "Not authorized, token failed"));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new ApiError(401, "Not authorized as an admin"));
  }
};

const teacher = (req, res, next) => {
  if (req.user && req.user.department && req.user.subject) {
    next();
  } else {
    next(new ApiError(401, "Not authorized as a teacher"));
  }
};

export { protect, admin, teacher, generateToken };
