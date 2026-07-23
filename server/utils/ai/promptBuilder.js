const buildCoursePrompt = (topic) => {
  return `
You are an expert curriculum designer.

Generate a COMPLETE course for:

"${topic}"

Rules:

1. Return ONLY JSON.
2. Do NOT use markdown.
3. Do NOT wrap inside \`\`\`json.
4. Course should contain exactly 5 modules.
5. Every module should contain exactly 5 lessons.
6. Every lesson must have: title, summary, content, duration.
   - title: short lesson title (5-8 words).
   - summary: one sentence describing what the lesson covers.
   - content: 2-3 sentence explanation of the lesson topic. Be concise.
   - duration: integer (estimated minutes to complete, between 5 and 20).
7. Difficulty should be Beginner, Intermediate or Advanced.
8. Estimated duration should be in hours (integer).

Output format:

{
  "title": "",
  "description": "",
  "difficulty": "",
  "estimatedDuration": 0,
  "modules": [
    {
      "title": "",
      "description": "",
      "lessons": [
        {
          "title": "",
          "summary": "",
          "content": "",
          "duration": 0
        }
      ]
    }
  ]
}
`;
};

module.exports = {
  buildCoursePrompt,
};