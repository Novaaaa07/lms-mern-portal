import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PortalLanding from './pages/PortalLanding';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StdRegistration from './pages/StdRegistration';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortalLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<AdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/register" element={<StdRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;