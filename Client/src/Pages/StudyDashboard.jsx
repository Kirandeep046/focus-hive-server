import { useState, useEffect } from "react";
import "./StudyDashboard.css";

function StudyDashboard() {

  // =====================
  // 📚 SUBJECT DATA
  // =====================
  const [subject, setSubject] = useState("Math");

  const subjects = ["Math", "Physics", "Chemistry", "Coding"];

  const tasks = {
    Math: ["Algebra", "Calculus", "Revision"],
    Physics: ["Kinematics", "Laws of Motion"],
    Chemistry: ["Organic", "Periodic Table"],
    Coding: ["React", "DSA", "JavaScript"]
  };

  const [completed, setCompleted] = useState({
    Math: 2,
    Physics: 1,
    Chemistry: 0,
    Coding: 1
  });

  // =====================
  // 🔥 PROGRESS TRACKER
  // =====================
  const totalTasks = tasks[subject].length;
  const doneTasks = completed[subject];
  const progress = Math.round((doneTasks / totalTasks) * 100);

  // =====================
  // 🔥 STREAK SYSTEM
  // =====================
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem("streak");
    if (saved) setStreak(Number(saved));
  }, []);

  const increaseStreak = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("streak", newStreak);
  };

  // =====================
  // ⏱️ POMODORO TIMER
  // =====================
  const [time, setTime] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="dashboard">

      {/* ===================== */}
      {/* 📊 PROGRESS SECTION */}
      {/* ===================== */}
      <div className="card">
        <h2>📊 Daily Progress</h2>
        <p>{doneTasks}/{totalTasks} tasks completed</p>

        <div className="progress-bar">
          <div style={{ width: `${progress}%` }}></div>
        </div>

        <h3>{progress}% Completed</h3>
      </div>

      {/* ===================== */}
      {/* 🔥 STREAK */}
      {/* ===================== */}
      <div className="card">
        <h2>🔥 Streak</h2>
        <h1>{streak} Days</h1>
        <button onClick={increaseStreak}>Increase Streak</button>
      </div>

      {/* ===================== */}
      {/* ⏱️ POMODORO TIMER */}
      {/* ===================== */}
      <div className="card">
        <h2>⏱️ Focus Timer</h2>
        <h1>{formatTime(time)}</h1>

        <button onClick={() => setRunning(true)}>Start</button>
        <button onClick={() => setRunning(false)}>Pause</button>
      </div>

      {/* ===================== */}
      {/* 📚 SUBJECT TABS */}
      {/* ===================== */}
      <div className="card">
        <h2>📚 Subjects</h2>

        <div className="tabs">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubject(sub)}
              className={subject === sub ? "active" : ""}
            >
              {sub}
            </button>
          ))}
        </div>

        <ul>
          {tasks[subject].map((t, i) => (
            <li key={i}>✔ {t}</li>
          ))}
        </ul>
      </div>

      {/* ===================== */}
      {/* 📝 NOTES SYSTEM */}
      {/* ===================== */}
      <div className="card">
        <h2>📝 Quick Notes</h2>
        <textarea placeholder="Write notes here..." />
      </div>

    </div>
  );
}

export default StudyDashboard;