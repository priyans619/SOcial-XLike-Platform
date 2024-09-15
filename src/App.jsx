import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';

function App() {
  const { currentUser, fetchCounts } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {currentUser && <Navbar />}
          <Routes>
            {!currentUser ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route
                  path="/feed"
                  element={<Feed fetchCounts={fetchCounts} />}
                />
                
              </>
            )}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
