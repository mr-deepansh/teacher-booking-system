import { Department } from "../models/department.model.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";

// @desc    Create a new department
// @route   POST /api/departments
// @access  Public
const createDepartment = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const newDepartment = await Department.create({ name, description });

  const apiResponse = new ApiResponse(
    201,
    newDepartment,
    "Department created successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find();
  const apiResponse = new ApiResponse(
    200,
    departments,
    "All departments fetched successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Get single department by ID
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const department = await Department.findById(id);

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  const apiResponse = new ApiResponse(
    200,
    department,
    "Department fetched successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Update department by ID
// @route   PUT /api/departments/:id
// @access  Public
const updateDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const department = await Department.findByIdAndUpdate(
    id,
    { name, description },
    { new: true } // Return the updated document
  );

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  const apiResponse = new ApiResponse(
    200,
    department,
    "Department updated successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

// @desc    Delete department by ID
// @route   DELETE /api/departments/:id
// @access  Public
const deleteDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const department = await Department.findByIdAndDelete(id);

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  const apiResponse = new ApiResponse(
    204,
    null,
    "Department deleted successfully"
  );
  res.status(apiResponse.statusCode).json(apiResponse);
});

export {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartmentById,
  deleteDepartmentById,
};
