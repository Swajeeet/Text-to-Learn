import api from "./axios";

export const getProgress = (courseId) =>
  api.get(`/progress/${courseId}`);

export const markLessonComplete = (courseId, lessonId) =>
  api.post(`/progress/${courseId}/complete`, { lessonId });
