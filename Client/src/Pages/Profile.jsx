import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";


const defaultUser = {
  name: "FocusHive User",
  email: "user@example.com",
  phone: "+91 9XXXXXXXXX",
  location: "India",
  role: "Aspiring Software Developer",
  education: "B.Tech Computer Science",
  experience: "Fresher",
  preferredWork: "Remote / Hybrid",
};

const readStoredUser = () => {
  const possibleKeys = ["user", "currentUser", "authUser", "loggedInUser", "profile"];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);
    if (!value) continue;

    try {
      const parsed = JSON.parse(value);
      return parsed?.user || parsed;
    } catch {
      continue;
    }
  }

  return {};
};

const getDisplayUser = () => {
  const storedUser = readStoredUser();

  return {
    ...defaultUser,
    ...storedUser,
    name:
      storedUser.name ||
      storedUser.fullName ||
      storedUser.username ||
      defaultUser.name,
    email: storedUser.email || storedUser.userEmail || defaultUser.email,
    phone: storedUser.phone || storedUser.mobile || storedUser.phoneNumber || defaultUser.phone,
    location: storedUser.location || storedUser.city || defaultUser.location,
    role: storedUser.role || storedUser.profession || defaultUser.role,
    preferredWork: storedUser.preferredWork || defaultUser.preferredWork,
  };
};

const saveUserProfile = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("profile", JSON.stringify(user));
};

