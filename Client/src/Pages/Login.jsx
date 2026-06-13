import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const user = {
      name: formData.name.trim() || "FocusHive User",
      email: formData.email.trim(),
      phone: "+91 9XXXXXXXXX",
      location: "India",
      role: "Aspiring Software Developer",
      education: "B.Tech Computer Science",
      experience: "Fresher",
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
    navigate("/profile");
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Login</h1>
        <p>Enter your details to continue to FocusHive.</p>

        <label>
          Full Name
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </label>

        <label>
          Email Address
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </label>

        <button type="submit">Login</button>
        <p className="auth-redirect">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
