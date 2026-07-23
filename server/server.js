const path = require("path");
const dotenv = require("dotenv");

// Load .env first — absolute path so it works from any CWD
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Validate required environment variables immediately after loading
const { validateEnv } = require("./config/env");
validateEnv();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Base: http://localhost:${PORT}/api/v1`);
  });
};

startServer();