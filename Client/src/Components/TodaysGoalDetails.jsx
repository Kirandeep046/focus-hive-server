import { useState } from "react";
import "./TodaysGoalDetails.css";

const fallbackResources = [
  {
    keywords: ["react", "hooks", "usestate", "useeffect"],
    notes: [
      { title: "React Hooks Notes", content: "https://react.dev/reference/react/hooks" },
      { title: "useState Reference", content: "https://react.dev/reference/react/useState" },
      { title: "useEffect Reference", content: "https://react.dev/reference/react/useEffect" },
    ],
  },
  {
    keywords: ["math", "algebra", "calculus"],
    notes: [
      { title: "Algebra Notes", content: "https://www.khanacademy.org/math/algebra" },
      { title: "Calculus Notes", content: "https://www.khanacademy.org/math/calculus-1" },
    ],
  },
  {
    keywords: ["aptitude", "practice", "questions"],
    notes: [
      {
        title: "Aptitude Practice Notes",
        content: "https://www.indiabix.com/aptitude/questions-and-answers/",
      },
    ],
  },
  {
    keywords: ["pomodoro", "focus"],
    notes: [
      {
        title: "Pomodoro Study Resource",
        content: "https://www.youtube.com/results?search_query=pomodoro+study+with+me",
      },
    ],
  },
];

const getFallbackResources = (goal) => {
  const topic = `${goal?.title || ""} ${goal?.description || ""}`.toLowerCase();
  const match = fallbackResources.find((resource) =>
    resource.keywords.some((keyword) => topic.includes(keyword))
  );

  if (match) return match.notes;

  if (goal?.resource) {
    return [{ title: `${goal.title} Resource`, content: goal.resource }];
  }

  return [];
};

function TodaysGoalDetails({ goal, onClose }) {
  const [completed, setCompleted] = useState(false);
  const [resources, setResources] = useState([]);
  const [showResources, setShowResources] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);

  if (!goal) return null;

  const handleComplete = () => {
    setCompleted(true);
  };

  const handleViewResources = async () => {
    setLoadingResources(true);
    setShowResources(true);

    try {
      const topic = goal.title.toLowerCase();

      const res = await fetch(
        `http://localhost:5000/api/resources/${encodeURIComponent(topic)}`
      );

      const data = await res.json();

      if (data.success) {
        const notes = data.notes || [];
        setResources(notes.length > 0 ? notes : getFallbackResources(goal));
      } else {
        setResources(getFallbackResources(goal));
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources(getFallbackResources(goal));
    } finally {
      setLoadingResources(false);
    }
  };

  return (
    <div className="goal-overlay">
      <div className="goal-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>{goal.title}</h2>
        <p className="goal-desc">{goal.description}</p>

        <div className="goal-meta">
          <span>⏱ {goal.time}</span>
          <span>📈 {goal.level}</span>
        </div>

        <div className="goal-steps">
          <h3>Steps to Complete</h3>

          <label>
            <input type="checkbox" />
            Read top React interview questions
          </label>

          <label>
            <input type="checkbox" />
            Write answers in notebook
          </label>

          <label>
            <input type="checkbox" />
            Practice aloud 2 questions
          </label>
        </div>

        {/* BUTTONS */}
        <div className="goal-actions">
          <button
            className="resource-btn"
            onClick={handleViewResources}
            disabled={loadingResources}
          >
            {loadingResources ? "Loading..." : "View Resources"}
          </button>

          <button
            className={`complete-btn ${completed ? "done" : ""}`}
            onClick={handleComplete}
          >
            {completed ? "Completed ✅" : "Mark Complete"}
          </button>
        </div>

        {/* RESOURCES SECTION */}
        {showResources && (
          <div className="resources-box">
            <h3>📚 Study Resources</h3>

            {resources.length > 0 ? (
              resources.map((item, index) => (
                <div key={index} className="resource-card">
                  <h4>{item.title}</h4>

                  <a
                    href={item.content}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Link
                  </a>
                </div>
              ))
            ) : (
              <p>No resources available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TodaysGoalDetails;
