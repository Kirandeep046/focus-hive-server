import { useEffect, useState } from "react";
import api from "../Services/api";
import "./Subjects.css";

export default function Subjects({ selectedSubject, setSelectedSubject }) {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");

  const loadSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Unable to fetch subjects:", error);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const addSubject = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await api.post("/subjects", { name });
      setName("");
      loadSubjects();
    } catch (error) {
      console.error("Unable to add subject:", error);
    }
  };

  return (
    <div className="subjects-panel">
      <form className="subject-form" onSubmit={addSubject}>
        <input
          value={name}
          placeholder="Add subject"
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="subject-list">
        {subjects.map((subject) => (
          <button
            key={subject._id}
            className={selectedSubject?._id === subject._id ? "active" : ""}
            onClick={() => setSelectedSubject(subject)}
            type="button"
          >
            {subject.name || subject.subject}
          </button>
        ))}
      </div>
    </div>
  );
}
