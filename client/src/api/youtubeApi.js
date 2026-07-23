import api from "./axios";

// Backend endpoint: GET /api/v1/youtube/search?q=<query>
// Uses the course title as the search query
export const getCourseVideos = (query) =>
  api.get(`/youtube/search?q=${encodeURIComponent(query)}`);
