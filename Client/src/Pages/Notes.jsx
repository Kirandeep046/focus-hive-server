import { useEffect, useState } from "react";
import api from "../Services/api";
import "./Notes.css";

export default function Notes({ subject }) {
  const [notes, setNotes] = useState([]);
  const [userRole, setUserRole] = useState("");

  const [chapterTitle, setChapterTitle] =
    useState("");

  const [introduction, setIntroduction] =
    useState("");

  const [concept, setConcept] =
    useState("");

  const [pyq, setPyq] =
    useState("");

  const [pdf, setPdf] =
    useState(null);

  const [selectedChapter, setSelectedChapter] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState("introduction");

  // LOAD NOTES
  const loadNotes = async () => {
    try {
      const res = await api.get(
        `/notes/${subject._id}`
      );

      setNotes(res.data);

      if (res.data.length > 0) {
        setSelectedChapter(res.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const role=localStorage.getItem("role");
    setUserRole(role);
    if (subject?._id) {
      loadNotes();
    }
  }, [subject]);

  // ADD NOTE
  const addNote = async (e) => {
    e.preventDefault();

    try {
      const formData =
        new FormData();

      formData.append(
        "subjectId",
        subject._id
      );

      formData.append(
        "chapterTitle",
        chapterTitle
      );

      formData.append(
        "introduction",
        introduction
      );

      formData.append(
        "concept",
        concept
      );

      formData.append("pyq", pyq);

      formData.append("pdf", pdf);

      await api.post(
        "/notes",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Notes Uploaded");

      setChapterTitle("");
      setIntroduction("");
      setConcept("");
      setPyq("");
      setPdf(null);

      loadNotes();
    } catch (error) {
      console.log(error);
      alert("Upload Failed");
    }
  };

  return (
    <div className="notes-page">
      <h2>
        {subject.name} Notes
      </h2>

      {/* FORM */}
      {userRole === "admin" && (
  <form
    className="note-form"
    onSubmit={addNote}
  >
    <input
      type="text"
      placeholder="Chapter Title"
      value={chapterTitle}
      onChange={(e) =>
        setChapterTitle(e.target.value)
      }
      required
    />

    <textarea
      placeholder="Introduction"
      value={introduction}
      onChange={(e) =>
        setIntroduction(e.target.value)
      }
    />

    <textarea
      placeholder="Concept"
      value={concept}
      onChange={(e) =>
        setConcept(e.target.value)
      }
    />

    <textarea
      placeholder="PYQ"
      value={pyq}
      onChange={(e) =>
        setPyq(e.target.value)
      }
    />

    <input
      type="file"
      accept=".pdf"
      onChange={(e) =>
        setPdf(e.target.files[0])
      }
    />

    <button type="submit">
      Upload Notes
    </button>
  </form>
)}

      {/* CHAPTER BUTTONS */}
      <div className="chapter-list">
        {notes.map((note) => (
          <button
            key={note._id}
            onClick={() =>
              setSelectedChapter(
                note
              )
            }
          >
            {note.chapterTitle}
          </button>
        ))}
      </div>

      {/* NOTES DISPLAY */}
      {selectedChapter && (
        <div className="notes-box">

          <div className="tabs">
            <button
              onClick={() =>
                setActiveTab(
                  "introduction"
                )
              }
            >
              Introduction
            </button>

            <button
              onClick={() =>
                setActiveTab(
                  "concept"
                )
              }
            >
              Concept
            </button>

            <button
              onClick={() =>
                setActiveTab("pyq")
              }
            >
              PYQ
            </button>
          </div>

          <div className="notes-content">
            {
              selectedChapter
                .sections?.[
                activeTab
              ]
            }
          </div>

          {/* PDF BUTTON */}
          {selectedChapter.pdfUrl && (
            <a
              href={`http://localhost:5000${selectedChapter.pdfUrl}`}
              target="_blank"
              rel="noreferrer"
              className="pdf-btn"
            >
              Open PDF
            </a>
          )}
        </div>
      )}

      {notes.length === 0 && (
        <p>No notes yet.</p>
      )}
    </div>
  );
}