import { Feedback } from "../models/feedback.model.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";

// @desc    Create a new feedback
// @route   POST /api/feedbacks
// @access  Public
const createFeedback = asyncHandler(async (req, res) => {
  const { appointment, student, teacher, rating, comments } = req.body;

  const newFeedback = await Feedback.create({
    appointment,
    student,
    teacher,
    rating,
    comments,
  });

  const apiResponse = new ApiResponse(
    201,
    newFeedback,
    "Feedback created successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Get all feedbacks
// @route   GET /api/feedbacks
// @access  Public
const getAllFeedbacks = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find();
  const apiResponse = new ApiResponse(
    200,
    feedbacks,
    "All feedbacks fetched successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Get single feedback by ID
// @route   GET /api/feedbacks/:id
// @access  Public
const getFeedbackById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const feedback = await Feedback.findById(id);

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  const apiResponse = new ApiResponse(
    200,
    feedback,
    "Feedback fetched successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Update feedback by ID
// @route   PUT /api/feedbacks/:id
// @access  Public
const updateFeedbackById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comments } = req.body;

  const feedback = await Feedback.findByIdAndUpdate(
    id,
    { rating, comments },
    { new: true } // Return the updated document
  );

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  const apiResponse = new ApiResponse(
    200,
    feedback,
    "Feedback updated successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Delete feedback by ID
// @route   DELETE /api/feedbacks/:id
// @access  Public
const deleteFeedbackById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const feedback = await Feedback.findByIdAndDelete(id);

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  const apiResponse = new ApiResponse(
    204,
    null,
    "Feedback deleted successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

export {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
};
