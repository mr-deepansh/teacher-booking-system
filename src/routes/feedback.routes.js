import { Router } from "express";
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
} from "../controllers/feedback.controller.js";

const router = Router();

// POST /api/feedbacks
router.post("/feedbacks", createFeedback);

// GET /api/feedbacks
router.get("/feedbacks", getAllFeedbacks);

// GET /api/feedbacks/:id
router.get("/feedbacks/:id", getFeedbackById);

// PUT /api/feedbacks/:id
router.put("/feedbacks/:id", updateFeedbackById);

// DELETE /api/feedbacks/:id
router.delete("/feedbacks/:id", deleteFeedbackById);

export default router;
