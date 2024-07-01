const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const app = express();
const session = require("express-session");

//routes
const userRoute = require("./routes/userRoute");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const couseVideoRoutes = require("./routes/couseVideoRoutes");
const courseRoutes = require("./routes/courseRoutes");

const categoryRoutes = require("./routes/categoryRoutes");
const hashtagRoutes = require("./routes/hashtagRoutes");
const captionRoutes = require("./routes/captionRoutes");


const withdrawRoutes = require("./routes/withdrawRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

app.use(express.json({}));
app.use(morgan("dev"));
app.use(cors());

// Configure Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//Authentication routes
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/courses", courseRoutes);
  app.use("/api/v1/enrollments", enrollmentRoutes);
  app.use("/api/v1/videos", couseVideoRoutes);

  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/hashtags", hashtagRoutes);
  app.use("/api/v1/captions", captionRoutes);


  app.use("/api/v1/withdraw", withdrawRoutes);
  app.use("/api/v1/settings", settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: "Something went wrong!",
    error: err.message,
  });
});

// Route not found (404) middleware
app.use((req, res, next) => {
  res.status(404).send({
    message: "Route not found",
  });
});

module.exports = app;
