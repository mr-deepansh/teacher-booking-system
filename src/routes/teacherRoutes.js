import { protect } from "../middleware/auth.middleware.js";
import { Router } from "express";
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
} from "../controllers/teacherController.js";

const router = Router();

router.post("/register", registerTeacher);
router.post("/login", loginTeacher);
router.post("/logout", logoutTeacher);
router.get("/profile", protect, getCurrentTeacher);
router.put("/profile", protect, updateTeacherDetails);
router.put("/password", protect, updateTeacherPassword);
router.delete("/profile", protect, deleteTeacher);

export default router;
