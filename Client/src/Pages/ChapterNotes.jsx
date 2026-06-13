import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Services/api";
import "./ChapterNotes.css";

const sectionLabels = {
  introduction: "Introduction",
  concept: "Concept",
  pyq: "Previous Year Questions",
};

function ChapterNotes() {
  const { subject, chapter } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePdfUrl, setActivePdfUrl] = useState(null);

  const chapterTitle = useMemo(
    () => chapter.replaceAll("-", " "),
    [chapter]
  );

  useEffect(() => {
    const loadChapterNotes = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          `/notes/chapter/${encodeURIComponent(subject)}/${encodeURIComponent(chapter)}`
        );

        setData(res.data);
      } catch (err) {
        console.error("Unable to fetch chapter notes:", err);
        setError("Notes not found for this chapter.");
      } finally {
        setLoading(false);
      }
    };

    loadChapterNotes();
  }, [subject, chapter]);

  const chapterSections = data?.chapter?.sections || {};
  const extraNotes = data?.notes || [];
  const hasChapterSections = Object.values(chapterSections).some(Boolean);

  return (
    <div className="chapter-page">
      <div className="chapter-header">
        <h1>{(data?.subject?.name || subject).toUpperCase()}</h1>
        <h2>{(data?.chapter?.title || chapterTitle).toUpperCase()}</h2>
      </div>

      {loading && <div className="notes-box">Loading notes...</div>}

      {!loading && error && <div className="notes-box empty">{error}</div>}

      {!loading && !error && (
        <div className="chapter-notes-layout">
          {hasChapterSections &&
            Object.entries(sectionLabels).map(([key, label]) => {
              const content = chapterSections[key];

              if (!content) return null;

              return (
                <section key={key} className="notes-box">
                  <h3>{label}</h3>
                  <p>{content}</p>
                </section>
              );
            })}

          {extraNotes.map((note) => {
            const rawUrl = note.pdfUrl || note.fileUrl;
            const fullUrl = rawUrl
              ? (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
                  ? rawUrl
                  : `http://localhost:5000${rawUrl}`)
              : "";

            return (
              <section key={note._id} className="notes-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                  <h3 style={{ margin: 0 }}>{note.chapterTitle || note.title}</h3>
                  {fullUrl && <span style={{ padding: "4px 8px", background: "#fee2e2", color: "#ef4444", fontSize: "11px", fontWeight: "bold", borderRadius: "6px" }}>PDF NOTES AVAILABLE</span>}
                </div>

                {note.sections?.introduction && (
                  <>
                    <h4>Introduction</h4>
                    <p>{note.sections.introduction}</p>
                  </>
                )}

                {note.sections?.concept && (
                  <>
                    <h4>Concept</h4>
                    <p>{note.sections.concept}</p>
                  </>
                )}

                {note.sections?.pyq && (
                  <>
                    <h4>Previous Year Questions</h4>
                    <p>{note.sections.pyq}</p>
                  </>
                )}

                {note.content && <p>{note.content}</p>}

                {fullUrl && (
                  <div style={{ display: "flex", gap: "12px", marginTop: "20px", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
                    <button
                      onClick={() => setActivePdfUrl(fullUrl)}
                      style={{
                        padding: "8px 16px",
                        background: "#4f46e5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "14px",
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(79, 70, 229, 0.15)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      👁️ Preview Notes PDF
                    </button>
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "8px 16px",
                        background: "#f1f5f9",
                        color: "#334155",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "14px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease"
                      }}
                    >
                      ⬇️ Download PDF
                    </a>
                  </div>
                )}
              </section>
            );
          })}

          {!hasChapterSections && extraNotes.length === 0 && (
            <div className="notes-box empty">No notes added yet.</div>
          )}
        </div>
      )}

      {/* PDF VIEWER MODAL */}
      {activePdfUrl && (
        <div className="pdf-modal-overlay" onClick={() => setActivePdfUrl(null)}>
          <div className="pdf-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3>Study Resource Viewer</h3>
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

export default ChapterNotes;
