import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TodaysGoalDetails from "../Components/TodaysGoalDetails";
import FocusTimer from "./FocusTimer";
import api from "../Services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [streak] = useState(7);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showFocusTimer, setShowFocusTimer] = useState(false);

  const [goalTasks, setGoalTasks] = useState([
    {
      title: "Finish React Hooks",
      completed: true,
      description: "Learn useState and useEffect with examples.",
      time: "45 min",
      level: "Medium",
      resource: "https://react.dev/reference/react",
    },
    {
      title: "2 Pomodoro Sessions Left",
      completed: false,
      description: "Complete 2 focus sessions today.",
      time: "50 min",
      level: "Easy",
      resource: "https://www.youtube.com/results?search_query=pomodoro+study+with+me",
    },
    {
      title: "Complete Aptitude Practice",
      completed: false,
      description: "Solve aptitude questions.",
      time: "30 min",
      level: "Medium",
      resource: "https://www.indiabix.com/aptitude/questions-and-answers/",
    },
  ]);

  const totalTasks = goalTasks.length;
  const completedTasks = goalTasks.filter((t) => t.completed).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleTaskComplete = (index) => {
    setGoalTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // ── DYNAMIC SUBJECTS ──
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        const data = res.data || [];
        setSubjects(data);
        if (data.length > 0) setSelectedSubject(data[0]);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const getSubjectName = (sub) => sub?.name || sub?.subject || "";
  const getSubjectSlug = (sub) =>
    getSubjectName(sub).toLowerCase().trim().replace(/\s+/g, "-");
  const getChapters = (sub) => sub?.chapters || [];

  // ── POMODORO ──
  const [time, setTime] = useState(1500);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (t) =>
    `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  const [noteTitle, setNoteTitle] = useState("");
  const [noteFile, setNoteFile] = useState(null);

  const handleUploadNotes = () => {
    if (!noteTitle || !noteFile) {
      alert("Please enter note title and select file");
      return;
    }
    alert(`Notes Uploaded Successfully: ${noteTitle}`);
    setNoteTitle("");
    setNoteFile(null);
  };

  return (
    <>
      <div className="dashboard-page">
        <div className="dashboard">

          {/* TOP NAV CARDS */}
          <div className="cards">
            <Link to="/study-planner" className="card">📚 Study Planner</Link>
            <div className="card" onClick={() => setShowFocusTimer(true)} style={{ cursor: "pointer" }}>⏳ Focus Timer</div>
            <Link to="/skill-tracker" className="card">📈 Skill Tracker</Link>
            <Link to="/resume-builder" className="card">📄 Resume Builder</Link>
            <Link to="/interview-prep" className="card">🎤 Interview Prep</Link>
            <Link to="/job-suggestions" className="card">💼 Job Suggestions</Link>
          </div>

          {/* TODAY'S GOALS */}
          <div className="card todays-goal-card">
            <h2>🎯 Today's Goals</h2>
            <ul>
              {goalTasks.map((goal, index) => (
                <li key={index} onClick={() => setSelectedGoal(goal)}>
                  <span onClick={(e) => { e.stopPropagation(); toggleTaskComplete(index); }}>
                    {goal.completed ? "✅" : "☐"}
                  </span>
                  {goal.title}
                </li>
              ))}
            </ul>
          </div>

          {/* PROGRESS */}
          <div className="card progress-card">
            <h2>📊 Daily Progress</h2>
            <div className="progress-stats">
              <span className="progress-fraction">
                {completedTasks}<small>/{totalTasks}</small>
              </span>
              <span className="progress-label">tasks done</span>
            </div>
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-footer">
              <span className="progress-pct">{progress}% Completed</span>
              <span className="progress-remaining">{totalTasks - completedTasks} left</span>
            </div>
          </div>

          {/* STREAK */}
          <div className="card streak-card">
            <h2>🔥 Streak</h2>
            <h1>{streak}</h1>
            <span>Days Active</span>
            <div className="streak-badge">Keep Going 🚀</div>
          </div>

          {/* POMODORO */}
          <div className="card" onClick={() => setShowFocusTimer(true)} style={{ cursor: "pointer" }}>
            <h2>⏱ Pomodoro</h2>
            <h1 style={{ color: "#A78BFA" }}>{formatTime(time)}</h1>
            <div className="pomodoro-buttons">
              <button onClick={(e) => { e.stopPropagation(); setRunning(true); }}>Start</button>
              <button onClick={(e) => { e.stopPropagation(); setRunning(false); }}>Pause</button>
            </div>
          </div>

          {/* DYNAMIC SUBJECTS */}
          <div className="card subjects-card">
            <h2>📚 My Subjects</h2>
            {subjectsLoading ? (
              <p className="subjects-loading">Loading subjects...</p>
            ) : subjects.length === 0 ? (
              <p className="subjects-empty">No subjects found.</p>
            ) : (
              <>
                <div className="tabs">
                  {subjects.map((sub, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSubject(sub)}
                      className={selectedSubject?._id === sub._id ? "active" : ""}
                    >
                      {getSubjectName(sub)}
                    </button>
                  ))}
                </div>

                {selectedSubject && (
                  <ul className="subject-chapters-list">
                    {getChapters(selectedSubject).length === 0 ? (
                      <li className="no-chapters">No chapters added yet</li>
                    ) : (
                      getChapters(selectedSubject).slice(0, 4).map((ch, i) => (
                        <li
                          key={i}
                          onClick={() => navigate(`/notes/${getSubjectSlug(selectedSubject)}`)}
                          className="chapter-item"
                        >
                          <span className="ch-num">{i + 1}</span>
                          {ch.title}
                          {i === 0 && <span className="free-tag">Free</span>}
                        </li>
                      ))
                    )}
                    {getChapters(selectedSubject).length > 4 && (
                      <li
                        className="view-all-chapters"
                        onClick={() => navigate(`/notes/${getSubjectSlug(selectedSubject)}`)}
                      >
                        View all {getChapters(selectedSubject).length} chapters →
                      </li>
                    )}
                  </ul>
                )}
              </>
            )}
          </div>

          {/* DEADLINES */}
          <div className="card">
            <h2>📅 Upcoming Deadlines</h2>
            <p>DBMS Assignment → Tomorrow</p>
            <p>OS Quiz → Friday</p>
            <p>Resume Submission → 2 Days Left</p>
          </div>

          {/* UPLOAD NOTES */}
          <div className="card notes-card">
            <h2>📚 Upload Notes</h2>
            <input
              type="text"
              placeholder="Enter Note Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setNoteFile(e.target.files[0])}
            />
            <button onClick={handleUploadNotes}>Upload Notes</button>
            {noteFile && <p className="file-name">Selected File: {noteFile.name}</p>}
          </div>

        </div>
      </div>

      <TodaysGoalDetails goal={selectedGoal} onClose={() => setSelectedGoal(null)} />
      {showFocusTimer && <FocusTimer onClose={() => setShowFocusTimer(false)} />}
    </>
  );
}

export default Dashboard;
