const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { ZodError } = require("zod");
const env = require("./config/env");
const diagramRoutes = require("./routes/diagramRoutes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/diagrams", diagramRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed.",
      issues: err.issues
    });
  }

  console.error(err);
  return res.status(500).json({
    message: "Internal server error."
  });
});

module.exports = app;
