import express from "express";
import {
  registerStudent,
  updateStudent,
  deleteStudent,
  bookAppointment,
  viewAppointments,
} from "../controllers/student.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to register a new student
router.post("/register", registerStudent);

// Routes that require authentication (protected routes)
// router.use(protect);

// Route to update student information
router.put("/:id", updateStudent);

// Route to delete a student
router.delete("/:id", deleteStudent);

// Route to book an appointment with a teacher
router.post("/book-appointment", bookAppointment);

// Route to view all appointments of a student
router.get("/appointments", viewAppointments);

export default router;
