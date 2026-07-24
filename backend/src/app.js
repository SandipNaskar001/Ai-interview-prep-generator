const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const multer = require("multer");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// require all the routes here
const authRouter = require("./routes/auth.routes");
const interviewRouter= require("../src/routes/interview.routes")
// using all routes here
app.use("/api/auth", authRouter);
app.use("/api/interview",interviewRouter);



app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
      field: err.field,
    });
  }

  next(err);
});

module.exports = app;
