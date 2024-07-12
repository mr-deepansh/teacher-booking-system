import express from "express";
import {
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
} from "../controllers/teacher.controller.js";
import { protect, teacher } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerTeacher);
router.post("/login", loginTeacher);

// Protected routes
router.use(protect);
router.get("/me", getCurrentTeacher);
router.post("/logout", logoutTeacher);
router.put("/update-details", updateTeacherDetails);
router.put("/update-password", updateTeacherPassword);
router.delete("/delete", deleteTeacher);
router.post("/schedule-appointment", teacher, scheduleAppointment);
router.put("/appointments/approve/:appointmentId", teacher, approveAppointment);
router.put("/appointments/cancel/:appointmentId", teacher, cancelAppointment);
router.get("/appointments", viewAppointments);

export default router;
