import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudyPlanner from "./pages/StudyPlanner";
import FocusTimer from "./pages/FocusTimer";
import SkillTracker from "./pages/SkillTracker";
import ResumeBuilder from "./pages/ResumeBuilder";
import InterviewPrep from "./pages/InterviewPrep";
import JobSuggestions from "./pages/JobSuggestions";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./Pages/Signup";
import TodaysGoalDetails from "./Components/TodaysGoalDetails";
import AdminPanel from "./Pages/AdminPanel";
import NotesPage from "./Pages/NotesPage";
import ChapterNotes from "./Pages/ChapterNotes";
import Plans from "./Pages/Plans";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/study-planner" element={<StudyPlanner />} />
        <Route path="/timer" element={<FocusTimer />} />
        <Route path="/skill-tracker" element={<SkillTracker />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/job-suggestions" element={<JobSuggestions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/todaysgoaldetails" element={<TodaysGoalDetails />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/notes/:subject" element={<NotesPage />} />
        <Route path="/notes/:subject/:chapter" element={<NotesPage />} />
        <Route path="/plans" element={<Plans />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
