import api from "./axios";

export const downloadCoursePdf = (courseId) =>
  api.get(`/courses/${courseId}/pdf`, { responseType: "blob" });
