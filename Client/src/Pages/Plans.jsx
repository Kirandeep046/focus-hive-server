import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Plans.css";
import UpiPaymentScanner from "../Components/UpiPaymentScanner";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "₹99",
    period: "/ month",
    tag: null,
    desc: "Perfect for focused study on one subject",
    features: ["1 Subject Unlocked", "All Chapters Access", "PDF Booklets", "Solved PYQs", "Download Notes"],
    notIncluded: ["All Subjects", "Priority Support"],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#667eea",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹199",
    period: "/ month",
    tag: "Most Popular",
    desc: "Best for students preparing for all subjects",
    features: ["All Subjects Unlocked", "All Chapters Access", "PDF Booklets", "Solved PYQs", "Download Notes", "Priority Support"],
    notIncluded: [],
    gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#6366f1",
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "₹999",
    period: "/ year",
    tag: "Best Value",
    desc: "Full year access — save 58% vs monthly",
    features: ["Everything in Pro", "12 Months Access", "All Subjects Unlocked", "PDF Booklets + Downloads", "Solved PYQs", "Priority Support"],
    notIncluded: [],
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    color: "#0ea5e9",
  },
];

const UPI_ID = "apni-upi-id@bank"; // 👈 yahan apni real UPI ID daalo
const WHATSAPP = "+91 XXXXX XXXXX";
const EMAIL = "support@focushive.com";

const steps = [
  { num: "01", icon: "🎯", title: "Choose Your Plan", desc: "Pick the plan that fits your study goals from above." },
  { num: "02", icon: "💳", title: "Pay via UPI", desc: "Send payment to our UPI ID using GPay, PhonePe, Paytm or BHIM.", upi: true },
  { num: "03", icon: "📸", title: "Submit Transaction ID", desc: "Enter your UTR / Transaction ID in the form after payment.", contact: true },
  { num: "04", icon: "✅", title: "Get Access", desc: "We verify and activate your account within 2–4 hours." },
];

