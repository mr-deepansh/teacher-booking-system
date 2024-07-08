import { Router } from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartmentById,
  deleteDepartmentById,
} from "../controllers/department.controller.js";

const router = Router();

// POST /api/departments
router.post("/departments", createDepartment);

// GET /api/departments
router.get("/departments", getAllDepartments);

// GET /api/departments/:id
router.get("/departments/:id", getDepartmentById);

// PUT /api/departments/:id
router.put("/departments/:id", updateDepartmentById);

// DELETE /api/departments/:id
router.delete("/departments/:id", deleteDepartmentById);

export default router;
