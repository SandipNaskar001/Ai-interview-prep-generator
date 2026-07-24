const { GoogleGenAI } = require("@google/genai");

const puppeteer = require("puppeteer");
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API,
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical interviewer.

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "matchScore": 85,
  "title": "React Developer",
  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "skillGaps": [
    {
      "skill": "",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": ["", "", ""]
    }
  ]
}

Rules:
- matchScore must be between 0 and 100.
- title must be the job title inferred from the job description.
- Generate exactly 10 technical questions.
- Generate exactly 5 behavioral questions.
- Generate exactly 5 skill gaps.
- Generate a 7-day preparation plan.
- Severity must be one of: low, medium, high.
- Return ONLY JSON.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const report = JSON.parse(response.text);

  report.title = report.title?.trim() || "Software Developer";

  return report;
}

async function generatePdfFromHtml(html) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  const pdf = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdf;
}

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Generate a professional ATS-friendly resume in HTML.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY JSON in this format:

{
  "html":"..."
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const html = JSON.parse(response.text).html;

  return await generatePdfFromHtml(html);
}
async function generateInterviewReportPdf(report) {
  const html = `
    <html>
      <body>
        <h1>Interview Preparation Report</h1>
        <h2>${report.title}</h2>
        <p>Match score: ${report.matchScore}%</p>

        <h2>Skill Gaps</h2>
        <ul>
          ${report.skillGaps.map(item => `<li>${item.skill} (${item.severity})</li>`).join("")}
        </ul>

        <h2>7-Day Roadmap</h2>
        ${report.preparationPlan.map(day => `
          <h3>Day ${day.day}: ${day.focus}</h3>
          <ul>${day.tasks.map(task => `<li>${task}</li>`).join("")}</ul>
        `).join("")}
      </body>
    </html>
  `;

  return generatePdfFromHtml(html);
}
module.exports = {
  generateInterviewReport,
  generateResumePdf,
  generateInterviewReportPdf,
};