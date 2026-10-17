const express = require("express");

const router = express.Router();

const aiController = require("../controllers/aiController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/generate-course", protect, aiController.generateCourse);

module.exports = router;