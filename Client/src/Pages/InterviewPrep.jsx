import React, { useEffect, useState } from "react";
import api from "../Services/api";
import "./InterviewPrep.css";

const fallbackInterviewData = {
  technical: {
    React: {
      easy: [
        { q: "What is React?", a: "React is a JavaScript library for building user interfaces with reusable components." },
        { q: "What is JSX?", a: "JSX is a syntax extension that lets you write HTML-like code inside JavaScript." },
        { q: "What is state in React?", a: "State is component-specific data that can change and cause re-renders." },
        { q: "How do you pass props?", a: "Props are used to pass data from parent to child components." },
      ],
      medium: [
        { q: "What are React hooks?", a: "Hooks are functions like useState and useEffect for handling state and side effects." },
        { q: "Explain useEffect.", a: "useEffect runs side effects after render and can depend on values to re-run." },
        { q: "What is the virtual DOM?", a: "The virtual DOM is a lightweight representation of the UI used for efficient updates." },
        { q: "What is lifting state up?", a: "Lifting state up moves shared state to a common ancestor component." },
      ],
      hard: [
        { q: "What is reconciliation in React?", a: "Reconciliation compares virtual DOM trees to apply minimal DOM changes." },
        { q: "What is memoization in React?", a: "Memoization caches values to avoid expensive recomputation." },
        { q: "How do controlled components differ from uncontrolled components?", a: "Controlled inputs keep state in React, while uncontrolled inputs keep state in the DOM." },
      ],
    },
    JavaScript: {
      easy: [
        { q: "What is JavaScript?", a: "JavaScript is a language for building interactive web applications." },
        { q: "What is a variable?", a: "A variable stores data and can be declared using let, const, or var." },
        { q: "What is a callback?", a: "A callback is a function passed to another function to execute later." },
        { q: "What are template literals?", a: "Template literals allow embedded expressions inside backticks." },
      ],
      medium: [
        { q: "What is a closure?", a: "A closure lets a function remember variables from its outer scope." },
        { q: "What is hoisting?", a: "Hoisting moves declarations to the top of their scope before execution." },
        { q: "What are promises?", a: "Promises represent asynchronous operations that can resolve or reject." },
        { q: "What is event bubbling?", a: "Event bubbling propagates events from child elements up through ancestor elements." },
      ],
      hard: [
        { q: "How does the event loop work?", a: "The event loop manages async callbacks using the call stack and task queue." },
        { q: "What is async/await?", a: "async/await is syntax for writing asynchronous code with promises." },
        { q: "What is prototypal inheritance?", a: "Objects inherit behavior from their prototype chain." },
      ],
    },
    NodeJS: {
      easy: [
        { q: "What is Node.js?", a: "Node.js is a runtime for running JavaScript on the server." },
        { q: "What is npm?", a: "npm is the package manager for Node.js." },
        { q: "What is Express?", a: "Express is a framework for building Node.js APIs." },
        { q: "How do you read env variables?", a: "Use process.env.VARIABLE_NAME." },
      ],
      medium: [
        { q: "What is middleware in Express?", a: "Middleware processes requests before route handlers." },
        { q: "What is CORS?", a: "CORS controls which domains can call your API." },
        { q: "How do you serve static files?", a: "Use express.static() to expose a folder of files." },
      ],
      hard: [
        { q: "What are Node streams?", a: "Streams process large data in chunks for efficiency." },
        { q: "What is clustering?", a: "Clustering runs multiple processes to use all CPU cores." },
      ],
    },
    SQL: {
      easy: [
        { q: "What is SQL?", a: "SQL is a language for querying relational databases." },
        { q: "What does SELECT do?", a: "SELECT retrieves rows from a table." },
        { q: "What is a primary key?", a: "A primary key uniquely identifies a record." },
      ],
      medium: [
        { q: "What is a JOIN?", a: "JOIN combines rows from multiple tables." },
        { q: "What is normalization?", a: "Normalization reduces duplication and improves consistency." },
        { q: "What is an index?", a: "An index speeds up queries." },
      ],
      hard: [
        { q: "What is ACID?", a: "ACID stands for Atomicity, Consistency, Isolation, Durability." },
        { q: "What is a transaction?", a: "A transaction is a unit of work that fully succeeds or fails." },
      ],
    },
    "System Design": {
      easy: [
        { q: "What is scalability?", a: "Scalability is the ability to handle more load." },
        { q: "What is load balancing?", a: "Load balancing spreads traffic across multiple servers." },
        { q: "What is caching?", a: "Caching stores frequent data for faster access." },
      ],
      medium: [
        { q: "What is sharding?", a: "Sharding splits data across multiple databases." },
        { q: "What is eventual consistency?", a: "Eventual consistency means data becomes consistent over time." },
      ],
      hard: [
        { q: "How would you design a URL shortener?", a: "Use a short key and store the original URL for redirect." },
        { q: "How do you design a chat app?", a: "Use WebSockets, message storage, and authentication." },
      ],
    },
  },
  hr: [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why do you want this job?",
    "Describe a time you resolved conflict.",
    "How do you handle feedback?",
    "Where do you see yourself in 5 years?",
    "Tell me about a team project you enjoyed.",
    "How do you manage deadlines?",
    "Why should we hire you?",
    "What motivates you?",
  ],
  cheatSheet: [
    "React: useState, useEffect, props, hooks, virtual DOM.",
    "JavaScript: closures, promises, async/await, event loop.",
    "Node.js: middleware, routing, async I/O.",
    "SQL: SELECT, JOIN, GROUP BY, transactions.",
    "System Design: scaling, caching, load balancing.",
    "HR: STAR format, growth mindset, clear examples.",
    "Mock interview tip: structure answers and stay calm.",
    "Highlight impact and measurable results in your responses.",
  ],
};

