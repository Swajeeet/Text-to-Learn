const { getOpenRouterClient } = require("../config/openrouter");

const TRANSLATION_MODEL = "google/gemma-4-26b-a4b-it:free";

/**
 * Translate a text string to a target language using OpenRouter LLM.
 * No external translation API key required — uses the existing OpenRouter integration.
 *
 * @param {string} text         - Text to translate
 * @param {string} targetLang   - Target language (e.g. "Spanish", "Hindi", "French")
 * @returns {Promise<string>}   - Translated text
 */
const translateText = async (text, targetLang) => {
  const client = getOpenRouterClient();

  const prompt = `Translate the following text to ${targetLang}. 
Return ONLY the translated text. Do NOT add explanations, notes, or any extra content.

Text to translate:
${text}`;

  const completion = await client.chat.completions.create({
    model: TRANSLATION_MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  if (completion.error) {
    throw new Error(
      `Translation failed: ${completion.error.message}`
    );
  }

  return completion.choices[0].message.content.trim();
};

/**
 * Translate a full course object (title, description) to a target language.
 * Modules and their descriptions are also translated.
 *
 * @param {Object} course       - { title, description }
 * @param {Array}  modules      - Array of { title, description }
 * @param {string} targetLang   - Target language name
 * @returns {Promise<Object>}   - { translatedCourse, translatedModules }
 */
const translateCourse = async (course, modules = [], targetLang) => {
  // Translate course fields
  const [translatedTitle, translatedDescription] = await Promise.all([
    translateText(course.title, targetLang),
    translateText(course.description, targetLang),
  ]);

  const translatedCourse = {
    ...course,
    title: translatedTitle,
    description: translatedDescription,
    language: targetLang,
  };

  // Translate modules in parallel
  const translatedModules = await Promise.all(
    modules.map(async (mod) => {
      const [modTitle, modDesc] = await Promise.all([
        translateText(mod.title, targetLang),
        mod.description ? translateText(mod.description, targetLang) : Promise.resolve(""),
      ]);

      return {
        ...mod,
        title: modTitle,
        description: modDesc,
      };
    })
  );

  return { translatedCourse, translatedModules };
};

module.exports = { translateText, translateCourse };
