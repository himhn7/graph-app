const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const preferredEnvFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
const preferredPath = path.resolve(process.cwd(), preferredEnvFile);
const fallbackPath = path.resolve(process.cwd(), ".env");

dotenv.config({
  path: fs.existsSync(preferredPath) ? preferredPath : fallbackPath
});

const requiredVars = ["DATABASE_URL"];

requiredVars.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
});

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173"
};
