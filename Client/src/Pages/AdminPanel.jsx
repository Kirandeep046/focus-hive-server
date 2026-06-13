import { useState } from "react";
import Subjects from "./Subjects";
import Notes from "./Notes";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>Subjects</h2>
        <Subjects
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
        />
      </aside>

      <main className="main">
        {!selectedSubject ? (
          <div className="admin-empty">
            <h2>Select a subject to view notes</h2>
            <p>Add or choose a subject from the left panel.</p>
          </div>
        ) : (
          <Notes subject={selectedSubject} />
        )}
      </main>
    </div>
  );
}
