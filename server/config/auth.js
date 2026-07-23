/**
 * config/auth.js
 * Centralised JWT configuration constants.
 * dotenv must be loaded before this module is required.
 */

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  return secret;
};

const getJwtExpiresIn = () => {
  return process.env.JWT_EXPIRES_IN || "7d";
};

module.exports = { getJwtSecret, getJwtExpiresIn };
