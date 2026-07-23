const validateCourseJSON = (course) => {

    if (!course.title)
        throw new Error("Course title missing");

    if (!course.modules)
        throw new Error("Modules missing");

    if (!Array.isArray(course.modules))
        throw new Error("Modules should be an array");

    return true;

};

module.exports = {
    validateCourseJSON,
};