/**
 * config/env.js
 * Validates all required environment variables at startup.
 * Call this after dotenv.config() in server.js if you want early failure.
 * Currently used as a reference — validation happens lazily in each config module.
 */

const REQUIRED_VARS = [
  "PORT",
  "MONGODB_URI",
  "OPENROUTER_API_KEY",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
];

const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }

  console.log("✅ All required environment variables are present.");
};

module.exports = { validateEnv };
