import { Router } from "express";
import {
  createNotification,
  getAllNotifications,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotificationById,
} from "../controllers/notification.controller.js";

const router = Router();

// POST /api/notifications
router.post("/notifications", createNotification);

// GET /api/notifications
router.get("/notifications", getAllNotifications);

// GET /api/notifications/:userId
router.get("/notifications/:userId", getNotificationsByUser);

// PUT /api/notifications/:id/read
router.put("/notifications/:id/read", markNotificationAsRead);

// DELETE /api/notifications/:id
router.delete("/notifications/:id", deleteNotificationById);

export default router;
