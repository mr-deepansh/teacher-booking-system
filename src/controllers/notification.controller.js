import { Notification } from "../models/notifi.model.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Public
const createNotification = asyncHandler(async (req, res) => {
  const { user, message } = req.body;

  const newNotification = await Notification.create({ user, message });

  const apiResponse = new ApiResponse(
    201,
    newNotification,
    "Notification created successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Public
const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find();
  const apiResponse = new ApiResponse(
    200,
    notifications,
    "All notifications fetched successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Get notifications for a user
// @route   GET /api/notifications/:userId
// @access  Public
const getNotificationsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const notifications = await Notification.find({ user: userId });

  const apiResponse = new ApiResponse(
    200,
    notifications,
    "Notifications fetched successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Public
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true } // Return the updated document
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  const apiResponse = new ApiResponse(
    200,
    notification,
    "Notification marked as read"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Delete notification by ID
// @route   DELETE /api/notifications/:id
// @access  Public
const deleteNotificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findByIdAndDelete(id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  const apiResponse = new ApiResponse(
    204,
    null,
    "Notification deleted successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

export {
  createNotification,
  getAllNotifications,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotificationById,
};
