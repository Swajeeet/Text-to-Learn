const express = require("express");

const router = express.Router();

const moduleController = require("../controllers/moduleController");

router.post("/", moduleController.createModule);

router.get("/course/:courseId", moduleController.getModulesByCourse);

router.get("/:id", moduleController.getModuleById);

router.put("/:id", moduleController.updateModule);

router.delete("/:id", moduleController.deleteModule);

module.exports = router;