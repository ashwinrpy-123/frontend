 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Home } from './pages/Home';
import { QuizPage } from './pages/QuizPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Chatbot } from './pages/Chatbot';
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ element }: { element: React.ReactElement }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? element : <Landing />
}

function App() {
  const { isAuthenticated } = useAuth()
  return (
    <Router>
      <div className="min-h-screen bg-background dark:bg-dark transition-colors">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <Landing />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chatbot" element={<ProtectedRoute element={<Chatbot />} />} />
            <Route path="/quiz" element={<ProtectedRoute element={<QuizPage />} />} />
            <Route path="/flashcards" element={<ProtectedRoute element={<FlashcardsPage />} />} />
            <Route path="/progress" element={<ProtectedRoute element={<ProgressPage />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;