export default function Plans() {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState(1); // 1=UPI, 2=UTR form, 3=success
  const [utr, setUtr] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const activePlanId = localStorage.getItem("focushive_plan");
  const activePlan = plans.find((p) => p.id === activePlanId);

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setStep(1);
    setUtr("");
    setEmail("");
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!utr.trim() || utr.trim().length < 8) {
      setFormError("Please enter a valid Transaction ID (min 8 characters).");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    // Simulate API call — replace with real backend call later
    setTimeout(() => {
      setSubmitting(false);
      setStep(3);
      // Save pending state — admin will verify and activate
      localStorage.setItem("focushive_plan_pending", JSON.stringify({
        plan: selectedPlan.id,
        utr: utr.trim(),
        email: email.trim(),
        submittedAt: new Date().toISOString(),
      }));
    }, 1500);
  };

  return (
    <div className="plans-page">

      {/* ── HERO ── */}
      <div className="plans-hero">
        <div className="hero-glow" />
        <span className="plans-badge">✦ Premium Access</span>
        <h1>Unlock Your Full <span className="hero-gradient-text">Learning Potential</span></h1>
        <p>Access all chapters, PDF booklets, solved PYQs and downloadable notes for every subject — all in one plan.</p>
        <div className="hero-trust">
          <span>🔒 Secure UPI Payment</span>
          <span>⚡ Activated in 2–4 hrs</span>
          <span>📚 All Subjects Included</span>
        </div>
      </div>

      {/* ── ACTIVE PLAN BANNER ── */}
      {activePlan && (
        <div className="active-plan-banner" style={{ maxWidth: "1040px", margin: "0 auto 32px", padding: "20px 28px" }}>
          <div className="active-plan-left">
            <div className="active-dot" />
            <div>
              <p className="active-plan-label">Current Active Plan</p>
              <h3 className="active-plan-name">{activePlan.name} — {activePlan.price}<span>{activePlan.period}</span></h3>
            </div>
          </div>
          <div className="active-plan-right">
            <span className="active-badge">✓ Active</span>
            <button className="active-go-btn" onClick={() => navigate(-1)}>Continue Studying →</button>
          </div>
        </div>
      )}

      {/* ── PLAN CARDS ── */}
      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.tag === "Most Popular" ? "plan-popular" : ""} ${plan.tag === "Best Value" ? "plan-value" : ""} ${activePlanId === plan.id ? "plan-active" : ""}`}
          >
            <div className="plan-tag-wrap">
              {activePlanId === plan.id ? (
                <span className="plan-tag plan-tag-active">✓ Your Plan</span>
              ) : plan.tag ? (
                <span className="plan-tag" style={{ background: plan.color }}>{plan.tag}</span>
              ) : null}
            </div>
            <div className="plan-icon-bar" style={{ background: plan.gradient }} />
            <div className="plan-body">
              <h2 className="plan-name">{plan.name}</h2>
              <p className="plan-desc">{plan.desc}</p>
              <div className="plan-price-row">
                <span className="plan-price">{plan.price}</span>
                <span className="plan-period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}><span className="feat-tick">✓</span>{f}</li>
                ))}
                {plan.notIncluded.map((f, i) => (
                  <li key={i} className="feat-off"><span className="feat-cross">✕</span>{f}</li>
                ))}
              </ul>
              {activePlanId === plan.id ? (
                <button className="plan-active-btn" disabled>✓ Currently Active</button>
              ) : (
                <button className="plan-buy-btn" style={{ background: plan.gradient }} onClick={() => openModal(plan)}>
                  Get {plan.name} Plan →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── HOW TO BUY ── */}
      <div className="how-section">
        <div className="how-header">
          <span className="plans-badge how-badge">Simple Process</span>
          <h2>How to Buy</h2>
          <p>4 simple steps to unlock all content</p>
        </div>
        <div className="steps-row">
          {steps.map((step, i) => (
            <div className="step-card" key={i}>
              <div className="step-icon-wrap">{step.icon}</div>
              <div className="step-num-tag">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {step.upi && (
                <div className="upi-box">
                  <span className="upi-label">UPI ID</span>
                  <div className="upi-row">
                    <code>{UPI_ID}</code>
                    <button className="copy-btn" onClick={handleCopy}>
                      {copied ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
              {step.contact && (
                <div className="contact-box">
                  <div className="contact-row"><span>📧</span><span>{EMAIL}</span></div>
                  <div className="contact-row"><span>💬</span><span>WhatsApp: <strong>{WHATSAPP}</strong></span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {[
            { q: "How long does activation take?", a: "Usually 2–4 hours after we verify your payment screenshot." },
            { q: "Which UPI apps are supported?", a: "Google Pay, PhonePe, Paytm, BHIM, or any UPI-enabled app." },
            { q: "Can I switch plans later?", a: "Yes, you can upgrade anytime by paying the difference amount." },
            { q: "Is my data safe?", a: "Yes, we never store payment details. Payments go directly via UPI." },
          ].map((item, i) => (
            <div className="faq-card" key={i}>
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA BAND ── */}
      <div className="plans-cta-band">
        <div className="cta-band-left">
          <h3>Still have questions?</h3>
          <p>We're happy to help you choose the right plan.</p>
        </div>
        <div className="cta-band-right">
          <a href={`mailto:${EMAIL}`} className="cta-email-btn">📧 Email Us</a>
          <button className="cta-back-btn" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </div>

      {/* ── PAYMENT MODAL ── */}
      {showModal && selectedPlan && (
        <div className="modal-overlay" onClick={() => step !== 3 && !submitting && setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            
            {/* STEP 1 — UPI Payment (app select → QR scan → confirm) */}
            {step === 1 && (
              <>
                <div className="modal-header">
                  <div>
                    <p className="modal-step-label">Step 1 of 2</p>
                    <h2>Pay via UPI</h2>
                  </div>
                  <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                </div>

                <UpiPaymentScanner
                  onCapture={() => setStep(2)}
                  amount={selectedPlan.price}
                  planName={selectedPlan.name}
                  planGradient={selectedPlan.gradient}
                />
              </>
            )}

            {/* STEP 2 — Submit UTR */}
            {step === 2 && (
              <>
                <div className="modal-header">
                  <div>
                    <p className="modal-step-label">Step 2 of 2</p>
                    <h2>Confirm Payment</h2>
                  </div>
                  <button className="modal-close" onClick={() => !submitting && setShowModal(false)}>✕</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>UTR / Transaction ID *</label>
                    <input
                      type="text"
                      placeholder="e.g. 424212345678"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      disabled={submitting}
                    />
                    <span className="form-hint">Find this in your UPI app under payment history</span>
                  </div>
                  <div className="form-group">
                    <label>Your Email Address *</label>
                    <input
                      type="email"
                      placeholder="yourname@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                    />
                    <span className="form-hint">We'll send confirmation to this email</span>
                  </div>
                  {formError && <p className="form-error">⚠️ {formError}</p>}
                  <div className="modal-form-btns">
                    <button type="button" className="modal-back-btn" onClick={() => setStep(1)} disabled={submitting}>← Back</button>
                    <button type="submit" className="modal-submit-btn" style={{ background: selectedPlan.gradient }} disabled={submitting}>
                      {submitting ? <span className="submitting-txt">Submitting<span className="dots">...</span></span> : "Submit & Confirm →"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* STEP 3 — Success */}
            {step === 3 && (
              <div className="success-state">
                <div className="success-icon">🎉</div>
                <h2>Request Submitted!</h2>
                <p>Your payment details have been received. We'll activate your <strong>{selectedPlan.name} Plan</strong> within <strong>2–4 hours</strong>.</p>
                <div className="success-details">
                  <div className="success-row"><span>Plan</span><strong>{selectedPlan.name}</strong></div>
                  <div className="success-row"><span>Amount</span><strong>{selectedPlan.price}</strong></div>
                  <div className="success-row"><span>Transaction ID</span><strong>{utr}</strong></div>
                  <div className="success-row"><span>Email</span><strong>{email}</strong></div>
                  <div className="success-row"><span>Status</span><strong className="status-pending">⏳ Pending Verification</strong></div>
                </div>
                <div className="success-contact">
                  <p>Need faster activation? Contact us:</p>
                  <div className="success-contact-row">
                    <a href={`mailto:${EMAIL}`}>📧 {EMAIL}</a>
                    <span>💬 WhatsApp: {WHATSAPP}</span>
                  </div>
                </div>
                <button className="success-btn" onClick={() => { setShowModal(false); navigate(-1); }}>
                  ← Go Back to Studying
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
