import React, { useState } from "react";
import { Star } from "lucide-react";
import "./StudyPlanner.css";

const initialPlans = [
  {
    id: 1,
    icon: "M",
    title: "Math Revision",
    description: "Algebra and calculus practice",
    tag: "Revision",
    isPriority: true,
  },
  {
    id: 2,
    icon: "C",
    title: "Coding Practice",
    description: "React, JavaScript, and DSA",
    tag: "Coding",
    isPriority: true,
  },
  {
    id: 3,
    icon: "A",
    title: "Assignment Work",
    description: "Finish college homework",
    tag: "College",
    isPriority: false,
  },
  {
    id: 4,
    icon: "E",
    title: "Exam Preparation",
    description: "Chapter-wise revision",
    tag: "Exam",
    isPriority: true,
  },
  {
    id: 5,
    icon: "T",
    title: "Mock Test Practice",
    description: "Timed quiz and test session",
    tag: "Practice",
    isPriority: false,
  },
  {
    id: 6,
    icon: "R",
    title: "Reading Session",
    description: "Read notes or textbook",
    tag: "Reading",
    isPriority: false,
  },
];

const StudyPlanner = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [newPlan, setNewPlan] = useState("");
  const [isPriority, setIsPriority] = useState(false);

  const handleAddPlan = () => {
    const value = newPlan.trim();

    if (!value) return;

    setPlans((prev) => [
      {
        id: Date.now(),
        icon: value[0].toUpperCase(),
        title: value,
        description: "New study task added to your planner",
        tag: "Custom",
        isPriority: isPriority,
      },
      ...prev,
    ]);
    setNewPlan("");
    setIsPriority(false);
  };

  const handleDeletePlan = (id) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== id));
  };

  const handleTogglePriority = (id) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === id ? { ...plan, isPriority: !plan.isPriority } : plan
      )
    );
  };

  return (
    <main className="study-page">
      <section className="study-hero">
        <div className="study-hero-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img">
            <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5v-17Z" />
            <path d="M5 4.5A2.5 2.5 0 0 0 2.5 2H2v17h.5A2.5 2.5 0 0 1 5 21.5v-17Z" />
            <path d="M8 6h8M8 10h7M8 14h5" />
          </svg>
        </div>
        <div>
          <h1>Study Planner</h1>
          <p>Organize your study routine, prioritize tasks, and track learning goals.</p>
        </div>
      </section>

      <section className="study-input-panel" aria-label="Add study plan">
        <div className="study-input-row">
          <input
            value={newPlan}
            onChange={(event) => setNewPlan(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleAddPlan();
            }}
            placeholder="Add a new study plan..."
          />
          <button type="button" onClick={handleAddPlan}>
            Add Plan
          </button>
        </div>
        <div className="study-input-options">
          <label className="priority-checkbox">
            <input
              type="checkbox"
              checked={isPriority}
              onChange={(e) => setIsPriority(e.target.checked)}
            />
            <span>Mark as High Priority</span>
          </label>
        </div>
      </section>

      <section className="study-summary" aria-label="Study summary">
        <article>
          <strong>{plans.length}</strong>
          <span>Total Plans</span>
        </article>
        <article className="priority-summary-card">
          <strong>{plans.filter((p) => p.isPriority).length}</strong>
          <span>Priority Tasks</span>
        </article>
        <article>
          <strong>Today</strong>
          <span>Focus Window</span>
        </article>
      </section>

      <section className="study-grid">
        {plans.map((plan) => (
          <article className={`study-card ${plan.isPriority ? "priority-card" : ""}`} key={plan.id}>
            <div className="study-card-top">
              <div className="study-card-icon">{plan.icon}</div>
              <div className="study-card-actions">
                <button
                  type="button"
                  className="priority-toggle"
                  onClick={() => handleTogglePriority(plan.id)}
                  title={plan.isPriority ? "Remove Priority" : "Mark as Priority"}
                >
                  <Star
                    className="star-icon"
                    size={18}
                    fill={plan.isPriority ? "#eab308" : "none"}
                    color={plan.isPriority ? "#eab308" : "#94a3b8"}
                  />
                </button>
                <span>{plan.tag}</span>
              </div>
            </div>
            <h2>{plan.title}</h2>
            <p>{plan.description}</p>
            <div className="study-card-footer">
              {plan.isPriority ? (
                <span className="priority-badge">⚠️ High Priority</span>
              ) : (
                <span className="normal-badge">Normal</span>
              )}
              <button type="button" className="delete-btn" onClick={() => handleDeletePlan(plan.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default StudyPlanner;
