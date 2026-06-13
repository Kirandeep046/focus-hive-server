import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Landing.css";

// SVG Icon Components for Features
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

// SVGs for Academic Subjects
const AtomIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
    <path d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" opacity="0.4"></path>
  </svg>
);

const MathIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
    <line x1="12" y1="3" x2="12" y2="21" opacity="0.3"></line>
    <line x1="3" y1="12" x2="21" y2="12" opacity="0.3"></line>
  </svg>
);

const BeakerIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12"></path>
    <path d="M12 3v17"></path>
    <path d="M10 21h4"></path>
    <path d="M18 3v12a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V3"></path>
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const DatabaseIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
  </svg>
);

const CogIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

function Landing() {
  const navigate = useNavigate();
  const subjectsRef = useRef(null);
  const pricingRef = useRef(null);

  // ── STATE FOR MINI LIVE POMODORO TIMER ──
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSpeed, setTimerSpeed] = useState(1); // 1 = real-time, 100 = fast demo
  const [timerBreak, setTimerBreak] = useState(false);

  // ── STATE FOR FAQ ACCORDION ──
  const [activeFaq, setActiveFaq] = useState(null);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            // Flip session type
            setTimerBreak((b) => !b);
            setTimerActive(false);
            return timerBreak ? 25 * 60 : 5 * 60;
          }
          return prev - 1;
        });
      }, 1000 / timerSpeed);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSpeed, timerBreak]);

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setTimerBreak(false);
    setTimerSeconds(25 * 60);
  };
  const toggleSpeed = () => {
    setTimerSpeed((curr) => (curr === 1 ? 120 : 1)); // 120x speed for quick demo
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // FAQ Toggle
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      title: "Study Planner",
      desc: "Plan daily milestones, map curriculum targets, and manage scheduling with AI guidance.",
      icon: <CalendarIcon />,
      path: "/study-planner",
      color: "blue",
    },
    {
      title: "Focus Timer",
      desc: "Stay locked in with customizable Pomodoro sessions, distraction logs, and deep work reports.",
      icon: <ClockIcon />,
      path: "/timer",
      color: "purple",
    },
    {
      title: "Skill Tracker",
      desc: "Visualize your development path. Map subject levels to job requirements to become employment-ready.",
      icon: <ChartIcon />,
      path: "/skill-tracker",
      color: "cyan",
    },
    {
      title: "Resume Builder",
      desc: "Create professional, clean, ATS-optimized resumes designed to pass automatic filters.",
      icon: <FileIcon />,
      path: "/resume-builder",
      color: "pink",
    },
    {
      title: "Interview Prep",
      desc: "Rehearse real-world technical and soft skills questions using customized AI-driven mock interviews.",
      icon: <MicIcon />,
      path: "/interview-prep",
      color: "orange",
    },
    {
      title: "Job Suggestions",
      desc: "Scan available internship and work opportunities matched automatically to your active skill map.",
      icon: <BriefcaseIcon />,
      path: "/job-suggestions",
      color: "emerald",
    },
  ];

  const subjects = [
    { name: "Physics", icon: <AtomIcon />, path: "/notes/physics", count: "14 Chapters" },
    { name: "Math", icon: <MathIcon />, path: "/notes/math", count: "18 Chapters" },
    { name: "Chemistry", icon: <BeakerIcon />, path: "/notes/chemistry", count: "12 Chapters" },
    { name: "Computer", icon: <CodeIcon />, path: "/notes/computer", count: "15 Chapters" },
    { name: "BCA", icon: <DatabaseIcon />, path: "/notes/computer", count: "20 Chapters" },
    { name: "BTech", icon: <CogIcon />, path: "/notes/engineering", count: "24 Chapters" },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "₹99",
      period: "/mo",
      desc: "Ideal for focusing on a single specific subject area.",
      features: [
        "1 Academic Subject Unlocked",
        "All Chapter Notes & Explanations",
        "PDF Booklet Downloads",
        "Solved Practice Papers & PYQs",
        "Access to Basic Study Planner"
      ],
      notAvailable: ["All Subjects Unlocked", "Priority 24hr Support Desk", "AI Mock Interviews Prep"],
      cta: "Start Studying",
      tag: null,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    },
    {
      name: "Pro",
      price: "₹199",
      period: "/mo",
      desc: "Highly recommended for students covering all academic subjects.",
      features: [
        "All Academic Subjects Unlocked",
        "All Chapter Notes & Explanations",
        "Unlimited PDF Downloads",
        "Solved PYQs & Mock Tests",
        "Advanced Study Planner + Focus Logs",
        "Standard AI Job Suggestions",
        "Priority Support Desk"
      ],
      notAvailable: ["AI Interview Simulator Prep (10/mo limit)"],
      cta: "Upgrade to Pro",
      tag: "Most Popular",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    },
    {
      name: "Yearly",
      price: "₹999",
      period: "/yr",
      desc: "Best overall value. Save over 58% compared to monthly subscriptions.",
      features: [
        "Everything included in Pro plan",
        "Full 12 Months Access Unlocked",
        "Unlimited AI Mock Interviews Prep",
        "Resume Builder Pro Templates",
        "Realtime WhatsApp Alerts",
        "Exclusive Skill Path Mentorship"
      ],
      notAvailable: [],
      cta: "Get Yearly Access",
      tag: "Best Value",
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
    },
  ];

  const faqs = [
    {
      q: "What exactly is FocusHive AI?",
      a: "FocusHive AI is a comprehensive study management and career acceleration ecosystem. It helps students draft study routines, log distraction-free Pomodoro blocks, catalog skills, compile professional resumes, practice mock interview scenarios with artificial intelligence feedback, and browse curated internships."
    },
    {
      q: "How does the AI Mock Interview system work?",
      a: "Our AI simulator creates specialized questions tailored to your target career or academic track. Once you submit your responses, the model grades your input, providing actionable pointers on structure, language, and core technical skills to improve your success rate."
    },
    {
      q: "How do I upgrade to Pro or Yearly plans?",
      a: "Upgrading is straightforward! Navigate to our Membership Plans section or page, choose your plan, scan the payment scanner to complete verification via UPI, enter your transaction details, and our verification team will activate your full subscription in 2 to 4 hours."
    },
    {
      q: "Is there support available if I get stuck?",
      a: "Yes! Pro and Yearly subscribers receive priority ticketing access. You can reach out directly via email or chat with our admin coordinators on WhatsApp for fast account support."
    }
  ];

  const testimonials = [
    {
      name: "Rohan Sharma",
      role: "B.Tech CSE Student",
      avatar: "RS",
      stars: 5,
      text: "The Skill Tracker helped me realize what I was missing for job listings. Following the recommended study schedule, I built my first resume here and landed an internship!"
    },
    {
      name: "Priya Patel",
      role: "BCA Student",
      avatar: "PP",
      stars: 5,
      text: "Having Physics and Computer notes organized by chapter saved my exams. Plus, the Focus Timer actually kept me away from my phone. Absolutely worth the Pro plan!"
    },
    {
      name: "Aman Verma",
      role: "Engineering Aspirant",
      avatar: "AV",
      stars: 5,
      text: "The AI Mock Interviews are amazing. I rehearsed technical questions ten times before my actual interview. I felt twice as confident and passed the final round easily."
    }
  ];

  return (
    <div className="landing-wrapper">
      {/* Glow Orbs Background */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      <div className="glow-orb orb-3"></div>

      {/* ── HERO SECTION ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="badge-wrapper">
            <span className="badge">✦ Introducing FocusHive AI 2.0</span>
          </div>

          <h1>
            Study Smarter.
            <br />
            <span className="gradient-text">Achieve Bigger.</span>
          </h1>

          <p className="hero-desc">
            An intelligent workspace designed to map your study milestones, log deep work, build ATS-optimized resumes, and prep for interviews with active AI tools.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => {
                subjectsRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get Started Free →
            </button>
            <button
              className="secondary-btn"
              onClick={() => {
                pricingRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Pricing Plans
            </button>
          </div>
        </div>

        {/* CSS Mockup Dashboard on the Right */}
        <div className="hero-right-mockup">
          <div className="mockup-frame">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="mockup-dot dot-red"></span>
                <span className="mockup-dot dot-yellow"></span>
                <span className="mockup-dot dot-green"></span>
              </div>
              <div className="mockup-address">focushive.ai/dashboard</div>
            </div>
            
            <div className="mockup-body">
              {/* Fake Sidebar */}
              <div className="mockup-sidebar">
                <div className="sidebar-logo">FH</div>
                <div className="sidebar-icon active">📊</div>
                <div className="sidebar-icon">⏱️</div>
                <div className="sidebar-icon">📅</div>
                <div className="sidebar-icon">📄</div>
                <div className="sidebar-icon">💼</div>
              </div>

              {/* Fake Dashboard Main Area */}
              <div className="mockup-main">
                <div className="mockup-nav">
                  <span className="nav-title">Student Dashboard</span>
                  <div className="nav-avatar"></div>
                </div>

                <div className="mockup-grid">
                  <div className="mockup-card progress-card">
                    <div className="card-header">
                      <span className="card-label">CURRENT TARGET</span>
                      <span className="status-dot-active">Active</span>
                    </div>
                    <h4>Computer Networks</h4>
                    <div className="mockup-progress-bar">
                      <div className="mockup-progress-fill" style={{ width: "72%" }}></div>
                    </div>
                    <div className="card-footer-text">72% Completed • Chapter 4</div>
                  </div>

                  <div className="mockup-card stats-mini-card">
                    <span className="card-label">FOCUS HOURS</span>
                    <h3>18.4 hrs</h3>
                    <p className="trend positive">↑ 12% this week</p>
                  </div>

                  <div className="mockup-card ai-chat-card">
                    <span className="card-label">🤖 FOCUS HIVE AI</span>
                    <div className="chat-bubble">
                      "I notice you completed Physics Chapter 3. Ready to practice a mock test?"
                    </div>
                  </div>
                </div>

                {/* Simulated Floating UI Badge */}
                <div className="floating-badge-item">
                  <span className="f-icon">🎯</span>
                  <div className="f-text">
                    <strong>96% Match</strong>
                    <span>Frontend Role</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS/STATS SECTION ── */}
      <section className="stats-strip">
        <div className="stat-item">
          <h2>98%</h2>
          <p>Goal Completion Rate</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h2>10k+</h2>
          <p>Active Students</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h2>5.4M+</h2>
          <p>Focus Minutes Logged</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h2>5x</h2>
          <p>Faster Interview Prep</p>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-subtitle">Core Platform Features</span>
          <h2>Everything You Need to Succeed</h2>
          <p>A unified productivity workspace designed specifically for college students and job seekers.</p>
        </div>

        <div className="features-grid">
          {features.map((item, i) => (
            <div className={`feature-card color-${item.color}`} key={i}>
              <div className="icon-wrapper">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <button className="feature-open-btn" onClick={() => navigate(item.path)}>
                Launch Component →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE INTERACTIVE POMODORO DEMO ── */}
      <section className="live-demo-section">
        <div className="live-demo-container">
          <div className="live-demo-text">
            <span className="demo-badge">🔥 Try It Live</span>
            <h2>Focus Timer Widget</h2>
            <p>
              Experience our distraction-free Focus Timer right here. Toggle <strong>Demo Mode (120x)</strong> to fast-forward time and see the transition between study sessions and rest periods.
            </p>
            <div className="demo-details">
              <div className="detail-line">
                <span className="check-mark">✓</span>
                <span>Tracks study intervals automatically.</span>
              </div>
              <div className="detail-line">
                <span className="check-mark">✓</span>
                <span>Custom speed selector for quick review.</span>
              </div>
              <div className="detail-line">
                <span className="check-mark">✓</span>
                <span>Optimized layout to reduce digital fatigue.</span>
              </div>
            </div>
          </div>

          <div className="live-demo-widget">
            <div className="widget-frame">
              <span className="widget-status">
                {timerBreak ? "☕ Break Session" : "✍️ Study Session"}
              </span>
              
              <div className="widget-time-display">
                {formatTime(timerSeconds)}
              </div>

              <div className="widget-controls">
                <button className="widget-btn start-pause" onClick={toggleTimer}>
                  {timerActive ? "Pause Timer" : "Start Session"}
                </button>
                <button className="widget-btn reset" onClick={resetTimer}>
                  Reset
                </button>
                <button className={`widget-btn speed-toggle ${timerSpeed > 1 ? "active-speed" : ""}`} onClick={toggleSpeed}>
                  {timerSpeed > 1 ? "Normal Speed" : "Demo Speed (120x)"}
                </button>
              </div>

              {timerSpeed > 1 && (
                <div className="speed-warning">
                  ⚡ Time is running 120x faster for demo purposes.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── ACADEMIC SUBJECTS ── */}
      <section className="subjects-section" ref={subjectsRef}>
        <div className="section-header">
          <span className="section-subtitle">Academic Course Notes</span>
          <h2>📚 Choose Your Subject Path</h2>
          <p>Instant access to organized chapter summaries, key definitions, and downloadable study guides.</p>
        </div>

        <div className="subjects-grid">
          {subjects.map((sub, i) => (
            <div key={i} className="subject-card" onClick={() => navigate(sub.path)}>
              <div className="subject-icon-wrap">{sub.icon}</div>
              <h3>{sub.name}</h3>
              <span className="subject-chapters-badge">{sub.count}</span>
              <p className="card-link">View Notes →</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING / PLANS SECTION ── */}
      <section className="pricing-section" ref={pricingRef}>
        <div className="section-header">
          <span className="section-subtitle">Membership Plans</span>
          <h2>Unlock Full Academic Power</h2>
          <p>Gain access to premium summaries, resume builders, and interactive mock interviews at direct student pricing.</p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`pricing-card ${plan.tag ? "featured-card" : ""}`}>
              {plan.tag && <div className="card-top-badge" style={{ background: plan.gradient }}>{plan.tag}</div>}
              
              <div className="card-header-area">
                <h3>{plan.name}</h3>
                <p className="card-pricing-desc">{plan.desc}</p>
                <div className="price-row">
                  <span className="price-num">{plan.price}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
              </div>

              <div className="plan-divider"></div>

              <ul className="plan-checklist">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="avail">
                    <span className="check-icon">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.notAvailable.map((feature, idx) => (
                  <li key={idx} className="unavail">
                    <span className="cross-icon">✕</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className="pricing-cta-btn"
                style={{ background: plan.gradient }}
                onClick={() => navigate("/plans")}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-subtitle">Success Stories</span>
          <h2>Loved by Students Worldwide</h2>
          <p>See how FocusHive AI has helped students raise scores, save focus hours, and land career placements.</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="test-top">
                <div className="test-avatar">{t.avatar}</div>
                <div className="test-meta">
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
              <div className="rating-stars">
                {Array.from({ length: t.stars }).map((_, idx) => (
                  <span key={idx}>★</span>
                ))}
              </div>
              <p className="test-content">"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ACCORDION SECTION ── */}
      <section className="faq-section">
        <div className="section-header">
          <span className="section-subtitle">Got Questions?</span>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about setting up and using the FocusHive AI ecosystem.</p>
        </div>

        <div className="faq-accordion-container">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-row ${activeFaq === i ? "faq-expanded" : ""}`}>
              <button className="faq-question-button" onClick={() => toggleFaq(i)}>
                <span>{faq.q}</span>
                <span className="faq-toggle-icon">{activeFaq === i ? "−" : "+"}</span>
              </button>
              <div className="faq-answer-container">
                <div className="faq-answer-content">
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA BAND ── */}
      <section className="bottom-cta-banner">
        <div className="cta-overlay-glow"></div>
        <div className="cta-content">
          <h2>Ready to Supercharge Your Academic Journey?</h2>
          <p>Join thousands of students who have organized their study plans and accelerated their job applications.</p>
          <div className="cta-btn-row">
            <Link to="/signup" className="cta-primary">
              Register Account Now
            </Link>
            <button
              className="cta-secondary"
              onClick={() => {
                pricingRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Membership Details
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
