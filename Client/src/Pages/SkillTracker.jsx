import React, { useEffect, useState, useRef } from "react";
import "./SkillTracker.css";
import { Clock, Moon, SunMedium } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#0ea5e9", "#a855f7"];

function SkillTracker() {
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [goal, setGoal] = useState("");
  const [streak, setStreak] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showDropdown, setShowDropdown] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("skillTrackerTheme") || "light"
  );
  const [noteInputs, setNoteInputs] = useState({});
  const [pomodoroSkill, setPomodoroSkill] = useState(null);
  const [activeTimer, setActiveTimer] = useState({
    skillId: null,
    seconds: 1500,
    running: false,
  });
  const timerRef = useRef(null);

  useEffect(() => {
    const savedSkills = JSON.parse(localStorage.getItem("skills")) || [];
    setSkills(
      savedSkills.map((skill) => ({
        ...skill,
        notes: skill.notes || "",
        sessions: skill.sessions || [],
      }))
    );

    const savedStreak = Number(localStorage.getItem("streak")) || 0;
    setStreak(savedStreak);

    const savedTheme = localStorage.getItem("skillTrackerTheme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem("streak", streak);
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("skillTrackerTheme", theme);
  }, [theme]);

  useEffect(() => {
    if (!activeTimer.running) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveTimer((prev) => {
        if (!prev.running) return prev;
        if (prev.seconds <= 1) {
          completeTimerSession(prev.skillId);
          return { skillId: null, seconds: 1500, running: false };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [activeTimer.running]);

  useEffect(() => {
    if (pomodoroSkill) {
      startTimer(pomodoroSkill);
    }
  }, [pomodoroSkill]);

  const getBadge = (hours) => {
    if (hours >= 50) return "🥇 Gold";
    if (hours >= 25) return "🥈 Silver";
    if (hours >= 10) return "🥉 Bronze";
    return "🚀 Starter";
  };

  const getDeadlineInfo = (deadline) => {
    if (!deadline) return "No deadline set";
    const now = new Date();
    const target = new Date(deadline + "T23:59:59");
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diff > 1) return `${diff} days left`;
    if (diff === 1) return "1 day left";
    if (diff === 0) return "Due today";
    return "Overdue";
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const addSkill = () => {
    if (!skillName.trim()) return;

    const newSkill = {
      id: Date.now(),
      name: skillName.trim(),
      progress: 0,
      level: "Beginner",
      hours: 0,
      studyMinutes: 0,
      notes: "",
      sessions: [],
      status: "Pending",
      deadline: "",
    };

    setSkills((prev) => [...prev, newSkill]);
    setSkillName("");
  };

  const addSkillNote = (id) => {
    const noteText = (noteInputs[id] || "").trim();
    if (!noteText) return;

    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              notes: [
                { date: new Date().toLocaleDateString(), text: noteText },
                ...skill.notes,
              ],
            }
          : skill
      )
    );

    setNoteInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const completeTimerSession = (id) => {
    setSkills((prev) =>
      prev.map((skill) => {
        if (skill.id !== id) return skill;
        const newMinutes = (skill.studyMinutes || 0) + 25;
        const newHours = parseFloat(
          ((skill.hours || 0) + 25 / 60).toFixed(1)
        );
        return {
          ...skill,
          studyMinutes: newMinutes,
          hours: newHours,
          sessions: [
            { date: new Date().toISOString(), minutes: 25 },
            ...skill.sessions,
          ],
        };
      })
    );
  };

  const startTimer = (skillId) => {
    setActiveTimer((prev) =>
      prev.skillId === skillId
        ? { ...prev, running: true }
        : { skillId, seconds: 1500, running: true }
    );
  };

  const pauseTimer = () => {
    setActiveTimer((prev) => ({ ...prev, running: false }));
  };

  const resetTimer = (skillId) => {
    if (activeTimer.skillId === skillId) {
      setActiveTimer({ skillId: null, seconds: 1500, running: false });
    }
  };

  const deleteSkill = (id) => {
    setSkills(
      skills.filter((skill) => skill.id !== id)
    );
  };

  const updateSkill = (id, field, value) => {
    const updated = skills.map((skill) =>
      skill.id === id
        ? { ...skill, [field]: value }
        : skill
    );

    setSkills(updated);
  };

  const insightMessage = () => {
    if (!skills.length) return "Add your first skill to begin tracking.";
    if (completedSkills === skills.length)
      return "Amazing! All your skills are completed.";
    if (Number(totalHours) >= 10)
      return "Strong momentum — keep pushing your daily focus.";
    return "Stay consistent. Small progress each day adds up.";
  };

  const hoursDistribution = skills.map((skill) => ({
    name: skill.name,
    value: Number(skill.hours || 0),
  })).filter((entry) => entry.value > 0);

  const weeklyReport = skills
    .flatMap((skill) =>
      (skill.sessions || []).map((session) => ({
        ...session,
        name: skill.name,
      }))
    )
    .filter((session) => {
      const created = new Date(session.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return created >= sevenDaysAgo;
    })
    .reduce((acc, session) => {
      const existing = acc.find(
        (item) => item.name === session.name
      );
      if (existing) existing.hours += session.minutes / 60;
      else acc.push({ name: session.name, hours: session.minutes / 60 });
      return acc;
    }, [])
    .map((item) => ({
      name: item.name,
      hours: Number(item.hours.toFixed(1)),
    }));

  const completedSkills = skills.filter(
    (skill) => skill.status === "Completed"
  ).length;

  const totalHours = skills
    .reduce((total, skill) => total + Number(skill.hours || 0), 0)
    .toFixed(1);

  const filteredSkills = skills.filter((skill) => {
    const matchSearch = skill.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "All"
        ? true
        : skill.status === filter ||
          skill.level === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className={`tracker-container ${theme}`}>
      <div className="tracker-header">
        <div>
          <h1>🚀 Skill Tracker Dashboard</h1>
          <p className="hero-subtitle">
            Plan goals, track progress, and keep your learning streak alive.
          </p>
        </div>
        <button
          className="theme-toggle"
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
        >
          {theme === "light" ? <Moon size={18} /> : <SunMedium size={18} />}
          {theme === "light" ? " Dark Mode" : " Light Mode"}
        </button>
      </div>

      <div className="goal-card">
        <div>
          <h2>Set your learning goal</h2>
          <input
            className="goal-input"
            placeholder="Example: Finish React project by end of month"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          {goal && <p className="goal-text">🎯 {goal}</p>}
        </div>

        <div className="insight-card">
          <h3>Progress insight</h3>
          <p>{insightMessage()}</p>
        </div>
      </div>

      <div className="control-panel">
        <div className="add-box">
          <input
            placeholder="Add new skill..."
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
          />
          <button className="primary-btn" onClick={addSkill}>
            Add Skill
          </button>
        </div>

        <div className="search-filter-box">
          <input
            placeholder="Search skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      <div className="stats-box">
        <div className="stat-card">
          <h3>Total Skills</h3>
          <p>{skills.length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{completedSkills}</p>
        </div>
        <div className="stat-card">
          <h3>Total Hours</h3>
          <p>{totalHours}h</p>
        </div>
        <div className="stat-card">
          <h3>Streak</h3>
          <p>{streak}d</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-box">
          <div className="chart-header">
            <div>
              <h2>Progress by Skill</h2>
              <p className="chart-subtitle">
                Visual progress for every tracked skill.
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={skills}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#6366f1" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box small-chart">
          <div className="chart-header">
            <div>
              <h2>Hours Distribution</h2>
              <p className="chart-subtitle">
                How your study hours are shared across skills.
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={hoursDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={4}
                label
              >
                {hoursDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="weekly-report">
        <div className="report-header">
          <h2>Weekly Study Report</h2>
          <p>Hours tracked in the last 7 days.</p>
        </div>
        {weeklyReport.length > 0 ? (
          <div className="report-list">
            {weeklyReport.map((item) => (
              <div key={item.name} className="report-item">
                <span>{item.name}</span>
                <strong>{item.hours}h</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No study sessions found this week. Start a Pomodoro to log time.
          </p>
        )}
      </div>

      {filteredSkills.map((skill, index) => (
        <div
          key={skill.id}
          className="skill-card"
        >
          <div className="skill-top">
            <div>
              <h2>{skill.name}</h2>
              <p className="skill-label">
                Badge: <span>{getBadge(skill.hours)}</span>
              </p>
              <p className="deadline-text">
                Deadline: {skill.deadline || "Not set"}
              </p>
            </div>

            <button
              className="delete-btn"
              onClick={() => deleteSkill(skill.id)}
            >
              Delete
            </button>
          </div>

          <div className="skill-row">
            <div className="skill-progress">
              <label>Progress: {skill.progress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={skill.progress}
                onChange={(e) =>
                  updateSkill(
                    skill.id,
                    "progress",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="skill-meta">
              <select
                value={skill.level}
                onChange={(e) =>
                  updateSkill(
                    skill.id,
                    "level",
                    e.target.value
                  )
                }
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              <select
                value={skill.status}
                onChange={(e) =>
                  updateSkill(
                    skill.id,
                    "status",
                    e.target.value
                  )
                }
              >
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <div className="hours-wrapper">
            <button
              className="clock-btn"
              onClick={() =>
                setShowDropdown(
                  showDropdown === index ? null : index
                )
              }
            >
              <Clock size={18} /> {skill.hours}h
            </button>

            {showDropdown === index && (
              <div className="hours-dropdown">
                {[1, 2, 3, 4, 5, 6].map((hour) => (
                  <div
                    key={hour}
                    className="dropdown-item"
                    onClick={() => {
                      updateSkill(skill.id, "hours", hour);
                      setShowDropdown(null);
                    }}
                  >
                    {hour} Hour
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="timer-panel">
            <span>
              {activeTimer.skillId === skill.id
                ? formatTime(activeTimer.seconds)
                : "25:00"}
            </span>
            <button
              className="timer-btn"
              onClick={() =>
                activeTimer.skillId === skill.id && activeTimer.running
                  ? pauseTimer()
                  : startTimer(skill.id)
              }
            >
              {activeTimer.skillId === skill.id && activeTimer.running
                ? "Pause"
                : "Start"}
            </button>
            {activeTimer.skillId === skill.id && (
              <button
                className="timer-btn"
                onClick={() => resetTimer(skill.id)}
              >
                Reset
              </button>
            )}
          </div>

          <div className="card-input-row">
            <input
              type="date"
              value={skill.deadline}
              onChange={(e) =>
                updateSkill(
                  skill.id,
                  "deadline",
                  e.target.value
                )
              }
            />
            <button
              className="secondary-btn"
              onClick={() =>
                updateSkill(skill.id, "progress", 100)
              }
            >
              Mark Complete
            </button>
          </div>

          <textarea
            placeholder="Add a note or reflection"
            value={skill.notes}
            onChange={(e) =>
              updateSkill(skill.id, "notes", e.target.value)
            }
          />

          {skill.notes && (
            <div className="notes-history">
              <h4>Latest note</h4>
              <p>{skill.notes}</p>
            </div>
          )}

          <div className="skill-actions">
            <button
              className="small-btn"
              onClick={() => setPomodoroSkill(skill.id)}
            >
              Start Pomodoro
            </button>
            <button
              className="small-btn"
              onClick={() => updateSkill(skill.id, "status", "Completed")}
            >
              Complete Skill
            </button>
          </div>

          {skill.progress === 100 && (
            <p className="completion-note">
              🎉 Great work! Skill completed
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default SkillTracker;