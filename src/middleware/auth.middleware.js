import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { Teacher } from "../models/teacher.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new ApiError(401, "Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user =
      (await Student.findById(decoded.id).select("-password")) ||
      (await Teacher.findById(decoded.id).select("-password"));

    if (!req.user) {
      throw new ApiError(401, "Not authorized, user not found");
    }

    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized, token failed");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new ApiError(401, "Not authorized as an admin");
  }
};

const teacher = (req, res, next) => {
  if (req.user && req.user.department && req.user.subject) {
    next();
  } else {
    throw new ApiError(401, "Not authorized as a teacher");
  }
};

export { protect, admin, teacher };
