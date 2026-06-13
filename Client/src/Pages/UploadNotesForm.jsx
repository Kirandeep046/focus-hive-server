import { useState } from "react";
import api from "../Services/api";

export default function UploadNotesForm({
  subjectName,
  subjectId,
  onUploadSuccess,
}) {
  const [noteTitle, setNoteTitle] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!noteTitle || !chapterTitle || !pdfFile) {
      alert("Please fill all fields and select PDF.");
      return;
    }

    try {
      setUploading(true);

      let targetSubjectId = subjectId;

      // 🔍 fallback: subjectId missing ho to fetch from DB
      if (!targetSubjectId || targetSubjectId === "undefined") {
        const resSubs = await api.get("/subjects");

        const match = resSubs.data.find(
          (s) => s.name.toLowerCase() === subjectName.toLowerCase()
        );

        if (match) {
          targetSubjectId = match._id;
        } else {
          alert(`Subject '${subjectName}' not found in database`);
          setUploading(false);
          return;
        }
      }

      const formData = new FormData();

      // ⚠️ MUST MATCH BACKEND FIELD NAMES
      formData.append("subjectId", targetSubjectId);
      formData.append("chapterTitle", chapterTitle);
      formData.append("title", noteTitle);
      formData.append("pdf", pdfFile);

      const response = await api.post("/notes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Notes uploaded successfully 🎉");

      // reset
      setNoteTitle("");
      setChapterTitle("");
      setPdfFile(null);

      if (onUploadSuccess) onUploadSuccess();

    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
      }}
    >
      <h3>📁 Upload Notes</h3>

      <form onSubmit={handleFormSubmit}>
        {/* TITLE */}
        <input
          type="text"
          placeholder="Note Title"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          required
        />

        <br />

        {/* CHAPTER TITLE */}
        <input
          type="text"
          placeholder="Chapter Title"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
          required
        />

        <br />

        {/* PDF */}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          required
        />

        <br />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Notes"}
        </button>
      </form>
    </div>
  );
}