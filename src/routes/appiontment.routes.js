import express from "express";
import { protect, admin } from "../middleware/auth.middleware.js";
import {
  updateAppointmentStatus,
  createAppointment,
  getAppointments,
} from "../controllers/appointment.controller.js";

const router = express.Router();

// Example protected route for creating appointments
router.post("/appointments", protect, createAppointment);

// Example admin-only route for fetching all appointments
router.get("/appointments", protect, admin, getAppointments);

router.patch("/appointments", protect, admin, updateAppointmentStatus);

export default router;
