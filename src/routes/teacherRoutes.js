import { Router } from "express";
import { regTeacher } from "../controllers/teacherController.js";

const router = Router();

router.route("/regTeacher").post(regTeacher);

export default router;
