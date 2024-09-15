import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import Users from './pages/Users';
import Profile from './pages/Profile';

function App() {
  const { currentUser, fetchCounts, postCount } = useAuth();

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
                <Route
                  path="/users"
                  element={<Users />}
                />
                <Route
                  path="/profile"
                  element={
                    <Profile
                      postCount={postCount}
                      fetchCounts={fetchCounts}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/feed" />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
