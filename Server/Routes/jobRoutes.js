import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= JOB DATA =================

const jobData = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Infosys",
    location: "Noida",
    type: "Frontend",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    portals: [
      { name: "LinkedIn", link: "https://www.linkedin.com/jobs/" },
      { name: "Internshala", link: "https://internshala.com/" },
      { name: "Naukri", link: "https://www.naukri.com/" },
      { name: "Foundit", link: "https://www.foundit.com/" },
      { name: "Indeed India", link: "https://www.indeed.co.in/" },
      { name: "Freshersworld", link: "https://www.freshersworld.com/" },
    ],
    status: "Open",
    salaryRange: "4 - 8 LPA",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "TCS",
    location: "Remote",
    type: "Backend",
    skills: ["Java", "Spring", "Node"],
    portals: [
      { name: "LinkedIn", link: "https://www.linkedin.com/jobs/" },
      { name: "Naukri", link: "https://www.naukri.com/" },
      { name: "Indeed India", link: "https://www.indeed.co.in/" },
    ],
    status: "Interview Scheduled",
    salaryRange: "6 - 10 LPA",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Google",
    location: "Bangalore",
    type: "Full Stack",
    skills: ["React", "Node", "MongoDB"],
    portals: [
      { name: "LinkedIn", link: "https://www.linkedin.com/jobs/" },
      { name: "Foundit", link: "https://www.foundit.com/" },
      { name: "Freshersworld", link: "https://www.freshersworld.com/" },
    ],
    status: "Applied",
    salaryRange: "10 - 14 LPA",
  },
  {
    id: 4,
    title: "AI/ML Engineer",
    company: "Accenture",
    location: "Delhi",
    type: "AI/ML",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    portals: [
      { name: "LinkedIn", link: "https://www.linkedin.com/jobs/" },
      { name: "Naukri", link: "https://www.naukri.com/" },
      { name: "Indeed India", link: "https://www.indeed.co.in/" },
    ],
    status: "Open",
    salaryRange: "12 - 18 LPA",
  },
  {
    id: 5,
    title: "Cybersecurity Analyst",
    company: "Cisco",
    location: "Bangalore",
    type: "Cybersecurity",
    skills: ["Network Security", "SIEM", "Risk Assessment"],
    portals: [
      { name: "LinkedIn", link: "https://www.linkedin.com/jobs/" },
      { name: "Foundit", link: "https://www.foundit.com/" },
      { name: "Freshersworld", link: "https://www.freshersworld.com/" },
    ],
    status: "Interview Scheduled",
    salaryRange: "9 - 14 LPA",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "Amazon",
    location: "Remote",
    type: "Cloud",
    skills: ["AWS", "Docker", "CI/CD"],
    portals: [
      { name: "LinkedIn", link: "https://www.linkedin.com/jobs/" },
      { name: "Naukri", link: "https://www.naukri.com/" },
      { name: "Indeed India", link: "https://www.indeed.co.in/" },
    ],
    status: "Open",
    salaryRange: "14 - 20 LPA",
  },
];

// ================= GET JOBS =================

router.get("/", (req, res) => {
  res.json(jobData);
});

// ================= TEST ROUTE =================

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Job Routes Working Successfully",
  });
});

// ================= SEND NOTIFICATION =================
router.post("/send-notification", async (req, res) => {
  try {
    console.log("Send notification route hit");

    const {
      email,
      phone,
      title,
      company,
      status,
      appliedDate,
    } = req.body;

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        error: "Please enter both email address and phone number before applying.",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        error: "Email service is not configured. Please check EMAIL_USER and EMAIL_PASS in Server/.env.",
      });
    }

    const emailSubject = `Application Confirmation - ${title}`;

    const emailHTML = `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2 style="color:#2563eb;">Application Submitted Successfully</h2>

        <p>Hello,</p>

        <p>Your application has been submitted successfully.</p>

        <div style="
          background:#f8fafc;
          padding:15px;
          border-radius:10px;
          border:1px solid #e2e8f0;
        ">
          <h3>${title}</h3>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p><strong>Date:</strong> ${appliedDate}</p>
        </div>

        <p>
          We will notify you about future updates regarding your application.
        </p>

        <p>
          <strong>Email:</strong> ${email}<br/>
          <strong>Phone:</strong> ${phone}
        </p>

        <br/>

        <p>
          Best Regards,<br/>
          <strong>FocusHive Team</strong>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"FocusHive Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: emailSubject,
      html: emailHTML,
    });

    console.log("Email sent successfully");

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      application: {
        title,
        company,
        status,
        appliedDate,
      },
    });

  } catch (error) {
    console.error("Email Error:", error);

    const errorMessage =
      error.code === "EAUTH"
        ? "Gmail authentication failed. Please generate a new Gmail App Password and restart the server."
        : error.message;

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});


export default router;
