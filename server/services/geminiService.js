const { getOpenRouterClient } = require("../config/openrouter");

const { DEFAULT_MODEL } = require("../constants/aiConstants");

const { buildCoursePrompt } = require("../utils/ai/promptBuilder");

const { cleanResponse } = require("../utils/ai/responseCleaner");

const { validateCourseJSON } = require("../utils/ai/jsonValidator");

/**
 * Calls OpenRouter (OpenAI-compatible API) to generate a course outline.
 * @param {string} topic
 * @returns {Promise<Object>} Validated course JSON object
 */
const generateCourseOutline = async (topic) => {
  // Build the AI prompt
  const prompt = buildCoursePrompt(topic);

  // Lazily create the OpenRouter client (ensures .env is already loaded)
  const client = getOpenRouterClient();

  // Call OpenRouter via OpenAI-compatible chat completions
  const completion = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Guard: OpenRouter can return a 200 OK with an error body
  // (e.g., 402 insufficient credits, 429 rate-limit hit on free model)
  if (completion.error) {
    throw new Error(
      `OpenRouter API error (${completion.error.code}): ${completion.error.message}`
    );
  }

  if (!completion.choices || completion.choices.length === 0) {
    throw new Error(
      "OpenRouter returned an empty response. The model may be unavailable."
    );
  }

  // Extract the generated text from the response
  const text = completion.choices[0].message.content;

  // Clean the response (remove ```json ``` if present)
  const cleanedResponse = cleanResponse(text);

  // Convert JSON string to JavaScript object
  let courseJSON;
  try {
    courseJSON = JSON.parse(cleanedResponse);
  } catch (parseErr) {
    // Log the raw response so the cause can be diagnosed from server logs
    console.error("[geminiService] Raw AI response (first 500 chars):", text.slice(0, 500));
    console.error("[geminiService] JSON parse error:", parseErr.message);
    throw new Error(
      "The AI returned a response that could not be parsed as JSON. " +
      "This can happen when the model truncates a large response. " +
      "Please try again. (" + parseErr.message + ")"
    );
  }

  // Validate the generated JSON structure
  validateCourseJSON(courseJSON);

  // Return the validated course
  return courseJSON;
};

module.exports = {
  generateCourseOutline,
};