const Profile = () => {
  const initialUser = useMemo(() => getDisplayUser(), []);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(initialUser);
  const [formData, setFormData] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeName, setResumeName] = useState(
    localStorage.getItem("resumeName") || "Resume uploaded"
  );
  const [statusMessage, setStatusMessage] = useState("");

  const skills = user.skills?.length
    ? user.skills
    : ["React", "JavaScript", "HTML", "CSS", "Node.js", "MongoDB"];

  const profileStrength = Math.min(
    100,
    35 +
      (user.name !== defaultUser.name ? 15 : 0) +
      (user.email !== defaultUser.email ? 15 : 0) +
      (user.phone !== defaultUser.phone ? 10 : 0) +
      (skills.length >= 4 ? 15 : 0) +
      10
  );

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProfile = () => {
    setFormData(user);
    setIsEditing(true);
    setStatusMessage("");
  };

  const handleCancelEdit = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();

    const updatedUser = {
      ...user,
      ...formData,
      name: formData.name.trim() || user.name,
      email: formData.email.trim() || user.email,
      phone: formData.phone.trim() || user.phone,
      location: formData.location.trim() || user.location,
      role: formData.role.trim() || user.role,
      education: formData.education.trim() || user.education,
      experience: formData.experience.trim() || user.experience,
      preferredWork: formData.preferredWork.trim() || user.preferredWork,
    };

    setUser(updatedUser);
    saveUserProfile(updatedUser);
    setIsEditing(false);
    setStatusMessage("Profile updated successfully.");
  };

  const handleResumeUpdate = () => {
    fileInputRef.current?.click();
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeName(file.name);
    localStorage.setItem("resumeName", file.name);
    setStatusMessage("Resume updated successfully.");
  };

  return (
  
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar" aria-label={`${user.name} initials`}>
          {initials || "FU"}
        </div>

        <div className="profile-identity">
          <span className="profile-kicker">Candidate Profile</span>
          <h1>{user.name}</h1>
          <p>{user.role}</p>

          <div className="profile-quick-info">
            <span>{user.email}</span>
            <span>{user.phone}</span>
            <span>{user.location}</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/job-suggestions" className="profile-primary-btn">
            Find Jobs
          </Link>
          <button type="button" className="profile-secondary-btn" onClick={handleEditProfile}>
            Edit Profile
          </button>
        </div>
      </section>

      {statusMessage && <p className="profile-status">{statusMessage}</p>}

      {isEditing && (
        <section className="profile-edit-panel" aria-label="Edit profile form">
          <div className="profile-panel-header">
            <h2>Edit Profile</h2>
            <span>Personalize</span>
          </div>

          <form className="profile-form" onSubmit={handleSaveProfile}>
            <label>
              Full Name
              <input name="name" value={formData.name} onChange={handleChange} />
            </label>
            <label>
              Email Address
              <input name="email" type="email" value={formData.email} onChange={handleChange} />
            </label>
            <label>
              Phone Number
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </label>
            <label>
              Location
              <input name="location" value={formData.location} onChange={handleChange} />
            </label>
            <label>
              Current Role
              <input name="role" value={formData.role} onChange={handleChange} />
            </label>
            <label>
              Education
              <input name="education" value={formData.education} onChange={handleChange} />
            </label>
            <label>
              Experience
              <input name="experience" value={formData.experience} onChange={handleChange} />
            </label>
            <label>
              Preferred Work
              <input name="preferredWork" value={formData.preferredWork} onChange={handleChange} />
            </label>

            <div className="profile-form-actions">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="profile-metrics" aria-label="Profile metrics">
        <Metric value="8" label="Applied Jobs" />
        <Metric value="5" label="Saved Jobs" />
        <Metric value="2" label="Interviews" />
        <Metric value={`${profileStrength}%`} label="Profile Strength" />
      </section>

      <section className="profile-grid">
        <article className="profile-panel">
          <div className="profile-panel-header">
            <h2>Personal Details</h2>
            <span>Updated</span>
          </div>
          <div className="profile-list">
            <InfoRow label="Full Name" value={user.name} />
            <InfoRow label="Email Address" value={user.email} />
            <InfoRow label="Phone Number" value={user.phone} />
            <InfoRow label="Location" value={user.location} />
          </div>
        </article>

        <article className="profile-panel">
          <div className="profile-panel-header">
            <h2>Career Overview</h2>
            <span>Active</span>
          </div>
          <div className="profile-list">
            <InfoRow label="Current Role" value={user.role} />
            <InfoRow label="Education" value={user.education} />
            <InfoRow label="Experience" value={user.experience} />
            <InfoRow label="Preferred Work" value={user.preferredWork} />
          </div>
        </article>

        <article className="profile-panel">
          <div className="profile-panel-header">
            <h2>Skills</h2>
            <span>{skills.length} skills</span>
          </div>
          <div className="profile-skills">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>

        <article className="profile-panel">
          <div className="profile-panel-header">
            <h2>Resume Status</h2>
            <span>Ready</span>
          </div>
          <div className="resume-card">
            <div>
              <strong>{resumeName}</strong>
              <p>Your resume is ready for job matching and applications.</p>
            </div>
            <button type="button" onClick={handleResumeUpdate}>
              Update
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="profile-hidden-input"
              onChange={handleResumeChange}
            />
          </div>
          <div className="profile-progress">
            <div>
              <span>Profile completion</span>
              <strong>{profileStrength}%</strong>
            </div>
            <div className="profile-progress-track">
              <span style={{ width: `${profileStrength}%` }} />
            </div>
          </div>
        </article>

        <article className="profile-panel profile-panel-wide">
          <div className="profile-panel-header">
            <h2>Recent Activity</h2>
            <span>This week</span>
          </div>
          <div className="activity-list">
            <ActivityItem title="Applied for Frontend Developer" detail="Infosys, Noida" />
            <ActivityItem title="Saved AI/ML Engineer" detail="Accenture, Delhi" />
            <ActivityItem title="Profile matched with React roles" detail="3 strong matches found" />
          </div>
        </article>
      </section>
    </main>
  );
};

const Metric = ({ value, label }) => (
  <article className="profile-metric-card">
    <strong>{value}</strong>
    <span>{label}</span>
  </article>
);

const InfoRow = ({ label, value }) => (
  <div className="profile-info-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const ActivityItem = ({ title, detail }) => (
  <div className="activity-item">
    <span />
    <div>
      <strong>{title}</strong>
      <p>{detail}</p>
    </div>
  </div>
);

export default Profile;
