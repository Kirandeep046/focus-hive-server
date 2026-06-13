import React, { useState, useEffect, useRef } from "react";
import "./JobSuggestions.css";

const defaultJobData = [
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
    title: "React Intern",
    company: "Wipro",
    location: "Remote",
    type: "Frontend",
    skills: ["React", "JavaScript", "CSS"],
    portals: [
      { name: "LinkedIn", link: "https://www.linkedin.com/jobs/" },
      { name: "Internshala", link: "https://internshala.com/" },
      { name: "Naukri", link: "https://www.naukri.com/" },
    ],
    status: "Selected",
    salaryRange: "3 - 5 LPA",
  },
  {
    id: 5,
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
    id: 6,
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
    id: 7,
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

const trendingSkills = ["React", "AI", "Machine Learning", "Cybersecurity", "Python", "Cloud"];

const careerRoadmaps = {
  "Frontend Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Projects",
    "Internship",
    "Job",
  ],
  "UI Developer": [
    "HTML",
    "CSS",
    "Figma",
    "JavaScript",
    "Accessibility",
    "Portfolio",
    "Interviews",
  ],
  "AI/ML Engineer": [
    "Python",
    "Statistics",
    "Machine Learning",
    "TensorFlow",
    "Model Building",
    "Projects",
    "Job",
  ],
  "Cybersecurity Analyst": [
    "Networking",
    "Security Basics",
    "Risk Assessment",
    "SIEM Tools",
    "Incident Response",
    "Certifications",
    "Job",
  ],
  "React Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "State Management",
    "Projects",
    "Job",
  ],
  "Web Designer": [
    "Design Basics",
    "HTML",
    "CSS",
    "Figma",
    "UI Principles",
    "Portfolio",
    "Freelance",
  ],
};

function calculateMatch(jobSkills, userSkills) {
  if (!userSkills || userSkills.length === 0) return 0;

  const matched = jobSkills.filter((skill) =>
    userSkills.some((userSkill) => userSkill.toLowerCase() === skill.toLowerCase())
  );
  return Math.min(Math.round((matched.length / jobSkills.length) * 100), 100);
}

