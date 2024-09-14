import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const { currentUser} = useAuth();

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
                
              </>
            )}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
