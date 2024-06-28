// controllers/teacherController.js
import { User } from "../models/User.js";
import { asyncHandler } from "../utility/AsyncHandler.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { ApiError } from "../utility/ApiError.js";

const regTeacher = asyncHandler(async (req, res) => {
  const { name, username, department, subject, email, password } = req.body;

  if (
    [name, username, department, subject, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  const user = await User.create({
    name,
    username: username.toLowerCase(),
    department,
    subject,
    email,
    password,
    role: "teacher",
  });

  res
    .status(201)
    .json(new ApiResponse(201, user, "Teacher registered successfully", true));
});

const updateTeacher = asyncHandler(async (req, res, next) => {
  const { name, department, subject } = req.body;
  try {
    let teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return next(new ApiError(404, "Teacher not found"));
    }
    if (name) teacher.name = name;
    if (department) teacher.department = department;
    if (subject) teacher.subject = subject;
    await teacher.save();
    res.json(new ApiResponse(true, "Teacher updated successfully"));
  } catch (error) {
    console.error("Error in signup:", error.message);
    if (error instanceof ApiError) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message, false));
    } else {
      res
        .status(500)
        .json(new ApiResponse(500, null, "Internal Server Error", false));
    }
  }
});

const deleteTeacher = asyncHandler(async (req, res, next) => {
  try {
    await Teacher.findByIdAndRemove(req.params.id);
    res.json(new ApiResponse(true, "Teacher deleted successfully"));
  } catch (error) {
    console.error("Error in signup:", error.message);
    if (error instanceof ApiError) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message, false));
    } else {
      res
        .status(500)
        .json(new ApiResponse(500, null, "Internal Server Error", false));
    }
  }
});

const approveStudent = asyncHandler(async (req, res, next) => {
  try {
    let student = await User.findById(req.params.id);
    if (!student) {
      return next(new ApiError(404, "Student not found"));
    }
    student.isApproved = true;
    await student.save();
    res.json(new ApiResponse(true, "Student approved successfully"));
  } catch (error) {
    console.error("Error in signup:", error.message);
    if (error instanceof ApiError) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message, false));
    } else {
      res
        .status(500)
        .json(new ApiResponse(500, null, "Internal Server Error", false));
    }
  }
});

export { regTeacher, updateTeacher, deleteTeacher, approveStudent };
