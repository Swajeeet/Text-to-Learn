const axios = require("axios");

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3/search";
const MAX_RESULTS = 5;

/**
 * Search YouTube for educational videos related to a query.
 * Gracefully returns empty array if YOUTUBE_API_KEY is not configured.
 *
 * @param {string} query - The search query (e.g. lesson title)
 * @returns {Promise<Array>} Array of video objects { title, videoId, url, thumbnail }
 */
const searchVideos = async (query) => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn(
      "⚠️  YOUTUBE_API_KEY not configured — YouTube search skipped."
    );
    return [];
  }

  try {
    const response = await axios.get(YOUTUBE_API_BASE, {
      params: {
        key: apiKey,
        q: query,
        part: "snippet",
        type: "video",
        maxResults: MAX_RESULTS,
        relevanceLanguage: "en",
        safeSearch: "strict",
      },
      timeout: 8000,
    });

    const videos = (response.data.items || []).map((item) => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails?.medium?.url || "",
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
    }));

    return videos;
  } catch (error) {
    console.error(
      "❌ YouTube API error:",
      error.response?.data?.error?.message || error.message
    );
    // Non-fatal — return empty array instead of crashing
    return [];
  }
};

module.exports = { searchVideos };
