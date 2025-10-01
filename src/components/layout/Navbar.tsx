import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Home, BookOpen, PenTool, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between mb-4 md:mb-0">
          <Link to="/dashboard" className="text-xl font-bold text-primary flex items-center">
            <BookOpen size={24} className="mr-2" />
            <span>Results Portal</span>
          </Link>
          
          {user && (
            <div className="md:hidden flex items-center">
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-accent ml-4"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
        
        {user && (
          <div className="flex flex-col md:flex-row">
            <div className="flex items-center mb-4 md:mb-0 md:mr-6">
              <User size={20} className="text-secondary mr-2" />
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.id} | {user.branch}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap md:items-center gap-2 md:gap-4">
              <Link 
                to="/dashboard" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/dashboard' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home size={18} className="mr-1" />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                to="/enter-marks" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/enter-marks' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <PenTool size={18} className="mr-1" />
                <span>Enter Marks</span>
              </Link>
              
              <Link 
                to="/view-results" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/view-results' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BookOpen size={18} className="mr-1" />
                <span>View Results</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="hidden md:flex items-center px-3 py-2 rounded-md text-sm font-medium text-accent hover:bg-accent/10"
              >
                <LogOut size={18} className="mr-1" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;