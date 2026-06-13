import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../Services/api";
import "./NotesPage.css";

function NotesPage() {
  const { subject, chapter: urlChapter } = useParams();
  const navigate = useNavigate();

  const [subjectData, setSubjectData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [activeTab, setActiveTab] = useState("introduction");
  const [activePdfUrl, setActivePdfUrl] = useState(null);

  const subjectName = subject ? subject.toUpperCase() : "SUBJECT";
  const hasPlan = !!localStorage.getItem("focushive_plan");

  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // 1. Fetch Subject & Notes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // 📚 Fetch Subject details
        const res = await api.get(
          `/subjects/name/${encodeURIComponent(subject)}`
        );
        setSubjectData(res.data);

        const dbChapters = res.data?.chapters || [];
        const chapterList = dbChapters.map((ch) => ch.title);
        setChapters(chapterList);

        // 📄 Fetch Notes (PDF files list)
        const notesRes = await api.get(
          `/notes/subject/${encodeURIComponent(subject)}`
        );
        setNotes(notesRes.data);

      } catch (err) {
        console.error(err);
        setError("Failed to load study materials ❌ Check connection");
      } finally {
        setLoading(false);
      }
    };

    if (subject) {
      loadData();
    }
  }, [subject]);

  // 2. Synchronize selected chapter with URL changes
  useEffect(() => {
    if (!loading && chapters.length > 0) {
      if (urlChapter) {
        if (urlChapter === "previous-year-papers") {
          setSelectedChapter("Previous Year Papers");
        } else {
          // Find the chapter title that matches the url slug
          const matched = chapters.find(
            (ch) => createSlug(ch) === urlChapter
          );
          if (matched) {
            setSelectedChapter(matched);
          } else {
            setSelectedChapter("all");
          }
        }
      } else {
        setSelectedChapter("all");
      }
    }
  }, [urlChapter, chapters, loading]);

  // 3. Find current chapter details from DB Subject schema
  const currentChapterDetails = useMemo(() => {
    if (!subjectData || !subjectData.chapters || selectedChapter === "all" || selectedChapter === "Previous Year Papers") {
      return null;
    }
    return subjectData.chapters.find(
      (ch) => ch.title.toLowerCase() === selectedChapter.toLowerCase()
    );
  }, [subjectData, selectedChapter]);

  // 4. Filter PDF notes for selected chapter or PYQ section
  const currentNotes = useMemo(() => {
    if (selectedChapter === "all") {
      // Return everything EXCEPT previous year papers
      return notes.filter((n) => n.chapterTitle !== "Previous Year Papers");
    }
    return notes.filter(
      (note) =>
        note.chapterTitle?.toLowerCase() === selectedChapter.toLowerCase()
    );
  }, [notes, selectedChapter]);

  // Handler to navigate when choosing a chapter in the sidebar
  const handleSelectChapter = (chName) => {
    if (chName === "all") {
      navigate(`/notes/${subject}`);
    } else if (chName === "Previous Year Papers") {
      navigate(`/notes/${subject}/previous-year-papers`);
    } else {
      navigate(`/notes/${subject}/${createSlug(chName)}`);
    }
  };

  if (!subject) {
    return (
      <div className="notes-container">
        <h2>Invalid Subject ❌</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="notes-layout-wrapper">
      {/* 1. LEFT SIDEBAR */}
      <aside className="notes-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="back-link">
            ← Home
          </Link>
          <h2 className="subject-title-h2">{subjectName}</h2>
          <span className="course-badge">FocusHive AI Course</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${selectedChapter === "all" ? "active" : ""}`}
            onClick={() => handleSelectChapter("all")}
          >
            📚 Subject Overview
          </button>

          <div className="nav-divider">CHAPTERS</div>

          {chapters.map((ch, idx) => (
            <button
              key={idx}
              className={`nav-item ${selectedChapter === ch ? "active" : ""} ${idx > 0 && !hasPlan ? "locked-nav-item" : ""}`}
              onClick={() => handleSelectChapter(ch)}
            >
              <span className="chapter-num">{idx + 1}</span> {ch}
              {idx > 0 && !hasPlan && <span className="lock-icon">🔒</span>}
            </button>
          ))}

          <div className="nav-divider">EXAM PAPERS</div>
          <button
            className={`nav-item ${selectedChapter === "Previous Year Papers" ? "active" : ""}`}
            onClick={() => handleSelectChapter("Previous Year Papers")}
          >
            📑 Previous Year Papers
          </button>
        </nav>
      </aside>

      {/* 2. RIGHT CONTENT AREA */}
      <main className="notes-main-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading course resources from FocusHive database...</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry Connection</button>
          </div>
        )}

        {!loading && !error && (
          <div className="content-inner">
            {/* --- CASE A: OVERVIEW --- */}
            {selectedChapter === "all" && (
              <div className="overview-container">
                <div className="overview-welcome-card">
                  <h1>Welcome to {subjectName} Study Guide 📘</h1>
                  <p>
                    Select a chapter from the left sidebar to access detailed explanations, core formulas, 
                    solved Previous Year Questions (PYQs), and multi-page printable study PDFs.
                  </p>
                  <div className="subject-stats">
                    <div className="stat-pill"><strong>{chapters.length}</strong> Chapters</div>
                    <div className="stat-pill"><strong>{notes.length}</strong> PDF Booklets</div>
                    <div className="stat-pill">Verified Syllabus</div>
                  </div>
                </div>

                <h2>📚 Course Syllabus Overview</h2>
                <div className="syllabus-grid">
                  {chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="syllabus-item-card"
                      onClick={() => handleSelectChapter(ch)}
                    >
                      <span className="syllabus-num">0{idx + 1}</span>
                      <h4>{ch}</h4>
                      <p>View complete lecture notes, derivations, and study PDFs.</p>
                      <span className="syllabus-arrow">Explore →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- CASE B: PREVIOUS YEAR PAPERS --- */}
            {selectedChapter === "Previous Year Papers" && (
              <div className="pyq-container">
                <div className="pyq-header-card">
                  <h1>📑 Solved Previous Year Question Papers</h1>
                  <p>
                    Prepare for exams by practicing with official solved papers. View online using the
                    integrated viewer or download them for offline reference.
                  </p>
                </div>

                <h2>Papers list</h2>
                {currentNotes.length > 0 ? (
                  <div className="notes-list-grid">
                    {currentNotes.map((note) => {
                      const rawUrl = note.pdfUrl || note.fileUrl;
                      const fullUrl = rawUrl
                        ? (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
                            ? rawUrl
                            : `http://localhost:5000${rawUrl}`)
                        : "";

                      return (
                        <div key={note._id} className="note-item-card pyq-card">
                          <div className="note-card-header">
                            <span className="pdf-badge pyq-badge">EXAM PAPER</span>
                            <span className="chapter-badge">15 Pages</span>
                          </div>
                          <h3 className="note-card-title">{note.title}</h3>
                          <p className="note-card-desc">Official solved university exam paper containing multiple choice, short answer, and long derivations.</p>
                          <div className="note-card-actions">
                            {fullUrl ? (
                              <>
                                <button className="action-btn preview-btn" onClick={() => setActivePdfUrl(fullUrl)}>
                                  👁️ View Paper
                                </button>
                                <a href={fullUrl} target="_blank" rel="noreferrer" className="action-btn download-btn">
                                  ⬇️ Download
                                </a>
                              </>
                            ) : (
                              <span className="unavailable-txt">Paper PDF unavailable</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-notes-card">No exam papers uploaded yet for this subject.</div>
                )}
              </div>
            )}

            {/* --- CASE C: SPECIFIC CHAPTER --- */}
            {selectedChapter !== "all" && selectedChapter !== "Previous Year Papers" && (() => {
              const chapterIdx = chapters.findIndex(
                (ch) => ch.toLowerCase() === selectedChapter.toLowerCase()
              );
              const isLocked = chapterIdx > 0 && !hasPlan;

              if (isLocked) {
                return (
                  <div className="chapter-content-container">
                    <div className="chapter-content-header">
                      <div className="header-meta"><span className="ch-index-tag">CHAPTER STUDY RESOURCE</span></div>
                      <h1>{selectedChapter}</h1>
                    </div>
                    <div className="locked-chapter-card">
                      <div className="locked-card-top">
                        <div className="locked-icon-wrap">🔒</div>
                        <h2>This Chapter is Locked</h2>
                        <p className="locked-sub">This chapter is available for premium members only. Upgrade your plan to unlock all chapters, PDFs, and resources.</p>
                      </div>
                      <div className="locked-card-bottom">
                        <div className="locked-perks">
                          <span className="locked-perk-pill">✅ All Chapters</span>
                          <span className="locked-perk-pill">📄 PDF Booklets</span>
                          <span className="locked-perk-pill">📝 Solved PYQs</span>
                          <span className="locked-perk-pill">⬇️ Downloads</span>
                        </div>
                        <button className="upgrade-btn" onClick={() => { window.location.href = "/plans"; }}>Upgrade to Premium →</button>
                        <span className="free-hint">🔓 Chapter 1 is always free — no account needed</span>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
              <div className="chapter-content-container">
                <div className="chapter-content-header">
                  <div className="header-meta">
                    <span className="ch-index-tag">CHAPTER STUDY RESOURCE</span>
                  </div>
                  <h1>{selectedChapter}</h1>
                </div>

                {/* PDF note attachment banner */}
                {currentNotes.length > 0 && (
                  <div className="chapter-pdf-banner-card">
                    <div className="pdf-banner-info">
                      <div className="pdf-icon-circle">📄</div>
                      <div>
                        <h4>Exhaustive Study PDF available (50 Pages Booklet)</h4>
                        <p>Detailed explanations, derivations, graphs, and full question bank ready for download.</p>
                      </div>
                    </div>
                    <div className="pdf-banner-actions">
                      <button
                        className="pdf-banner-btn preview-btn-primary"
                        onClick={() => {
                          const rawUrl = currentNotes[0].pdfUrl || currentNotes[0].fileUrl;
                          const fullUrl = rawUrl
                            ? (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
                                ? rawUrl
                                : `http://localhost:5000${rawUrl}`)
                            : "";
                          if (fullUrl) setActivePdfUrl(fullUrl);
                        }}
                      >
                        👁️ Open Booklet
                      </button>
                      <a
                        href={
                          (currentNotes[0].pdfUrl || currentNotes[0].fileUrl)?.startsWith("http")
                            ? (currentNotes[0].pdfUrl || currentNotes[0].fileUrl)
                            : `http://localhost:5000${currentNotes[0].pdfUrl || currentNotes[0].fileUrl}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="pdf-banner-btn download-btn-outline"
                      >
                        ⬇️ Download
                      </a>
                    </div>
                  </div>
                )}

                {/* THEORY switch tabs */}
                {currentChapterDetails ? (
                  <div className="theory-block-container">
                    <div className="theory-tabs-header">
                      <button
                        className={`theory-tab-btn ${activeTab === "introduction" ? "active" : ""}`}
                        onClick={() => setActiveTab("introduction")}
                      >
                        📖 Introduction
                      </button>
                      <button
                        className={`theory-tab-btn ${activeTab === "concept" ? "active" : ""}`}
                        onClick={() => setActiveTab("concept")}
                      >
                        💡 Core Concepts
                      </button>
                      <button
                        className={`theory-tab-btn ${activeTab === "pyq" ? "active" : ""}`}
                        onClick={() => setActiveTab("pyq")}
                      >
                        📝 Solved PYQs
                      </button>
                    </div>

                    <div className="theory-content-box">
                      {activeTab === "introduction" && (
                        <div className="theory-text-content">
                          <h3>Chapter Overview</h3>
                          <p>{currentChapterDetails.sections?.introduction || "No introduction text seeded."}</p>
                        </div>
                      )}

                      {activeTab === "concept" && (
                        <div className="theory-text-content">
                          <h3>Core Theoretical Concepts</h3>
                          <p>{currentChapterDetails.sections?.concept || "No concept text seeded."}</p>
                        </div>
                      )}

                      {activeTab === "pyq" && (
                        <div className="theory-text-content">
                          <h3>Previous Year Solved Exam Questions</h3>
                          <p>{currentChapterDetails.sections?.pyq || "No solved PYQs seeded."}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="empty-notes-card">Detailed theoretical description is missing. Please download the PDF above.</div>
                )}
              </div>
            );
            })()}
          </div>
        )}
      </main>

      {/* 3. PDF VIEWER MODAL */}
      {activePdfUrl && (
        <div className="pdf-modal-overlay" onClick={() => setActivePdfUrl(null)}>
          <div className="pdf-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3>Study Booklet Reader ({selectedChapter})</h3>
              <button className="close-modal-btn" onClick={() => setActivePdfUrl(null)}>✕</button>
            </div>
            <div className="pdf-modal-body">
              <iframe
                src={`${activePdfUrl}#toolbar=1`}
                title="PDF Viewer"
                width="100%"
                height="100%"
                style={{ border: "none", borderRadius: "8px" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotesPage;