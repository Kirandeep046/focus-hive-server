import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  // Ab yahan koi "if condition" nahi hai, isliye yeh har page par dikhega

  return (
    <header className="site-navbar">
      <Link to="/" className="site-navbar-logo">
        FocusHive <span>AI</span>
      </Link>

      <nav className="site-navbar-links" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <Link to="/login" className="site-navbar-cta">
        Get Started
      </Link>
    </header>
  );
};

export default Navbar;