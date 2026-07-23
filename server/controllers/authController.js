const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const userService = require("../services/userService");

/**
 * POST /api/v1/auth/register
 * Public — Create new account
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await userService.register({ name, email, password });

  res.status(201).json(
    new ApiResponse(201, result, "Account created successfully")
  );
});

/**
 * POST /api/v1/auth/login
 * Public — Login and receive JWT
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await userService.login({ email, password });

  res.status(200).json(
    new ApiResponse(200, result, "Login successful")
  );
});

/**
 * GET /api/v1/auth/profile
 * Private — Get logged-in user profile
 */
const getProfile = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  const user = await userService.getUserById(req.user._id);

  res.status(200).json(
    new ApiResponse(200, { user }, "Profile fetched successfully")
  );
});

/**
 * PUT /api/v1/auth/profile
 * Private — Update logged-in user profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);

  res.status(200).json(
    new ApiResponse(200, { user }, "Profile updated successfully")
  );
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
