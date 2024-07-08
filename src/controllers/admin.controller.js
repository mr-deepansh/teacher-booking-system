import { Student } from "../models/student.model.js";
import { Teacher } from "../models/teacher.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { ApiError } from "../utility/ApiError.js";

const addTeacher = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, password, department, subject } = req.body;

    const teacherExists = await Teacher.findOne({ email });

    if (teacherExists) {
      throw new ApiError(400, "Teacher already exists");
    }

    const teacher = await Teacher.create({
      fullName,
      email,
      password,
      department,
      subject,
    });

    res
      .status(201)
      .json(new ApiResponse(201, teacher, "Teacher added successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const updateTeacher = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, department, subject } = req.body;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      throw new ApiError(404, "Teacher not found");
    }

    teacher.fullName = fullName || teacher.fullName;
    teacher.email = email || teacher.email;
    teacher.department = department || teacher.department;
    teacher.subject = subject || teacher.subject;

    await teacher.save();

    res
      .status(200)
      .json(new ApiResponse(200, teacher, "Teacher updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const deleteTeacher = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      throw new ApiError(404, "Teacher not found");
    }

    await teacher.remove();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Teacher deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const approveStudent = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    student.isAdmin = true;

    await student.save();

    res
      .status(200)
      .json(new ApiResponse(200, student, "Student approved successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { addTeacher, updateTeacher, deleteTeacher, approveStudent };
