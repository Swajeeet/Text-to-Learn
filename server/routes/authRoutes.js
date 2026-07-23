const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} = require("../validators/authValidator");

// POST /api/v1/auth/register
router.post(
  "/register",
  registerValidator,
  validate,
  authController.register
);

// POST /api/v1/auth/login
router.post(
  "/login",
  loginValidator,
  validate,
  authController.login
);

// GET /api/v1/auth/profile  (private)
router.get("/profile", protect, authController.getProfile);

// PUT /api/v1/auth/profile  (private)
router.put(
  "/profile",
  protect,
  updateProfileValidator,
  validate,
  authController.updateProfile
);

module.exports = router;
