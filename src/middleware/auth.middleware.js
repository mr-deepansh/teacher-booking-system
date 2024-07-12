import jwt from "jsonwebtoken";
import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utility/ApiError.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await Teacher.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const responseMessage =
      error instanceof ApiError ? error.message : "Internal Server Error";

    return res.status(statusCode).json({
      success: false,
      error: responseMessage,
    });
  }
});

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

export { protect, admin, teacher };
