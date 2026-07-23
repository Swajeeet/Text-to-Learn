const moduleService = require("../services/moduleService");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/**
 * POST /api/v1/modules
 */
const createModule = asyncHandler(async (req, res) => {
  const module = await moduleService.createModule(req.body);

  res.status(201).json(
    new ApiResponse(201, { module }, "Module created successfully")
  );
});

/**
 * GET /api/v1/modules/course/:courseId
 */
const getModulesByCourse = asyncHandler(async (req, res) => {
  const modules = await moduleService.getModulesByCourse(req.params.courseId);

  res.status(200).json(
    new ApiResponse(
      200,
      { modules, count: modules.length },
      "Modules fetched successfully"
    )
  );
});

/**
 * GET /api/v1/modules/:id
 */
const getModuleById = asyncHandler(async (req, res) => {
  const module = await moduleService.getModuleById(req.params.id);

  if (!module) {
    throw new ApiError(404, "Module not found");
  }

  res.status(200).json(
    new ApiResponse(200, { module }, "Module fetched successfully")
  );
});

/**
 * PUT /api/v1/modules/:id
 */
const updateModule = asyncHandler(async (req, res) => {
  const module = await moduleService.updateModule(req.params.id, req.body);

  if (!module) {
    throw new ApiError(404, "Module not found");
  }

  res.status(200).json(
    new ApiResponse(200, { module }, "Module updated successfully")
  );
});

/**
 * DELETE /api/v1/modules/:id
 */
const deleteModule = asyncHandler(async (req, res) => {
  const module = await moduleService.deleteModule(req.params.id);

  if (!module) {
    throw new ApiError(404, "Module not found");
  }

  res.status(200).json(
    new ApiResponse(200, null, "Module deleted successfully")
  );
});

module.exports = {
  createModule,
  getModulesByCourse,
  getModuleById,
  updateModule,
  deleteModule,
};