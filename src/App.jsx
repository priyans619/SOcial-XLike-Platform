import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  const {} = useAuth();

  return (
    <AuthProvider>
      <Router>
        
      </Router>
    </AuthProvider>
  );
}

export default App;
