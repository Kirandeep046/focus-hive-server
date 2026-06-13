import { useState, useEffect, useRef } from "react";
import "./FocusTimer.css";

function FocusTimer({ onClose }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [task, setTask] = useState("");
  const [currentTask, setCurrentTask] = useState(
    localStorage.getItem("focusTask") || ""
  );

  const [selectedSound, setSelectedSound] = useState("Rain");
  const [sessionsCompleted, setSessionsCompleted] = useState(4);
  const [streak, setStreak] = useState(6);
  const getInitialTaskHistory = () => {
    try {
      const stored = localStorage.getItem("taskHistory");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item, idx) => {
        if (typeof item === "string") {
          return { id: Date.now() - idx, text: item, completed: true };
        }
        return item;
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const [taskHistory, setTaskHistory] = useState(getInitialTaskHistory);
  const [soundError, setSoundError] = useState("");

  const audioContextRef = useRef(null);
  const noiseSourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const sounds = ["Rain", "Forest", "Cafe", "White Noise"];

  const quotes = [
    "Stay focused. Small progress is still progress ✨",
    "One Pomodoro at a time 🍅",
    "Deep work creates real results 🚀",
    "Keep going. You’re doing great 🔥",
    "Done is better than perfect 💫",
  ];

  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => {
      if (noiseSourceRef.current) {
        try {
          noiseSourceRef.current.stop();
        } catch {}
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        }

        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            setIsRunning(false);

            setSessionsCompleted((prev) => prev + 1);
            setStreak((prev) => prev + 1);

            alert("🎉 Session Complete! Great work.");

            if (Notification.permission === "granted") {
              new Notification("Focus Session Complete 🎉");
            }
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, seconds, minutes]);

  const stopSound = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch {}
      noiseSourceRef.current.disconnect();
      noiseSourceRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  };

  const createNoiseSource = (audioCtx) => {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  const playSound = (sound) => {
    if (!sounds.includes(sound)) {
      setSoundError("Selected sound is unavailable.");
      return;
    }

    setSelectedSound(sound);
    setSoundError("");

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      setSoundError("Your browser does not support audio playback.");
      return;
    }

    let audioCtx = audioContextRef.current;
    if (!audioCtx) {
      audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch((error) => {
        console.warn("AudioContext resume failed:", error);
      });
    }

    stopSound();

    const source = createNoiseSource(audioCtx);
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();
    gain.gain.value = 0.15;

    switch (sound) {
      case "Rain":
        filter.type = "highpass";
        filter.frequency.value = 1000;
        gain.gain.value = 0.14;
        break;
      case "Forest":
        filter.type = "lowpass";
        filter.frequency.value = 1200;
        gain.gain.value = 0.12;
        break;
      case "Cafe":
        filter.type = "bandpass";
        filter.frequency.value = 850;
        gain.gain.value = 0.14;
        break;
      case "White Noise":
      default:
        filter.type = "allpass";
        gain.gain.value = 0.18;
        break;
    }

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();

    noiseSourceRef.current = source;
    gainNodeRef.current = gain;
  };

  const handleAddTask = () => {
    const trimmed = task.trim();
    if (trimmed === "") return;
    
    const newTaskObj = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };
    
    const updatedHistory = [newTaskObj, ...taskHistory];
    setTaskHistory(updatedHistory);
    localStorage.setItem("taskHistory", JSON.stringify(updatedHistory));
    
    if (!currentTask) {
      setCurrentTask(trimmed);
      localStorage.setItem("focusTask", trimmed);
    }
    
    setTask("");
  };

  const handleToggleTask = (id) => {
    const updated = taskHistory.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTaskHistory(updated);
    localStorage.setItem("taskHistory", JSON.stringify(updated));
  };

  const handleDeleteTask = (id) => {
    const updated = taskHistory.filter((t) => t.id !== id);
    setTaskHistory(updated);
    localStorage.setItem("taskHistory", JSON.stringify(updated));
    
    const deletedTask = taskHistory.find((t) => t.id === id);
    if (deletedTask && currentTask === deletedTask.text) {
      const nextTask = updated.find((t) => !t.completed);
      const nextTaskText = nextTask ? nextTask.text : "";
      setCurrentTask(nextTaskText);
      localStorage.setItem("focusTask", nextTaskText);
    }
  };

  const startTimer = () => {
    if (task.trim() !== "") {
      // Add task and start
      const trimmed = task.trim();
      const newTaskObj = {
        id: Date.now(),
        text: trimmed,
        completed: false,
      };
      const updatedHistory = [newTaskObj, ...taskHistory];
      setTaskHistory(updatedHistory);
      localStorage.setItem("taskHistory", JSON.stringify(updatedHistory));
      setCurrentTask(trimmed);
      localStorage.setItem("focusTask", trimmed);
      setTask("");
    }

    const randomQuote =
      quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setMinutes(25);
    setSeconds(0);
    setIsRunning(false);

    const randomQuote =
      quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      startTimer();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="focus-overlay">
      <div className="focus-modal">
        <button className="close-btn" onClick={handleClose}>
          ✖
        </button>

        <div className="focus-header">
          <div>
            <h2>🎯 Focus Mode</h2>
            <p className="header-subtitle">
              Build momentum with a calm, focused Pomodoro session.
            </p>
          </div>
          <div className="focus-goal-badge">Goal: 4 Pomodoros</div>
        </div>

        <div className="task-section">
          <div className="task-input-wrapper">
            <input
              type="text"
              placeholder="What are you focusing on?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="add-task-btn"
              onClick={handleAddTask}
              title="Add task to checklist"
            >
              ＋
            </button>
          </div>

          {currentTask && (
            <p className="current-task">
              🎯 Now Focusing: <strong>{currentTask}</strong>
            </p>
          )}
        </div>

        <div className="timer-circle">
          <h1>
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </h1>
        </div>

        <div className="timer-buttons">
          <button className="primary-btn" onClick={startTimer}>
            Start
          </button>
          <button className="secondary-btn" onClick={pauseTimer}>
            Pause
          </button>
          <button className="secondary-btn" onClick={resetTimer}>
            Reset
          </button>
        </div>

        <div className="sound-panel">
          <div className="panel-header">
            <h3>🎵 Focus Sound</h3>
            <span>{selectedSound}</span>
          </div>

          <div className="sound-buttons">
            {sounds.map((sound) => (
              <button
                type="button"
                key={sound}
                className={`sound-btn ${
                  selectedSound === sound ? "active" : ""
                }`}
                onClick={() => playSound(sound)}
              >
                {sound === "Rain" && "🌧️ "}
                {sound === "Forest" && "🌿 "}
                {sound === "Cafe" && "☕ "}
                {sound === "White Noise" && "🎧 "}
                {sound}
              </button>
            ))}
          </div>

          {soundError && <p className="sound-error">{soundError}</p>}
        </div>

        <div className="quote-box">
          <p>{quote}</p>
        </div>

        <div className="stats-grid">
          <div className="info-card">
            <span>🔥 Streak</span>
            <strong>{streak} days</strong>
          </div>
          <div className="info-card">
            <span>🍅 Sessions</span>
            <strong>{sessionsCompleted}</strong>
          </div>
          <div className="info-card">
            <span>⏱ Best Session</span>
            <strong>32m</strong>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <p>Task Completion Progress</p>
            <strong>
              {taskHistory.filter((t) => t.completed).length}/
              {taskHistory.length}
            </strong>
          </div>
          <progress
            value={taskHistory.filter((t) => t.completed).length}
            max={taskHistory.length || 1}
          ></progress>
        </div>

        <div className="task-history">
          <h4>My Focus Tasks</h4>
          {taskHistory.length > 0 ? (
            <div className="task-list">
              {taskHistory.map((item) => (
                <div
                  key={item.id}
                  className={`task-item ${item.completed ? "completed" : ""}`}
                >
                  <label className="task-checkbox-container">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleTask(item.id)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <span
                    className="task-text"
                    onClick={() => {
                      setCurrentTask(item.text);
                      localStorage.setItem("focusTask", item.text);
                    }}
                    title="Click to set as active focus"
                  >
                    {item.text}
                  </span>
                  <button
                    type="button"
                    className="delete-task-btn"
                    onClick={() => handleDeleteTask(item.id)}
                    title="Delete task"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">
              No tasks yet. Add one in the input field to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FocusTimer;