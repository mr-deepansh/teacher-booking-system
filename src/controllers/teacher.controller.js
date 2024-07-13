import { Teacher } from "../models/teacher.model.js";
import { Student } from "../models/student.model.js";
import { Appointment } from "../models/appointment.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { ApiError } from "../utility/ApiError.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateAccessAndRefreshToken = async (teacherId) => {
  try {
    const user = await Teacher.findById(teacherId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token "
    );
  }
};

// Register a new teacher
const registerTeacher = asyncHandler(async (req, res) => {
  const { name, username, department, subject, email, password, phone } =
    req.body;

  if (
    [name, username, department, subject, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedTeacher = await Teacher.findOne({
    $or: [{ username }, { email }],
  });
  if (existedTeacher) {
    throw new ApiError(409, "Username or email already exists");
  }

  const teacher = await Teacher.create({
    name,
    username: username.toLowerCase(),
    department,
    phone,
    subject,
    email,
    password,
    role: "teacher",
  });

  const registerTeacher = await Teacher.findById(teacher._id).select(
    "-password -refreshToken"
  );
  if (!registerTeacher) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }
  // console.log(teacher);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        registerTeacher,
        "Teacher registered successfully",
        true
      )
    );
});

// Login a teacher
const loginTeacher = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      throw new ApiError(404, "Teacher not found");
    }
    const isPassValid = await teacher.isPasswordCorrect(password);
    if (!isPassValid) {
      throw new ApiError(400, "Incorrect Password");
    }
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
      teacher._id
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options);
    res.json(
      new ApiResponse(
        200,
        { teacher, accessToken, refreshToken },
        "Teacher Login successful",
        true
      )
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message, false));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Internal Server Error", false));
    }
  }
});

// Logout a teacher
const logoutTeacher = asyncHandler(async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.teacher?._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
    console.log(updatedTeacher);
    if (!updatedTeacher) {
      throw new ApiError(404, "Teacher not found");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Logout successful", true));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message, false));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Internal Server Error", false));
    }
  }
});

// Get current teacher
const getCurrentTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.user._id).select("-password");

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, teacher, "Teacher fetched successfully", true));
});

// Update teacher details
const updateTeacherDetails = asyncHandler(async (req, res) => {
  const { name, department, subject, email } = req.body;

  if (!name || !department || !subject || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const teacher = await Teacher.findByIdAndUpdate(
    req.teacher?._id,
    {
      $set: {
        name,
        department,
        subject,
        email,
      },
    },
    { new: true }
  ).select("-password");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        teacher,
        "Teacher details updated successfully",
        true
      )
    );
});

// Update password
const updateTeacherPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const teacher = await Teacher.findById(req.teacher?._id);

  if (!teacher || !(await teacher.isPasswordCorrect(oldPassword))) {
    throw new ApiError(401, "Invalid old password");
  }

  teacher.password = newPassword;
  await teacher.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully", true));
});

// Delete teacher account
const deleteTeacher = asyncHandler(async (req, res) => {
  await Teacher.findByIdAndDelete(req.user._id);

  res
    .status(200)
    .json(
      new ApiResponse(200, null, "Teacher account deleted successfully", true)
    );
});

const scheduleAppointment = asyncHandler(async (req, res) => {
  try {
    const { studentId, date, time, purpose } = req.body;
    const teacherId = req.user._id;

    if (!studentId || !date || !time || !purpose) {
      throw new ApiError(400, "All fields are required");
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    const appointment = new Appointment({
      teacher: teacherId,
      student: studentId,
      date,
      time,
      purpose,
      status: "pending",
    });

    await appointment.save();

    res
      .status(201)
      .json(
        new ApiResponse(201, appointment, "Appointment scheduled successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const approveAppointment = asyncHandler(async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    if (appointment.teacher.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You are not authorized to approve this appointment"
      );
    }

    appointment.status = "approved";
    await appointment.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, appointment, "Appointment approved successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const cancelAppointment = asyncHandler(async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    if (appointment.teacher.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You are not authorized to cancel this appointment"
      );
    }

    appointment.status = "canceled";
    await appointment.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, appointment, "Appointment canceled successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const viewAppointments = asyncHandler(async (req, res) => {
  try {
    const teacherId = req.user._id;

    const appointments = await Appointment.find({
      teacher: teacherId,
    }).populate("student", "fullName email");

    res
      .status(200)
      .json(
        new ApiResponse(200, appointments, "Appointments fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  getCurrentTeacher,
  updateTeacherDetails,
  updateTeacherPassword,
  deleteTeacher,
  scheduleAppointment,
  approveAppointment,
  cancelAppointment,
  viewAppointments,
};
