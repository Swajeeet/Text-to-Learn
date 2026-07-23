import api from "./axios";

export const getCourses = () => api.get("/courses");
