import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import EnterMarks from './components/marks/EnterMarks';
import ViewResults from './components/results/ViewResults';
import Layout from './components/layout/Layout';
import Footer from './components/layout/Footer';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/enter-marks" 
            element={isAuthenticated ? <EnterMarks /> : <Navigate to="/" />} 
          />
          <Route 
            path="/view-results" 
            element={isAuthenticated ? <ViewResults /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
      <Footer />
    </div>
  );
};

export default App;