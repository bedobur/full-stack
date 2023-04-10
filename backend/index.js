require("dotenv").config();
const PORT = process.env.PORT || 3001;
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const errorHandler = require("./middleware/errorHandler");

const usersRoutes = require("./routes/users");
const userRoutes = require("./routes/user");
const aidsRoutes = require("./routes/aids");
const profilesRoutes = require("./routes/profiles");
const categoriesRoutes = require("./routes/categories");

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    await sequelize.sync({ alter: true });
    // await sequelize.authenticate();
  } catch (error) {
    console.error(error);
  }
})();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../frontend/build"));
} else {
  app.get("/", (req, res) => res.json({ status: "API is running on /api" }));
}
app.use("/api/users", usersRoutes);
app.use("/api/user", userRoutes);
app.use("/api/aids", aidsRoutes);
app.use("/api/profiles", profilesRoutes);
app.use("/api/categories", categoriesRoutes);
app.get("*", (req, res) =>
  res.status(404).json({ errors: { body: ["Not found"] } }),
);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
