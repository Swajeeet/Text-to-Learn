/**
 * repairTruncatedJson
 *
 * Attempts to close an unterminated JSON string that was cut off by a model
 * output token limit. Strategy:
 *   1. Walk the string character-by-character tracking open/closed state.
 *   2. If a complete root object was already closed at some point, slice to it.
 *   3. Otherwise, close any open string literal, remove trailing commas,
 *      then close open brackets and braces in reverse order.
 */
const repairTruncatedJson = (text) => {
  let str = text;
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escaped = false;
  let lastCompleteRootClose = -1; // index of last '}' that fully closed the root

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (escaped) { escaped = false; continue; }
    if (ch === "\\" && inString) { escaped = true; continue; }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (ch === "{") openBraces++;
      else if (ch === "}") {
        openBraces--;
        if (openBraces === 0 && openBrackets === 0) lastCompleteRootClose = i;
      }
      else if (ch === "[") openBrackets++;
      else if (ch === "]") openBrackets--;
    }
  }

  // Happy path: a complete root object was already in the text
  if (lastCompleteRootClose !== -1 && openBraces === 0 && openBrackets === 0) {
    return str.slice(0, lastCompleteRootClose + 1);
  }

  // Repair path: truncated mid-response
  // Close any open string first
  if (inString) str += '"';

  // Strip trailing comma before we add closing brackets
  str = str.replace(/,\s*$/, "");

  // Close open arrays then objects
  while (openBrackets > 0) { str += "]"; openBrackets--; }
  while (openBraces > 0) { str += "}"; openBraces--; }

  return str;
};

/**
 * cleanResponse
 *
 * Strips markdown fences, extracts the first complete JSON object from the
 * AI response, and attempts to repair any truncated structure.
 */
const cleanResponse = (text) => {
  // Strip markdown code fences
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Extract from first '{' to last '}' — removes any prefix/suffix text
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  } else if (start !== -1) {
    // No closing brace found — response was fully truncated; attempt repair
    cleaned = repairTruncatedJson(cleaned.slice(start));
  }

  // Final repair pass in case there are still unclosed structures
  try {
    JSON.parse(cleaned);
    return cleaned; // already valid
  } catch {
    return repairTruncatedJson(cleaned);
  }
};

module.exports = {
  cleanResponse,
  repairTruncatedJson,
};