const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const meRoutes = require("./routes/me.routes");
const missionRoutes = require("./routes/mission.routes");
const documentRoutes = require("./routes/document.routes");


//  Charger le fichier .env AVANT tout
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/missions", missionRoutes);
app.use("/documents", documentRoutes);


sequelize
  .sync()
  .then(() => {
    console.log("Database connected & synced");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

module.exports = app;
