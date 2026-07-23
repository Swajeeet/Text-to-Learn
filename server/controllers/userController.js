const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const userService = require("../services/userService");

/**
 * GET /api/v1/users
 * Private (admin only) — List all users
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json(
    new ApiResponse(200, { users, count: users.length }, "Users fetched successfully")
  );
});

/**
 * GET /api/v1/users/:id
 * Private (admin only) — Get user by ID
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, { user }, "User fetched successfully")
  );
});

module.exports = {
  getAllUsers,
  getUserById,
};
