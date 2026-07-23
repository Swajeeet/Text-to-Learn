import api from "./axios";

export const getLessonsByModule = (moduleId) =>
  api.get(`/lessons/module/${moduleId}`);
