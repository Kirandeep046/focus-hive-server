import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      alert("Please fill all the fields!");
      return;
    }

    setPopup(true);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">

        <h1>Create Account</h1>
        <p className="subtitle">Sign up to continue</p>

        <form onSubmit={handleSubmit} autoComplete="off" className="signup-form">

          {/* Name */}
          <div className="input-box">
            {/* CHANGED: size ko 20 se hata kar 18 kar diya */}
            <User size={18} className="signup-input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="input-box">
            {/* CHANGED: size ko 20 se hata kar 18 kar diya */}
            <Mail size={18} className="signup-input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-box">
            {/* CHANGED: size ko 20 se hata kar 18 kar diya */}
            <Lock size={18} className="signup-input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {/* CHANGED: size ko 20 se hata kar 18 kar diya aur class add ki */}
              {showPassword ? <EyeOff size={18} className="eye-icon" /> : <Eye size={18} className="eye-icon" />}
            </button>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        {popup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h2>Signup Successful 🎉</h2>

              <button
                onClick={() => {
                  setPopup(false);
                  setName("");
                  setEmail("");
                  setPassword("");
                  navigate("/login");
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}