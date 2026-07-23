import api from "./axios";

export const getCourseById = (id) => api.get(`/courses/${id}`);
export const getModulesByCourse = (id) => api.get(`/modules/course/${id}`);
