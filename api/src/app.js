const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const logger = require("./config/logger"); //  logger Pino
const { register, httpRequestCounter, httpRequestDuration } = require("./config/metrics"); //  métriques
const authRoutes = require("./routes/auth.routes");
const meRoutes = require("./routes/me.routes");
const missionRoutes = require("./routes/mission.routes");
const documentRoutes = require("./routes/document.routes");
const studentRoutes = require("./routes/student.routes");
const candidatureRoutes = require("./routes/candidature.routes");
const studentProfileRoutes = require("./routes/studentProfile.routes");
const contactRoutes = require("./routes/contact.routes");
const feedbackRoutes = require("./routes/feedback.routes");
require("./models"); 


const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use("/students", studentRoutes);
app.use("/student-profile", studentProfileRoutes);

//  Middleware de logs Pino (requêtes HTTP)
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

//  Middleware de métriques Prometheus
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

//  Route Prometheus
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Routes principales
app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/missions", missionRoutes);
app.use("/documents", documentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/contact", contactRoutes);
app.use("/feedback", feedbackRoutes);
//  Route test simple
app.get("/", (req, res) => {
  logger.info(" API LinkyJob running");
  res.json({ message: "LinkyJob API running " });
});
//test 5xx
app.get("/error", (req, res) => {
  throw new Error("Test internal server error");
});
app.use("/api/candidatures", candidatureRoutes);
// Connexion Sequelize
sequelize
  .sync({ alter: true })
  .then(() => {
    logger.info("Database connected & synced");
  })
  .catch((err) => {
    logger.error("Database connection failed:", err);
  });

module.exports = app;
