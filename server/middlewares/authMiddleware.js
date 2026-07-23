const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { getJwtSecret } = require("../config/auth");

/**
 * protect — verifies JWT and attaches req.user.
 * Usage: router.get("/profile", protect, controller)
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Accept token from Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authenticated. Please log in.");
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, getJwtSecret());
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token. Please log in again.");
  }

  // Attach user to request (password excluded by select:false)
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User belonging to this token no longer exists.");
  }

  req.user = user;
  next();
});

/**
 * restrictTo — role-based access control.
 * Usage: router.delete("/...", protect, restrictTo("admin"), controller)
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You do not have permission to perform this action.")
      );
    }
    next();
  };
};

module.exports = { protect, restrictTo };
