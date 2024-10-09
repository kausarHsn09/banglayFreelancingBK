const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const app = express();
const session = require("express-session");
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
//routes
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoute = require("./routes/userRoute");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const couseVideoRoutes = require("./routes/couseVideoRoutes");
const courseRoutes = require("./routes/courseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const hashtagRoutes = require("./routes/hashtagRoutes");
const captionRoutes = require("./routes/captionRoutes");
const scriptRoutes = require("./routes/scriptRoutes");
const bioRoutes = require("./routes/bioRoutes");
const contentRoutes = require("./routes/contentRoutes");
const nicknameRoutes = require("./routes/nicknameRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");
const challengeRoutes = require("./routes/challengeRoutes")
const withdrawRoutes = require("./routes/withdrawRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const utilsRoutes = require("./routes/utilsRoutes");
const teamRoutes = require("./routes/teamRoutes");
app.use(express.json({}));
app.use(morgan("dev"));
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true,
}));

// 1 Midddleware
app.use(helmet());


//Rate Limit
const limiter = {
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP',
};
app.use('/api', rateLimit(limiter));


//Data sanitation against No sql queries injection
app.use(mongoSanitize());

//Prevent parameter injection
app.use(
  hpp()
);


// Configure Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/v1/dashboard", dashboardRoutes);

//Authentication routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/videos", couseVideoRoutes);

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/hashtags", hashtagRoutes);
app.use("/api/v1/captions", captionRoutes);
app.use("/api/v1/scripts", scriptRoutes);

app.use("/api/v1/bio", bioRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/nickname", nicknameRoutes);

app.use("/api/v1/withdraw", withdrawRoutes);
app.use("/api/v1/settings", settingsRoutes);

app.use("/api/v1/exchange", exchangeRoutes);
app.use("/api/v1/challenges", challengeRoutes);

app.use("/api/v1/team", teamRoutes);

app.use("/api/v1/utils", utilsRoutes);


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
