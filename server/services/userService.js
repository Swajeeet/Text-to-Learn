const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { getJwtSecret, getJwtExpiresIn } = require("../config/auth");

/**
 * Generate a signed JWT for a given user ID.
 */
const signToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  });
};

/**
 * Register a new user.
 * Throws ApiError on duplicate email or validation failure.
 */
const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  // Password is hashed by the pre-save hook in User.js
  const user = await User.create({ name, email, password });

  const token = signToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

/**
 * Login an existing user.
 * Throws ApiError on invalid credentials.
 */
const login = async ({ email, password }) => {
  // Must explicitly select password (select: false in schema)
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = signToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

/**
 * Get user profile by ID (password excluded).
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

/**
 * Update user profile.
 */
const updateProfile = async (userId, updateData) => {
  // Prevent password update through this path
  delete updateData.password;
  delete updateData.role;

  const user = await User.findByIdAndUpdate(userId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

/**
 * Get all users (admin only).
 */
const getAllUsers = async () => {
  return await User.find().select("-password");
};

module.exports = {
  register,
  login,
  getUserById,
  updateProfile,
  getAllUsers,
};
