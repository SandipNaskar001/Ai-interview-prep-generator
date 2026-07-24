const { PDFParse } = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
  generateInterviewReportPdf,
} = require("../services/ai.service");
const interviewReportModel = require("../model/interview.report.model");

async function generateInterviewController(req, res) {
  try {
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required.",
      });
    }

    const { selfDescription, jobDescription } = req.body;

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Self description and job description are required.",
      });
    }

    const resumeFile = req.files[0];

    // Parse PDF
    const parser = new PDFParse({
      data: resumeFile.buffer,
    });

    const parsedPdf = await parser.getText();
    const resumeText = parsedPdf.text;

    await parser.destroy();

    // Generate AI report
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    console.log("========== AI RESPONSE ==========");
    console.log(JSON.stringify(interviewReportByAi, null, 2));
    console.log("================================");

    // Save report
    const interviewReport = await interviewReportModel.create({
      user: req.user.id, // change to req.user._id if your middleware uses _id
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(201).json({
      success: true,
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Generate Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

async function generateInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview report fetched successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -__v"
      );

    return res.status(200).json({
      success: true,
      message: "Interview reports fetched successfully.",
      interviewReports,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findById(
      interviewReportId
    );

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found.",
      });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({
      resume,
      selfDescription,
      jobDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}



async function downloadInterviewReportPdfController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found.",
      });
    }

    const pdfBuffer = await generateInterviewReportPdf(interviewReport);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=interview-report_${interviewId}.pdf`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Download report PDF error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Could not generate report PDF.",
    });
  }
}
// controller
 async function deleteInterviewReport(req,res) 
  
  {
  try {
    const { interviewId } = req.params;

    const deleted = await interviewReportModel.findByIdAndDelete(interviewId);

    if (!deleted) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete report" });
  }
};
module.exports = {
  generateInterviewController,
  generateInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  downloadInterviewReportPdfController,
  deleteInterviewReport,
};