function extractSkillsFromText(text) {
  const keywords = ["React", "JavaScript", "HTML", "CSS", "Node", "Java", "Python", "MongoDB"];
  const found = keywords.filter((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  return Array.from(new Set(found));
}

export default function JobSuggestions() {
  const [jobData, setJobData] = useState(defaultJobData);
  const [resumeSkills, setResumeSkills] = useState("");
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [category, setCategory] = useState("All");
  const [savedJobs, setSavedJobs] = useState([]);
  const [alertSkills, setAlertSkills] = useState("React, JavaScript, AI");
  const [alertLocation, setAlertLocation] = useState("Remote");
  const [advisorInput, setAdvisorInput] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailSubject, setEmailSubject] = useState("New job matches are available");
  const [emailBody, setEmailBody] = useState("We found new roles matching your saved alerts. Apply now to stay ahead.");
  const [emailStatus, setEmailStatus] = useState("No applications sent yet.");
  const [lastAppliedJob, setLastAppliedJob] = useState(null);
  const savedJobsRef = useRef(null);
  const [careerGoal, setCareerGoal] = useState("Frontend Developer");
  const [experienceYears, setExperienceYears] = useState(1);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState("Applied");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [notificationSending, setNotificationSending] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(saved);
    const applied = JSON.parse(localStorage.getItem("appliedJobs")) || {};
    setAppliedJobs(applied);
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedPhone = localStorage.getItem("userPhone") || "";
    setUserEmail(storedEmail);
    setUserPhone(storedPhone);
  }, []);

  const handleEnableEmailAlerts = () => {
    setEmailEnabled((prev) => {
      const enabled = !prev;
      setEmailStatus(enabled ? "Email alerts enabled. You will get updates when you apply." : "Email alerts disabled.");
      return enabled;
    });
  };

  const handleSaveJob = (job) => {
    const exists = savedJobs.some((item) => item.id === job.id);
    if (!exists) {
      const updated = [...savedJobs, job];
      setSavedJobs(updated);
      localStorage.setItem("savedJobs", JSON.stringify(updated));
    }
  };

  const handleRemoveSavedJob = (jobId) => {
    const updated = savedJobs.filter((job) => job.id !== jobId);
    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  const handleApplyJob = async (job) => {
    if (!userEmail.trim() || !userPhone.trim()) {
      setEmailStatus("Please enter your email address and phone number before applying.");
      return;
    }

    setLastAppliedJob(job);
    setEmailEnabled(true);

    const subject = `Application submitted for ${job.title}`;
    const body = `You have successfully applied for ${job.title} at ${job.company} in ${job.location}. We will notify you about next steps and similar matching opportunities.`;

    setEmailSubject(subject);
    setEmailBody(body);

    try {
      setEmailStatus("Submitting your application and sending confirmation email...");

      const response = await fetch("http://localhost:5000/api/jobs/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          phone: userPhone,
          title: job.title,
          company: job.company,
          status: "Applied",
          appliedDate: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to send confirmation email.");
      }

      setEmailStatus(`Application submitted for ${job.title}. A confirmation email has been sent to ${userEmail}.`);
      setUserEmail("");
      setUserPhone("");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");
    } catch (error) {
      setEmailStatus(error.message || "Application submitted, but confirmation email could not be sent.");
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJobForApply(job);
    setApplicationStatus(appliedJobs[job.id]?.status || "Applied");
    setShowApplyModal(true);
  };

  const handleSubmitApplication = () => {
    if (!selectedJobForApply) return;
    if (!userEmail || !userPhone) {
      alert("Please enter your email and phone number to apply");
      return;
    }

    setNotificationSending(true);
    const applicationData = {
      jobId: selectedJobForApply.id,
      title: selectedJobForApply.title,
      company: selectedJobForApply.company,
      status: applicationStatus,
      appliedDate: appliedJobs[selectedJobForApply.id]?.appliedDate || new Date().toLocaleDateString(),
      email: userEmail,
      phone: userPhone,
    };

    // Save to localStorage
    const updated = {
      ...appliedJobs,
      [selectedJobForApply.id]: applicationData,
    };
    setAppliedJobs(updated);
    localStorage.setItem("appliedJobs", JSON.stringify(updated));
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("userPhone", userPhone);

    // Send email and SMS notification to backend
    fetch("http://localhost:5000/api/jobs/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    })
      .then((res) => res.json())
      .then((data) => {
        setNotificationSending(false);
        setLastAppliedJob(selectedJobForApply);
        setEmailEnabled(true);
        const subject = `${applicationStatus} for ${selectedJobForApply.title}`;
        const body = `Status: ${applicationStatus} | Company: ${selectedJobForApply.company} | Location: ${selectedJobForApply.location}\n\nEmail & SMS notification sent to ${userEmail} and ${userPhone}`;
        setEmailSubject(subject);
        setEmailBody(body);
        setEmailStatus(`✓ Confirmation sent to ${userEmail} and ${userPhone}`);
        setShowApplyModal(false);
      })
      .catch((error) => {
        setNotificationSending(false);
        console.error("Error sending notification:", error);
        // Still save locally even if notification fails
        setLastAppliedJob(selectedJobForApply);
        setEmailEnabled(true);
        setEmailStatus(`Applied! But notification couldn't be sent. Check your connection.`);
        setShowApplyModal(false);
      });
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result.toString();
      const skills = extractSkillsFromText(text);
      const finalSkills = skills.length > 0 ? skills : ["React", "JavaScript", "HTML", "CSS"];
      setExtractedSkills(finalSkills);
      setResumeSkills(finalSkills.join(", "));
    };
    reader.readAsText(file);
  };

  const filteredJobs = jobData.filter((job) => {
    const byCategory = category === "All" || job.type === category;
    const byLocation = selectedLocation === "All" || job.location === selectedLocation;
    return byCategory && byLocation;
  });

  const userSkillsArray = resumeSkills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const savedAlertSkills = alertSkills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const alertCounts = {
    frontend: jobData.filter((job) => job.type === "Frontend").length,
    ai: jobData.filter((job) => job.type === "AI/ML").length,
    cybersecurity: jobData.filter((job) => job.type === "Cybersecurity").length,
    remote: jobData.filter((job) => job.location === alertLocation).length,
    react: jobData.filter((job) =>
      job.skills.some((skill) => skill.toLowerCase() === "react")
    ).length,
  };

  const careerPool = [
    "Frontend Developer",
    "UI Developer",
    "React Developer",
    "Web Designer",
    "AI/ML Engineer",
    "Cybersecurity Analyst",
  ];
  const recommendedCareers = advisorInput
    ? careerPool.filter((career) =>
        advisorInput.toLowerCase().includes("react") ||
        advisorInput.toLowerCase().includes("ai") ||
        advisorInput.toLowerCase().includes("machine learning") ||
        advisorInput.toLowerCase().includes("cybersecurity") ||
        career.toLowerCase().includes("developer")
      )
    : careerPool;

  const roadmap = careerRoadmaps[careerGoal] || careerRoadmaps["Frontend Developer"];

  const salaryPrediction = experienceYears <= 1 ? "3 - 6 LPA" : experienceYears <= 3 ? "4 - 8 LPA" : "6 - 12 LPA";

  return (
    <div className="job-container">
      <div className="header-row">
        <div>
          <h2>Job Suggestions & Career Hub</h2>
          <p>Find jobs, match skills, save roles, and plan your career.</p>
        </div>
        <button type="button" className="route-link" onClick={() => savedJobsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
          Saved Jobs
        </button>
      </div>

      <div className="top-panel">
        <div className="card highlight-card">
          <h3>Job Alerts</h3>
          <p>Skills: {savedAlertSkills.join(", ") || "Any"}</p>
          <p>Location: {alertLocation}</p>
          <div className="alert-badges">
            <span>New Frontend jobs: {alertCounts.frontend}</span>
            <span>New AI/ML jobs: {alertCounts.ai}</span>
            <span>New Cybersecurity jobs: {alertCounts.cybersecurity}</span>
            <span>Remote jobs: {alertCounts.remote}</span>
            <span>React jobs: {alertCounts.react}</span>
          </div>
        </div>

        <div className="card highlight-card">
          <h3>Email Notifications</h3>
          <p>{emailStatus}</p>
          <p>
            Subject: <strong>{emailSubject}</strong>
          </p>
          <p>
            Body: <strong>{emailBody}</strong>
          </p>
          <button className="notify-btn" onClick={handleEnableEmailAlerts}>
            {emailEnabled ? "Disable Email Alerts" : "Enable Email Alerts"}
          </button>
          {lastAppliedJob && (
            <p style={{ marginTop: "12px", color: "#0f172a" }}>
              Last applied: {lastAppliedJob.title} at {lastAppliedJob.company}
            </p>
          )}
        </div>

        <div className="card highlight-card">
          <h3>Contact Details for Applications</h3>
          <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "16px" }}>
            Enter your email & phone to receive notifications when you apply
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  localStorage.setItem("userEmail", e.target.value);
                }}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #dde5ef", background: "#f8fafc", fontSize: "0.95rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>Phone Number</label>
              <input
                type="tel"
                placeholder="+91 9XXXXXXXXX"
                value={userPhone}
                onChange={(e) => {
                  setUserPhone(e.target.value);
                  localStorage.setItem("userPhone", e.target.value);
                }}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #dde5ef", background: "#f8fafc", fontSize: "0.95rem" }}
              />
            </div>
          </div>
          {userEmail && userPhone && (
            <p style={{ marginTop: "12px", color: "#10b981", fontSize: "0.9rem", fontWeight: "600" }}>
              ✓ Ready to receive notifications
            </p>
          )}
        </div>
      </div>

      <div className="filters-row">
        <div className="filter-card">
          <label>Saved Alert Skills</label>
          <input
            value={alertSkills}
            onChange={(e) => setAlertSkills(e.target.value)}
            placeholder="React, JavaScript"
          />
        </div>
        <div className="filter-card">
          <label>Job Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option>All</option>
            <option>Remote</option>
            <option>Noida</option>
            <option>Delhi</option>
            <option>Bangalore</option>
          </select>
        </div>
        <div className="filter-card">
          <label>Job Type</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>Full Stack</option>
            <option>AI/ML</option>
            <option>Cybersecurity</option>
            <option>Data Entry</option>
          </select>
        </div>
      </div>

      <div className="upload-panel">
        <div className="card resume-card">
          <h3>Resume Upload</h3>
          <input type="file" accept=".pdf" onChange={handleResumeUpload} />
          <p>
            Uploaded skills will be extracted automatically and used for match score
            calculation.
          </p>
          {extractedSkills.length > 0 && (
            <div className="extracted-skills">
              Extracted Skills: {extractedSkills.join(", ")}
            </div>
          )}
        </div>

        <div className="card advisor-card">
          <h3>AI Career Advisor</h3>
          <input
            placeholder="Enter skills like React, HTML, CSS"
            value={advisorInput}
            onChange={(e) => setAdvisorInput(e.target.value)}
          />
          <div className="recommendations">
            <p>Recommended Careers:</p>
            {recommendedCareers.map((career) => (
              <span key={career}>? {career}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="trending-skills">
        <h3>Trending Skills</h3>
        <div>
          {trendingSkills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      <div className="job-grid">
        {filteredJobs.map((job) => {
          const matchScore = calculateMatch(job.skills, userSkillsArray);
          const jobStatus = appliedJobs[job.id]?.status || job.status;
          return (
            <div key={job.id} className="job-card">
              <div className="job-card-top">
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                </div>
                <button
                  className={`status-pill status-${jobStatus.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => handleApplyClick(job)}
                  style={{ cursor: "pointer", border: "none", background: "inherit", padding: "8px 14px", borderRadius: "999px" }}
                >
                  {jobStatus}
                </button>
              </div>

              <p className="job-meta">{job.location} • {job.type}</p>

              <div className="match-bar">
                <div className="match-label">Match Score: {matchScore}%</div>
                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
              </div>

              <div className="portal-links">
                {job.portals.map((portal, index) => (
                  <a
                    key={index}
                    href={portal.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {portal.name}
                  </a>
                ))}
              </div>

              <div className="skills-list">
                {job.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <div className="card-footer">
                <div className="salary">Expected Salary: {job.salaryRange}</div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="save-btn" onClick={() => handleSaveJob(job)}>
                    Save
                  </button>
                  <button className="notify-btn" onClick={() => handleApplyClick(job)}>
                    Apply Now
                  </button>
                </div>
              </div>

              <div className="interview-section">
                <p>Interview Questions</p>
                <div className="interview-links">
                  <a href="https://www.google.com/search?q=React+interview+questions" target="_blank" rel="noreferrer">React Interview Questions</a>
                  <a href="https://www.google.com/search?q=Frontend+MCQs" target="_blank" rel="noreferrer">Frontend MCQs</a>
                  <a href="https://www.google.com/search?q=Coding+questions" target="_blank" rel="noreferrer">Coding Questions</a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bottom-panels">
        <div className="card roadmap-card">
          <h3>Career Roadmap Generator</h3>
          <select value={careerGoal} onChange={(e) => setCareerGoal(e.target.value)}>
            {Object.keys(careerRoadmaps).map((goal) => (
              <option value={goal} key={goal}>{goal}</option>
            ))}
          </select>
          <ol>
            {roadmap.map((step, index) => (
              <li key={step}>Step {index + 1} ? {step}</li>
            ))}
          </ol>
        </div>

        <div className="card salary-card">
          <h3>Salary Prediction</h3>
          <label>Experience (years)</label>
          <input
            type="number"
            min="0"
            value={experienceYears}
            onChange={(e) => setExperienceYears(Number(e.target.value))}
          />
          <p>Expected Salary: {salaryPrediction}</p>
        </div>
      </div>

      <div className="saved-section" ref={savedJobsRef}>
        <h3>Saved Jobs</h3>
        {savedJobs.length === 0 ? (
          <p>No saved jobs yet. Save a role to track it here.</p>
        ) : (
          savedJobs.map((job, i) => (
            <div key={i} className="saved-job-row">
              <div>
                <strong>{job.title}</strong> at {job.company}
              </div>
              <button className="remove-btn" onClick={() => handleRemoveSavedJob(job.id)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {showApplyModal && selectedJobForApply && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {selectedJobForApply.title}</h2>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>{selectedJobForApply.company} • {selectedJobForApply.location}</h3>
                <p style={{ color: "#64748b" }}>Salary: {selectedJobForApply.salaryRange}</p>
              </div>

              <div className="modal-section">
                <label>Application Status</label>
                <select 
                  value={applicationStatus} 
                  onChange={(e) => setApplicationStatus(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #dde5ef" }}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="modal-section">
                <h4 style={{ color: "#dc2626", marginBottom: "12px" }}>📧 Notification Details</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>Email Address *</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #dde5ef", background: "#f8fafc", fontSize: "0.95rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 9XXXXXXXXX"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #dde5ef", background: "#f8fafc", fontSize: "0.95rem" }}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4>Apply through Job Portals</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginTop: "12px" }}>
                  {selectedJobForApply.portals.map((portal, idx) => (
                    <a
                      key={idx}
                      href={portal.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px 14px",
                        background: "#eff6ff",
                        borderRadius: "12px",
                        color: "#1d4ed8",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        border: "1px solid #dbeafe",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#dbeafe";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#eff6ff";
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      {portal.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h4>Required Skills</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                  {selectedJobForApply.skills.map((skill) => (
                    <span key={skill} style={{ background: "#f8fafc", padding: "8px 14px", borderRadius: "999px", fontSize: "0.9rem", border: "1px solid #e2e8f0" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="remove-btn" onClick={() => setShowApplyModal(false)} disabled={notificationSending}>
                Cancel
              </button>
              <button 
                className="notify-btn" 
                onClick={handleSubmitApplication}
                disabled={notificationSending || !userEmail || !userPhone}
                style={{ opacity: (notificationSending || !userEmail || !userPhone) ? 0.6 : 1, cursor: (notificationSending || !userEmail || !userPhone) ? "not-allowed" : "pointer" }}
              >
                {notificationSending ? "Sending notification..." : "Confirm Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
