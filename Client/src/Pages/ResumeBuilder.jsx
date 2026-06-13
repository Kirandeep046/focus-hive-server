import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResumeBuilder.css";

function ResumeBuilder() {
  const resumeRef = useRef();

  const initialResume = {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    objective: "",
    summary: "",
    education: "",
    skills: "",
    tools: "",
    experience: "",
    achievements: "",
    certifications: "",
    languages: "",
    linkedin: "",
    github: "",
    photo: "",
    projects: [""],
  };

  const [resume, setResume] = useState(initialResume);
  const [template, setTemplate] = useState("professional");
  const [resumeKey, setResumeKey] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) setResume(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resume));
  }, [resume]);

  const handleChange = (e) => {
    setResume({
      ...resume,
      [e.target.name]: e.target.value,
    });
  };

  const handleProjectChange = (index, value) => {
    const updated = [...resume.projects];
    updated[index] = value;
    setResume({ ...resume, projects: updated });
  };

  const addProject = () => {
    setResume({ ...resume, projects: [...resume.projects, ""] });
  };

  const removeProject = (index) => {
    const updated = resume.projects.filter((_, i) => i !== index);
    setResume({ ...resume, projects: updated });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume({
        ...resume,
        photo: URL.createObjectURL(file),
      });
    }
  };

  const formatList = (input = "") =>
    input
      .split(/[,\n;]/)
      .map((i) => i.trim())
      .filter(Boolean);

  const previewData = resume;

  const isResumeEmpty =
    !resume.name &&
    !resume.title &&
    !resume.email &&
    !resume.phone &&
    !resume.location &&
    !resume.summary &&
    !resume.education &&
    !resume.skills &&
    !resume.tools &&
    !resume.experience &&
    !resume.achievements &&
    !resume.certifications &&
    !resume.languages &&
    !resume.linkedin &&
    !resume.github &&
    resume.projects.every((p) => !p.trim());

  const downloadPDF = async () => {
    const canvas = await html2canvas(resumeRef.current, { scale: 2 });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    const filename = `${resume.name ? resume.name.toLowerCase().replace(/\s+/g, "-") : "resume"}-${Date.now()}.pdf`;
    pdf.save(filename);
    setDownloadMessage(`Downloaded ${filename}`);
    window.setTimeout(() => setDownloadMessage(""), 3800);
  };

  const getResumeScore = () => {
    let score = 0;
    if (resume.name) score += 5;
    if (resume.title) score += 5;
    if (resume.email) score += 10;
    if (resume.phone) score += 10;
    if (resume.location) score += 5;
    if (resume.summary) score += 10;
    if (resume.education) score += 10;
    if (resume.skills) score += 10;
    if (resume.tools) score += 5;
    if (resume.experience) score += 10;
    if (resume.achievements) score += 5;
    if (resume.certifications) score += 5;
    if (resume.languages) score += 5;
    if (resume.linkedin || resume.github) score += 5;
    if (resume.projects.some((p) => p.trim())) score += 5;
    return Math.min(score, 100);
  };

  const getAtsFeedback = () => {
    const score = getResumeScore();
    if (score >= 85) return "Excellent ATS compatibility.";
    if (score >= 70) return "Good ATS-friendly resume.";
    if (score >= 50) return "Fair — add more keywords and details.";
    return "Low ATS score — improve skills, experience, and contacts.";
  };

  const getAtsSuggestions = () => {
    const suggestions = [];
    if (!resume.summary) suggestions.push("Write a strong Professional Summary.");
    if (!resume.skills) suggestions.push("Add key skills in a comma-separated list.");
    if (!resume.experience) suggestions.push("Add experience with outcomes and technologies.");
    if (!resume.projects.some((p) => p.trim())) suggestions.push("Add at least one project or accomplishment.");
    if (!resume.email || !resume.phone) suggestions.push("Include contact details for recruiters.");
    return suggestions;
  };

  const resumeScore = getResumeScore();
  const atsFeedback = getAtsFeedback();

  const resetResume = () => {
    setResume(initialResume);
    localStorage.removeItem("resumeData");
    setResumeKey((prev) => prev + 1);
  };

  const editInCanva = () => {
    window.open("https://www.canva.com/create/resumes/", "_blank");
  };

  return (
    <div className="resume-builder-container">

      {/* LEFT FORM */}
      <div className="resume-form">
        <h2>Resume Builder</h2>

        <input name="name" placeholder="Full Name" value={resume.name} onChange={handleChange} />
        <input name="title" placeholder="Job Title" value={resume.title} onChange={handleChange} />

        <div className="field-grid">
          <input name="email" placeholder="Email" value={resume.email} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={resume.phone} onChange={handleChange} />
        </div>

        <div className="field-grid">
          <input name="location" placeholder="Location" value={resume.location} onChange={handleChange} />
          <input name="linkedin" placeholder="LinkedIn" value={resume.linkedin} onChange={handleChange} />
        </div>

        <input name="github" placeholder="GitHub" value={resume.github} onChange={handleChange} />

        <textarea name="objective" placeholder="Objective" value={resume.objective} onChange={handleChange} />
        <textarea name="summary" placeholder="Summary" value={resume.summary} onChange={handleChange} />

        <input name="education" placeholder="Education" value={resume.education} onChange={handleChange} />
        <input name="skills" placeholder="Skills (comma separated)" value={resume.skills} onChange={handleChange} />
        <input name="tools" placeholder="Tools" value={resume.tools} onChange={handleChange} />

        <textarea name="experience" placeholder="Experience" value={resume.experience} onChange={handleChange} />
        <textarea name="achievements" placeholder="Achievements" value={resume.achievements} onChange={handleChange} />

        <input name="certifications" placeholder="Certifications" value={resume.certifications} onChange={handleChange} />
        <input name="languages" placeholder="Languages" value={resume.languages} onChange={handleChange} />

        <input type="file" onChange={handlePhotoUpload} />

        <h3>Projects</h3>

        {resume.projects.map((p, i) => (
          <div className="project-row" key={i}>
            <input
              value={p}
              onChange={(e) => handleProjectChange(i, e.target.value)}
              placeholder="Project"
            />
            <button type="button" className="remove-btn" onClick={() => removeProject(i)}>
              Remove
            </button>
          </div>
        ))}

        <div className="button-row">
          <button type="button" onClick={addProject}>+ Add Project</button>
          <button type="button" onClick={resetResume}>New Resume</button>
          <button type="button" className="canva-btn" onClick={editInCanva}>
            Edit in Canva
          </button>
        </div>

        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
          <option value="professional">Professional</option>
          <option value="modern">Modern</option>
          <option value="clean">Clean</option>
          <option value="minimal">Minimal</option>
          <option value="creative">Creative</option>
        </select>

        <div className="ats-box">
          <div className="ats-score">
            <span>ATS Score</span>
            <strong>{resumeScore} / 100</strong>
          </div>
          <div className="ats-feedback">{atsFeedback}</div>
          {getAtsSuggestions().length > 0 && (
            <ul className="ats-suggestions">
              {getAtsSuggestions().map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="button-row">
          <button type="button" onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>

      {/* RIGHT PREVIEW */}
      <div ref={resumeRef} key={resumeKey} className={`resume-preview ${template}`}>

        {/* HEADER FIXED */}
        <div className="resume-header">
          <div className="profile-intro">
            {previewData.photo && (
              <img src={previewData.photo} className="profile-photo" />
            )}

            <div>
              <h1>{previewData.name || "Your Name"}</h1>
              <h3>{previewData.title || "Job Title"}</h3>
            </div>
          </div>

          {/* CLEAN SINGLE LINE CONTACT */}
          <div className="contact-line">
            {previewData.email && <span>{previewData.email}</span>}
            {previewData.phone && <span>{previewData.phone}</span>}
            {previewData.location && <span>{previewData.location}</span>}
          </div>
        </div>

        <div className="resume-columns">

          {/* MAIN */}
          <div className="main-column">
              <section>
              <h2>Summary</h2>
              <p>
                {previewData.summary ||
                  "Add a crisp summary that highlights your experience, strengths, and what you bring to the role."}
              </p>
            </section>

            <section>
              <h2>Experience</h2>
              {previewData.experience ? (
                <p>{previewData.experience}</p>
              ) : (
                <p className="section-placeholder">
                  Add your experience details to showcase your roles and impact.
                </p>
              )}
            </section>

            <section>
              <h2>Achievements</h2>
              {previewData.achievements ? (
                <p>{previewData.achievements}</p>
              ) : (
                <p className="section-placeholder">
                  Include achievements, awards, or measurable outcomes.
                </p>
              )}
            </section>

            <section>
              <h2>Education</h2>
              <p>
                {previewData.education ||
                  "Enter your education details, degree, institute and graduation year."}
              </p>
            </section>
          </div>

          {/* SIDEBAR FIXED */}
          <aside className="sidebar-column">

            <section>
              <h2>Skills</h2>
              {previewData.skills ? (
                <div className="chip-list">
                  {formatList(previewData.skills).map((s, i) => (
                    <span className="skill-chip" key={i}>{s}</span>
                  ))}
                </div>
              ) : (
                <p className="section-placeholder">Add your top skills here.</p>
              )}
            </section>

            <section>
              <h2>Tools</h2>
              {previewData.tools ? (
                <div className="chip-list">
                  {formatList(previewData.tools).map((t, i) => (
                    <span className="skill-chip" key={i}>{t}</span>
                  ))}
                </div>
              ) : (
                <p className="section-placeholder">List the tools or technologies you use.</p>
              )}
            </section>

            <section>
              <h2>Projects</h2>
              {previewData.projects.some((p) => p) ? (
                <ul>
                  {previewData.projects.map((p, i) =>
                    p ? <li key={i}>{p}</li> : null
                  )}
                </ul>
              ) : (
                <p className="section-placeholder">Add project titles or brief project descriptions.</p>
              )}
            </section>

            <section>
              <h2>Links</h2>
              {previewData.linkedin || previewData.github ? (
                <>
                  {previewData.linkedin && <p>{previewData.linkedin}</p>}
                  {previewData.github && <p>{previewData.github}</p>}
                </>
              ) : (
                <p className="section-placeholder">
                  Add your LinkedIn or GitHub URLs here.
                </p>
              )}
            </section>

          </aside>

        </div>

        <div className="preview-actions">
          <button type="button" onClick={downloadPDF} disabled={isResumeEmpty}>
            Download PDF
          </button>
          <button type="button" onClick={resetResume} className="secondary-btn">
            New Resume
          </button>
          {downloadMessage && (
            <div className="download-toast">{downloadMessage}</div>
          )}
          {isResumeEmpty && (
            <p className="preview-hint">
              Start filling in your resume details above, then download the updated resume.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;