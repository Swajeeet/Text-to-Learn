const OpenAI = require("openai");

/**
 * OpenRouter client — uses the OpenAI-compatible SDK.
 * IMPORTANT: dotenv.config() MUST be called before this module is first require()'d.
 * That is guaranteed by server.js loading dotenv before requiring app.js.
 */
const getOpenRouterClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not defined in process.env. " +
        "Ensure the key exists in server/.env and dotenv.config() runs before this module loads."
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
};

module.exports = { getOpenRouterClient };
