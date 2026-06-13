import React, { useState } from 'react';
import './PaymentScanner.css';

const UPI_ID = 'nk616755-1@okicici';
const MERCHANT_NAME = 'FocusHive';

const UPI_APPS = [
  {
    id: 'gpay',
    name: 'Google Pay',
    shortName: 'GPay',
    color: '#4285F4',
    gradientFrom: '#4285F4',
    gradientTo: '#34A853',
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
    shortName: 'PhonePe',
    color: '#5f259f',
    gradientFrom: '#5f259f',
    gradientTo: '#8b5cf6',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect width="48" height="48" rx="12" fill="#5f259f"/>
        <path d="M24 8C15.2 8 8 15.2 8 24C8 32.8 15.2 40 24 40C32.8 40 40 32.8 40 24C40 15.2 32.8 8 24 8ZM28 28H22V18H28V28Z" fill="white"/>
        <circle cx="24" cy="34" r="2" fill="white"/>
        <path d="M20 14H28C29.1 14 30 14.9 30 16V32C30 33.1 29.1 34 28 34H20C18.9 34 18 33.1 18 32V16C18 14.9 18.9 14 20 14ZM22 32H26V30H22V32Z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'paytm',
    name: 'Paytm',
    shortName: 'Paytm',
    color: '#00BAF2',
    gradientFrom: '#00BAF2',
    gradientTo: '#0077b6',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect width="48" height="48" rx="12" fill="#00BAF2"/>
        <text x="8" y="32" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="white">Pay</text>
        <text x="8" y="42" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#002970">tm</text>
        <rect x="8" y="34" width="32" height="3" rx="1.5" fill="#002970"/>
      </svg>
    ),
  },
  {
    id: 'bhim',
    name: 'BHIM UPI',
    shortName: 'BHIM',
    color: '#ff6b00',
    gradientFrom: '#ff6b00',
    gradientTo: '#f59e0b',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect width="48" height="48" rx="12" fill="#ff6b00"/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="18" fill="white">BHIM</text>
      </svg>
    ),
  },
  {
    id: 'any',
    name: 'Any UPI App',
    shortName: 'Other',
    color: '#10b981',
    gradientFrom: '#10b981',
    gradientTo: '#059669',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect width="48" height="48" rx="12" fill="#10b981"/>
        <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fontSize="26">💳</text>
      </svg>
    ),
  },
];

export default function PaymentScanner({ onCapture, amount, planName }) {
  const [selectedApp, setSelectedApp] = useState(null);

  const rawAmount = amount ? amount.replace('₹', '') : '';
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${rawAmount}&cu=INR&tn=${encodeURIComponent(`FocusHive ${planName || 'Plan'}`)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiLink)}&margin=12&color=000000&bgcolor=ffffff`;

  /* ── App Selection Screen ── */
  if (!selectedApp) {
    return (
      <div className="ps-app-select">
        <p className="ps-select-title">Select your UPI app to pay</p>
        <div className="ps-amount-badge">
          <span className="ps-amount-label">Amount to pay</span>
          <span className="ps-amount-value">{amount}</span>
          <span className="ps-plan-tag">{planName} Plan</span>
        </div>
        <div className="ps-app-grid">
          {UPI_APPS.map((app) => (
            <button
              key={app.id}
              className="ps-app-btn"
              style={{ '--app-color': app.color, '--app-from': app.gradientFrom, '--app-to': app.gradientTo }}
              onClick={() => setSelectedApp(app)}
            >
              <div className="ps-app-icon">{app.icon}</div>
              <span className="ps-app-name">{app.name}</span>
              <span className="ps-app-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── QR Code Screen ── */
  return (
    <div className="ps-qr-screen">
      <button className="ps-back-btn" onClick={() => setSelectedApp(null)}>
        ← Back
      </button>

      <div className="ps-app-selected-badge" style={{ background: `linear-gradient(135deg, ${selectedApp.gradientFrom}, ${selectedApp.gradientTo})` }}>
        {selectedApp.icon}
        <span>Pay with {selectedApp.name}</span>
      </div>

      <div className="ps-qr-container">
        <div className="ps-qr-header">
          <span className="ps-qr-plan">{planName} Plan</span>
          <span className="ps-qr-amount">{amount}</span>
        </div>
        <div className="ps-qr-frame">
          <img
            src={qrUrl}
            alt="UPI QR Code — scan to pay"
            className="ps-qr-img"
            onError={(e) => { e.target.src = 'https://placehold.co/260x260/f8fafc/64748b?text=QR+Loading...'; }}
          />
          <div className="ps-qr-logo">🐝</div>
        </div>
        <div className="ps-upi-row">
          <span className="ps-upi-label">UPI ID</span>
          <code className="ps-upi-code">{UPI_ID}</code>
        </div>
      </div>

      <div className="ps-steps">
        <div className="ps-step"><span className="ps-step-num">1</span>Open {selectedApp.shortName} on your phone</div>
        <div className="ps-step"><span className="ps-step-num">2</span>Tap "Scan QR" or "Pay"</div>
        <div className="ps-step"><span className="ps-step-num">3</span>Point your camera at the code above</div>
        <div className="ps-step"><span className="ps-step-num">4</span>Confirm ₹{rawAmount} payment</div>
      </div>

      <button className="ps-paid-btn" onClick={onCapture}>
        ✅ I have paid – Continue
      </button>
    </div>
  );
}
