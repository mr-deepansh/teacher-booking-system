import { Appointment } from "../models/appointment.model.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";

const createAppointment = asyncHandler(async (req, res) => {
  const { student, teacher, subject, date, time } = req.body;

  try {
    const newAppointment = new Appointment({
      student,
      teacher,
      subject,
      date,
      time,
      status: "pending", // Default status
    });

    const savedAppointment = await newAppointment.save();

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          savedAppointment,
          "Appointment created successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getAppointments = asyncHandler(async (req, res) => {
  try {
    const appointments = await Appointment.find();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          appointments,
          "All appointments retrieved successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    appointment.status = status || appointment.status;

    await appointment.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, appointment, "Appointment updated successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
export { updateAppointmentStatus, createAppointment, getAppointments };
