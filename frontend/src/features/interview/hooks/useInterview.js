import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  deleteInterviewReport,
  downloadResumePdf,
  downloadInterviewReportPdf,
} from "../../auth/services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error(
      "useInterview must be used within an InterviewProvider"
    );
  }

  const {
    loading,
    setloading,
    report,
    setReport,
    reports,
    setReports,
  } = context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setloading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      setReport(response.interviewReport);

      return response.interviewReport;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setloading(false);
    }
  };

  const getReportById = async (interviewId) => {
    setloading(true);

    try {
      const response = await getInterviewReportById(interviewId);

      setReport(response.interviewReport);

      return response.interviewReport;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setloading(false);
    }
  };

  const getReports = async () => {
    setloading(true);

    try {
      const response = await getAllInterviewReports();

      setReports(response.interviewReports);

      return response.interviewReports;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setloading(false);
    }
  };

  // Intentionally does NOT touch the global `loading` flag — that flag
  // swaps the whole page for the "Generating..." screen, which we don't
  // want when deleting a single card. Home.jsx tracks its own per-item
  // deleting state and calls getReports() after this resolves.
  const deleteReport = async (interviewId) => {
    try {
      await deleteInterviewReport(interviewId);

      // Optimistic local update so the card disappears immediately,
      // even before the follow-up getReports() call resolves.
      setReports((prev) => prev.filter((r) => r._id !== interviewId));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Does NOT touch global `loading` — same reasoning as deleteReport.
  // Downloading shouldn't blank out the whole interview page.
  const getResumePdf = async (interviewId) => {
    try {
      const blob = await downloadResumePdf(interviewId);

      // Browsers can't "download" a blob directly — the standard trick
      // is to give it a temporary object URL, click a hidden <a download>
      // pointed at that URL, then clean both up.
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume_${interviewId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Because we request responseType: "blob", an error response from
      // the server (which sends JSON like { success: false, message })
      // arrives here as a Blob too, not parsed JSON. Unwrap it so the
      // real server message is visible instead of a raw Blob object.
      if (error instanceof Blob && error.type === "application/json") {
        const text = await error.text();
        const parsed = JSON.parse(text);
        console.error("Resume download failed:", parsed);
        throw parsed;
      }

      console.error(error);
      throw error;
    }
  };
const getInterviewReportPdf = async (interviewId) => {
  try {
    const blob = await downloadInterviewReportPdf(interviewId);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `interview-report_${interviewId}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Report download failed:", error);
    throw error;
  }
};
return {
  loading,
  report,
  reports,
  generateReport,
  getReportById,
  getReports,
  deleteReport,
  getResumePdf,
  getInterviewReportPdf,
};
};