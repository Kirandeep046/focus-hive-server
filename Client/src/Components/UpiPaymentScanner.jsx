import React, { useState } from 'react';
import './UpiPaymentScanner.css';

const UPI_ID = 'nk616755-1@okicici';
const MERCHANT_NAME = 'FocusHive';

const UPI_APPS = [
  {
    id: 'gpay',
    name: 'Google Pay',
    short: 'GPay',
    primary: '#4285F4',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path d="M43.6 20.5H24V28H35.4C34.2 33 29.7 36.5 24 36.5C17.1 36.5 11.5 30.9 11.5 24C11.5 17.1 17.1 11.5 24 11.5C27.1 11.5 29.9 12.6 32.1 14.5L37.8 8.8C34.2 5.6 29.4 3.5 24 3.5C12.7 3.5 3.5 12.7 3.5 24C3.5 35.3 12.7 44.5 24 44.5C35.3 44.5 44 35.9 44 24C44 22.8 43.9 21.6 43.6 20.5Z" fill="#FFC107"/>
        <path d="M6.3 14.7L13 19.7C14.8 15 19.1 11.5 24 11.5C27.1 11.5 29.9 12.6 32.1 14.5L37.8 8.8C34.2 5.6 29.4 3.5 24 3.5C16.3 3.5 9.6 8.1 6.3 14.7Z" fill="#FF3D00"/>
        <path d="M24 44.5C29.3 44.5 34 42.5 37.6 39.2L31.3 34.1C29.2 35.6 26.7 36.5 24 36.5C18.3 36.5 13.8 33 12.6 28.1L5.8 33.3C9.1 40.1 16 44.5 24 44.5Z" fill="#4CAF50"/>
        <path d="M43.6 20.5H24V28H35.4C34.8 30.5 33.4 32.7 31.3 34.1L37.6 39.2C41.5 35.6 44 30.1 44 24C44 22.8 43.9 21.6 43.6 20.5Z" fill="#1976D2"/>
      </svg>
    ),
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    short: 'PhonePe',
    primary: '#5f259f',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect width="48" height="48" rx="12" fill="#5f259f"/>
        <path d="M30 14H22C19.8 14 18 15.8 18 18V34L22 30H30C32.2 30 34 28.2 34 26V18C34 15.8 32.2 14 30 14Z" fill="white"/>
        <circle cx="24" cy="22" r="3" fill="#5f259f"/>
        <path d="M28 22C28 24.2 26.2 26 24 26C21.8 26 20 24.2 20 22" stroke="#5f259f" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'paytm',
    name: 'Paytm',
    short: 'Paytm',
    primary: '#00BAF2',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect width="48" height="48" rx="12" fill="#002970"/>
        <rect x="6" y="18" width="36" height="14" rx="3" fill="#00BAF2"/>
        <text x="24" y="29" fontFamily="Arial" fontWeight="900" fontSize="11" fill="white" textAnchor="middle">Paytm</text>
      </svg>
    ),
  },
  {
    id: 'bhim',
    name: 'BHIM UPI',
    short: 'BHIM',
    primary: '#FF6B35',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect width="48" height="48" rx="12" fill="#FF6B35"/>
        <text x="24" y="20" fontFamily="Arial" fontWeight="900" fontSize="10" fill="white" textAnchor="middle">BHIM</text>
        <text x="24" y="32" fontFamily="Arial" fontWeight="700" fontSize="9" fill="rgba(255,255,255,0.85)" textAnchor="middle">UPI</text>
        <rect x="10" y="22" width="28" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
      </svg>
    ),
  },
  {
    id: 'any',
    name: 'Other UPI App',
    short: 'Any UPI',
    primary: '#10b981',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect width="48" height="48" rx="12" fill="#10b981"/>
        <rect x="10" y="10" width="12" height="12" rx="3" fill="white" opacity="0.9"/>
        <rect x="26" y="10" width="12" height="12" rx="3" fill="white" opacity="0.9"/>
        <rect x="10" y="26" width="12" height="12" rx="3" fill="white" opacity="0.9"/>
        <rect x="26" y="26" width="12" height="12" rx="3" fill="white" opacity="0.6"/>
      </svg>
    ),
  },
];

