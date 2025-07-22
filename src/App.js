import React, { useEffect } from 'react';
import LoginForm from './Components/LoginForm/LoginForm';
import ProjectForm from './Components/ProjectForm/ProjectForm';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log('Inactivity timeout reached. Logging out.');
        localStorage.removeItem('token');
        alert('Session expired due to 5 minutes of inactivity. Please log in again.');
        navigate('/login');
      }, 60 * 60 * 1000);
    };
    const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/project-form" element={token ? <ProjectForm /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={token ? '/project-form' : '/login'} />} />
    </Routes>
  );
}

export default App;