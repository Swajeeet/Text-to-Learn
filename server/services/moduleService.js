const { Module } = require("../models");

const createModule = async (moduleData) => {
  const module = await Module.create(moduleData);
  return module;
};

const getModulesByCourse = async (courseId) => {
  return await Module.find({ course: courseId }).sort({
    order: 1,
  });
};

const getModuleById = async (moduleId) => {
  return await Module.findById(moduleId);
};

const updateModule = async (moduleId, updatedData) => {
  return await Module.findByIdAndUpdate(
    moduleId,
    updatedData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};

const deleteModule = async (moduleId) => {
  return await Module.findByIdAndDelete(moduleId);
};

const createGeneratedModules = async (
  courseId,
  modules
) => {

  const moduleDocuments = modules.map(
    (module, index) => ({
      title: module.title,
      description: module.description,
      order: index + 1,
      course: courseId,
    })
  );

  return await Module.insertMany(moduleDocuments);

};

module.exports = {
  createModule,
  getModulesByCourse,
  getModuleById,
  updateModule,
  deleteModule,
  createGeneratedModules,
};