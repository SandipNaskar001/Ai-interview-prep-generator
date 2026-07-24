import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

/**
 * Generate Interview Report
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  try {
    const formData = new FormData();

    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const { data } = await api.post("/api/interview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get Interview Report by ID
 */
export const getInterviewReportById = async (interviewId) => {
  try {
    const { data } = await api.get(
      `/api/interview/report/${interviewId}`
    );

    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get All Interview Reports
 */
export const getAllInterviewReports = async () => {
  try {
    const { data } = await api.get("/api/interview");

    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete Interview Report by ID
 */
export const deleteInterviewReport = async (interviewId) => {
  try {
    const { data } = await api.delete(
      `/api/interview/report/${interviewId}`
    );

    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Download Resume PDF
 * responseType: "blob" because this endpoint returns a raw PDF file,
 * not JSON — axios needs to know not to try to parse it as text/JSON.
 */
export const downloadResumePdf = async (interviewReportId) => {
  try {
    const response = await api.get(
      `/api/interview/resume/${interviewReportId}`,
      { responseType: "blob" }
    );

    return response.data; // a Blob
  } catch (error) {
    throw error.response?.data || error;
  }
};
/**
 * Download Interview Report PDF
 */
export const downloadInterviewReportPdf = async (interviewId) => {
  try {
    const response = await api.get(
      `/api/interview/report/${interviewId}/download`,
      { responseType: "blob" }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export default api;