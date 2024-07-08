import { Student } from "../models/student.model.js";
import { Teacher } from "../models/teacher.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { ApiError } from "../utility/ApiError.js";
import { Appointment } from "../models/appointment.model.js";
import { generateToken } from "../middleware/generateToken.js";

// @desc    Register a new student
// @route   POST /api/v1/students/register
// @access  Public
const registerStudent = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      throw new ApiError(400, "Student already exists");
    }

    const student = await Student.create({
      fullName,
      email,
      password,
    });

    generateToken(res, student._id);

    res
      .status(201)
      .json(new ApiResponse(201, student, "Student registered successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// @desc    Update student information
// @route   PUT /api/v1/students/:id
// @access  Private (Student)
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fullName, email } = req.body;

  try {
    const student = await Student.findById(id);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    student.fullName = fullName || student.fullName;
    student.email = email || student.email;

    await student.save();

    res
      .status(200)
      .json(new ApiResponse(200, student, "Student updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// @desc    Delete a student
// @route   DELETE /api/v1/students/:id
// @access  Private (Admin)
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    await student.remove();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Student deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// @desc    Book an appointment with a teacher
// @route   POST /api/v1/students/book-appointment
// @access  Private (Student)
const bookAppointment = asyncHandler(async (req, res) => {
  const { teacherId, date, time, purpose } = req.body;
  const studentId = req.user._id;

  try {
    if (!teacherId || !date || !time || !purpose) {
      throw new ApiError(400, "All fields are required");
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new ApiError(404, "Teacher not found");
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

    // Add appointment to student's appointments array
    const student = await Student.findById(studentId);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }
    student.appointments.push(appointment);
    await student.save();

    res
      .status(201)
      .json(
        new ApiResponse(201, appointment, "Appointment booked successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// @desc    View all appointments of a student
// @route   GET /api/v1/students/appointments
// @access  Private (Student)
const viewAppointments = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  try {
    const appointments = await Appointment.find({
      student: studentId,
    }).populate("teacher", "fullName email");

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
  registerStudent,
  updateStudent,
  deleteStudent,
  bookAppointment,
  viewAppointments,
};