export default function InterviewPrep() {
  const [tab, setTab] = useState("technical");
  const [difficulty, setDifficulty] = useState("easy");
  const [interviewData, setInterviewData] = useState(fallbackInterviewData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mock, setMock] = useState(false);
  const [time, setTime] = useState(45);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState({
    technical: 0,
    communication: 0,
    confidence: 0,
  });

  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await api.get("/interview");
        if (response.data?.success && response.data?.data) {
          setInterviewData(response.data.data);
        }
      } catch (err) {
        console.warn("Backend questions not loaded. Using built-in fallback content.", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    let timer;
    if (mock && time > 0) {
      timer = setTimeout(() => setTime((current) => current - 1), 1000);
    }

    if (mock && time === 0) {
      generateQuestion();
    }

    return () => clearTimeout(timer);
  }, [mock, time]);

  const categories = Object.keys(interviewData.technical || {});

  const generateQuestion = () => {
    const availableTopics = categories.filter(
      (topic) => interviewData.technical[topic]?.[difficulty]?.length > 0
    );

    if (!availableTopics.length) {
      setQuestion(null);
      return;
    }

    const topic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    const bank = interviewData.technical[topic][difficulty];
    const randomQuestion = bank[Math.floor(Math.random() * bank.length)];

    setQuestion({ ...randomQuestion, topic });
    setAnswer("");
    setTime(45);
  };

  const evaluateAnswer = (text, correctAnswer) => {
    if (!text) return 0;

    let score = 0;
    const normalized = text.toLowerCase();

    if (text.length > 40) score += 30;
    if (normalized.includes("react") || normalized.includes("javascript") || normalized.includes("node")) score += 25;
    if (text.length > (correctAnswer?.length || 1) / 2) score += 35;

    return score;
  };

  const submitAnswer = () => {
    if (!question) return;

    const s = evaluateAnswer(answer, question.a || "");
    setScore((prev) => ({
      technical: prev.technical + s,
      communication: prev.communication + (answer.length > 30 ? 12 : 6),
      confidence: prev.confidence + 10,
    }));

    generateQuestion();
  };

  const startMock = () => {
    setMock(true);
    setScore({ technical: 0, communication: 0, confidence: 0 });
    generateQuestion();
  };

  const resetMock = () => {
    setMock(false);
    setQuestion(null);
    setAnswer("");
    setTime(45);
  };

  return (
    <div className="prep-container">
      <div className="prep-hero">
        <div>
          <p className="eyebrow">Interview Prep</p>
          <h1>AI Interview Preparation System</h1>
          <p className="subtitle">
            Load backend-backed questions, practice technical and HR rounds, and sharpen answers with an improved interface.
          </p>
        </div>
      </div>

      <div className="prep-tabs">
        <button className={tab === "technical" ? "active" : ""} onClick={() => setTab("technical")}>Technical</button>
        <button className={tab === "hr" ? "active" : ""} onClick={() => setTab("hr")}>HR</button>
        <button className={tab === "mock" ? "active" : ""} onClick={() => setTab("mock")}>Mock Interview</button>
        <button className={tab === "cheat" ? "active" : ""} onClick={() => setTab("cheat")}>Cheat Sheet</button>
      </div>

      {loading && <div className="prep-message">Loading questions from backend...</div>}
      {error && <div className="prep-error">{error}</div>}

      {tab === "technical" && (
        <div className="card technical-card">
          <p className="section-note">Expand a topic to reveal questions from easy, medium, and hard levels.</p>
          {categories.map((topic, index) => (
            <div key={topic} className="topic-block">
              <button
                className={`topic-header ${expanded === index ? "open" : ""}`}
                onClick={() => setExpanded(expanded === index ? null : index)}
              >
                <span>{topic}</span>
                <small>{Object.keys(interviewData.technical[topic]).join(" • ")}</small>
              </button>
              {expanded === index && (
                <div className="topic-body">
                  {Object.entries(interviewData.technical[topic]).map(([level, questions]) => (
                    <div key={level} className="difficulty-group">
                      <h3>{level} Level</h3>
                      {questions.map((item, questionIndex) => (
                        <div key={`${topic}-${level}-${questionIndex}`} className="qa">
                          <p className="q">❓ {item.q}</p>
                          <p className="ans">💡 {item.a}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "hr" && (
        <div className="card hr-card">
          <p className="section-note">Practice HR answers with your own notes below each question.</p>
          {interviewData.hr.map((questionText, index) => (
            <div key={index} className="hr-question">
              <p className="q">❓ {questionText}</p>
              <textarea placeholder="Write your response here..." rows={4} />
            </div>
          ))}
        </div>
      )}

      {tab === "mock" && (
        <div className="card mock-card">
          <div className="mock-header">
            <button className="primary-btn" onClick={startMock}>{mock ? "Restart Mock Interview" : "Start Mock Interview"}</button>
            <div className="difficulty-select">
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {!mock ? (
            <p className="section-note">Press start to practice a timed interview question from the backend topic pool.</p>
          ) : (
            <>
              <div className="timer">⏱ {time}s left</div>
              {question ? (
                <div className="mock-question">
                  <h3>{question.topic} Question</h3>
                  <p>{question.q}</p>
                </div>
              ) : (
                <p className="section-note">Generating the next question...</p>
              )}

              <textarea
                className="answer-input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={7}
              />

              <div className="mock-actions">
                <button className="primary-btn" onClick={submitAnswer} disabled={!answer.trim()}>Submit Answer</button>
                <button className="secondary-btn" onClick={resetMock}>End Mock</button>
              </div>

              <div className="score-panel">
                <div><strong>Technical:</strong> {score.technical}</div>
                <div><strong>Communication:</strong> {score.communication}</div>
                <div><strong>Confidence:</strong> {score.confidence}</div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "cheat" && (
        <div className="card cheat-card">
          <p className="section-note">Quick reference prompts for the most important interview topics.</p>
          <div className="cheat-grid">
            {interviewData.cheatSheet.map((item, index) => (
              <div key={index} className="cheat-item">✨ {item}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
