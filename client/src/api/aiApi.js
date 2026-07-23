import api from "./axios";

export const generateCourse = (data) =>
  api.post("/ai/generate-course", data);
