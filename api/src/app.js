const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");
const logger = require("./config/logger");
const { register, httpRequestCounter, httpRequestDuration } = require("./config/metrics");
require("./models");

const app = express();

/* ==============================
   SECURITY MIDDLEWARES
============================== */

// Helmet (security headers)
app.use(helmet());

// Global rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 300, 
});
app.use(limiter);

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "*",
    credentials: true,
  })
);

app.use(express.json());

/* ==============================
   LOGGING
============================== */

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  next();
});

/* ==============================
   METRICS
============================== */

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
    httpRequestDuration.observe(
      { method: req.method, route: req.path, status_code: res.statusCode },
      duration
    );
  });
  next();
});

if (process.env.NODE_ENV !== "production") {
  app.get("/metrics", async (req, res) => {
    try {
      res.set("Content-Type", register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
}

/* ==============================
   ROUTES
============================== */

app.use("/auth", require("./routes/auth.routes"));
app.use("/me", require("./routes/me.routes"));
app.use("/missions", require("./routes/mission.routes"));
app.use("/documents", require("./routes/document.routes"));
app.use("/students", require("./routes/student.routes"));
app.use("/student-profile", require("./routes/studentProfile.routes"));
app.use("/contact", require("./routes/contact.routes"));
app.use("/feedback", require("./routes/feedback.routes"));
app.use("/api/candidatures", require("./routes/candidature.routes"));

app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.json({ message: "LinkyJob API running" });
});

/* ==============================
   ERROR HANDLER
============================== */

app.use((err, req, res, next) => {
  logger.error(err);

  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

/* ==============================
   DB CONNECTION
============================== */

sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connected");
  })
  .catch((err) => {
    logger.error("Database connection failed:", err);
  });

module.exports = app;
