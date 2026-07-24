import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.scss";
import Footer from "./Footer";
import { useInterview } from "../hooks/useInterview";
import Navbar from "./Navbar";
const Home = () => {
  const navigate = useNavigate();
  const resumeInputRef = useRef();

  const [fileName, setFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { loading, generateReport, reports, getReports, deleteReport } =
    useInterview();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];

    if (!resumeFile) {
      alert("Please upload your resume.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    if (!selfDescription.trim()) {
      alert("Please enter your self description.");
      return;
    }

    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      if (data?._id) {
        navigate(`/interview/${data._id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteReport = async (e, reportId) => {
    e.stopPropagation(); // don't trigger the card's navigate onClick

    const confirmed = window.confirm(
      "Delete this report? This can't be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(reportId);
      await deleteReport(reportId);
      await getReports();
    } catch (err) {
      console.error(err);
      alert("Couldn't delete this report. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await getReports();
      } catch (err) {
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-content">
          <div className="spinner" role="status" aria-label="Loading" />
          <h1>Generating your interview plan…</h1>
        </div>
      </main>
    );
  }

  return (
    <>
    <Navbar/>
      <main className="home">
        <div className="left">
          <h2>Job Description</h2>

          <textarea
            name="jobDescription"
            id="jobDescription"
            placeholder="Paste the target job description details here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="right">
          <h2>Your Application Details</h2>

          <div className="input-group">
            <label htmlFor="resume">Upload Resume</label>

            <div className="file-upload-wrapper">
              <div className="upload-icon" aria-hidden="true">
                📁
              </div>

              <div className="upload-text">
                {fileName ? (
                  <strong>{fileName}</strong>
                ) : (
                  <>
                    Drag & drop or <span>browse</span>
                  </>
                )}
              </div>

              <p className="upload-hint">Supports PDF formats up to 10MB</p>

              <input
                type="file"
                name="resume"
                id="resume"
                accept=".pdf"
                ref={resumeInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="selfDescription">Self Description</label>

            <input
              type="text"
              name="selfDescription"
              id="selfDescription"
              placeholder="Briefly describe your core strengths..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            />
          </div>

          <button
            className="generate-btn"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? "Generating Report..." : "Generate Report"}
          </button>
        </div>
      </main>

      <section className="recent-reports">
        <div className="recent-reports-header">
          <h2>My Recent Interview Reports</h2>
          {reports.length > 0 && (
            <span className="reports-count">
              {reports.length} report{reports.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="reports-empty">
            No reports yet — generate one above to see it here.
          </div>
        ) : (
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                tabIndex={0}
                onClick={() => navigate(`/interview/${report._id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/interview/${report._id}`);
                }}
              >
                <div className="report-item-header">
                  <h3>{report.title || "Untitled Position"}</h3>

                  <button
                    type="button"
                    className="delete-btn"
                    aria-label="Delete report"
                    disabled={deletingId === report._id}
                    onClick={(e) => handleDeleteReport(e, report._id)}
                  >
                    {deletingId === report._id ? "…" : "✕"}
                  </button>
                </div>

                <p className="report-meta">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>

                <span
                  className={`match-score ${
                    report.matchScore >= 80
                      ? "score--high"
                      : report.matchScore >= 60
                      ? "score--mid"
                      : "score--low"
                  }`}
                >
                  {report.matchScore}% Match
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </>
  );
};

export default Home;