export default function UpiPaymentScanner({ onCapture, amount, planName, planGradient }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [paid, setPaid] = useState(false);

  const rawAmount = amount ? amount.replace('₹', '') : '';
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${rawAmount}&cu=INR&tn=${encodeURIComponent(`FocusHive ${planName || 'Plan'}`)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiLink)}&margin=14&color=000000&bgcolor=ffffff`;

  /* ── App Selection Screen ── */
  if (!selectedApp) {
    return (
      <div className="ups-root">
        {/* Header */}
        <div className="ups-header-band" style={{ background: planGradient || 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          <div className="ups-header-emoji">💳</div>
          <div>
            <p className="ups-header-label">Complete Purchase</p>
            <h3 className="ups-header-title">{planName} Plan · <span>{amount}</span></h3>
          </div>
        </div>

        <p className="ups-choose-label">Select payment app</p>

        {/* App Grid */}
        <div className="ups-app-grid">
          {UPI_APPS.map((app) => (
            <button
              key={app.id}
              className="ups-app-card"
              style={{ '--card-border': app.primary, '--card-primary': app.primary }}
              onClick={() => setSelectedApp(app)}
            >
              <div className="ups-app-icon">
                {app.icon}
              </div>
              <span className="ups-app-name">{app.name}</span>
              <span className="ups-app-chevron">›</span>
            </button>
          ))}
        </div>

        <p className="ups-secure-note">🔒 100% secure · UPI certified · Instant payment</p>
      </div>
    );
  }

  /* ── QR Code Screen ── */
  return (
    <div className="ups-root">
      {/* Back + App Badge */}
      <div className="ups-qr-topbar">
        <button className="ups-back" onClick={() => { setSelectedApp(null); setPaid(false); }}>
          ← Back
        </button>
        <div className="ups-active-app" style={{ borderColor: selectedApp.primary, color: selectedApp.primary }}>
          <div className="ups-active-app-icon-wrap">{selectedApp.icon}</div>
          <span>{selectedApp.name}</span>
        </div>
      </div>

      {/* QR Card */}
      <div className="ups-qr-card">
        <div className="ups-qr-card-top">
          <div>
            <span className="ups-qr-plan-pill">{planName} Plan</span>
          </div>
          <div className="ups-qr-amount-display">
            <span className="ups-qr-amount">{amount}</span>
            <span className="ups-qr-currency-note">INR · One-time</span>
          </div>
        </div>

        <div className="ups-qr-frame">
          <div className="ups-qr-corner ups-qr-corner--tl" />
          <div className="ups-qr-corner ups-qr-corner--tr" />
          <div className="ups-qr-corner ups-qr-corner--bl" />
          <div className="ups-qr-corner ups-qr-corner--br" />
          <img
            src={qrUrl}
            alt="Scan to pay via UPI"
            className="ups-qr-img"
            onError={(e) => { e.target.src = 'https://placehold.co/240x240/f8fafc/94a3b8?text=QR+Code'; }}
          />
        </div>

        <div className="ups-upi-chip">
          <span className="ups-upi-chip-label">UPI ID</span>
          <code className="ups-upi-chip-value">{UPI_ID}</code>
        </div>
      </div>

      {/* Steps */}
      <ol className="ups-steps">
        <li><span>Open <strong>{selectedApp.short}</strong> on your phone</span></li>
        <li><span>Tap <strong>Scan QR</strong> or <strong>Pay</strong></span></li>
        <li><span>Scan the QR code above</span></li>
        <li><span>Confirm <strong>₹{rawAmount}</strong> payment</span></li>
      </ol>

      {/* I have paid CTA */}
      {!paid ? (
        <button
          className="ups-paid-btn"
          onClick={() => setPaid(true)}
        >
          <span className="ups-paid-btn-icon">✓</span>
          <span className="ups-paid-btn-text">I have paid</span>
          <span className="ups-paid-btn-sub">Tap after completing payment</span>
        </button>
      ) : (
        <div className="ups-confirm-row">
          <p className="ups-confirm-text">✅ Payment confirmed! Click below to proceed.</p>
          <button
            className="ups-proceed-btn"
            style={{ background: planGradient || 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            onClick={onCapture}
          >
            Proceed to Confirm →
          </button>
        </div>
      )}

      <p className="ups-note">After paying, note your <strong>UTR/Transaction ID</strong> — you'll need it next.</p>
    </div>
  );
}
