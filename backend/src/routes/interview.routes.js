const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewRouter = express.Router();
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

// generate new interview report on basis of user self description
interviewRouter.post(
  "/",
  (req, res, next) => {
    console.log("Interview route hit");
    next();
  },
  authMiddleware.authUser,
  upload.any("resume"),
  interviewController.generateInterviewController,
);

interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.generateInterviewReportByIdController,
);

interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController,
);

interviewRouter.get(
  "/resume/:interviewReportId",
  authMiddleware.authUser,
  interviewController.generateResumePdfController,
);
interviewRouter.get(
  "/report/:interviewId/download",
  authMiddleware.authUser,
  interviewController.downloadInterviewReportPdfController,
);
interviewRouter.delete(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.deleteInterviewReport,
);

module.exports = interviewRouter;
