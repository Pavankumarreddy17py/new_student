import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, ClipboardList, Award, PenTool } from 'lucide-react';
import SemesterCard from './SemesterCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Determine how many semesters to show based on student ID prefix (year)
  const getSemestersToShow = () => {
    if (!user) return 0;
    
    const studentIdPrefix = user.id.substring(0, 2);
    
    if (studentIdPrefix === '28') return 2; // 1st year
    if (studentIdPrefix === '27') return 4; // 2nd year
    if (studentIdPrefix === '26') return 6; // 3rd year
    if (studentIdPrefix === '25') return 8; // 4th year
    
    return 0;
  };
  
  const semestersToShow = getSemestersToShow();
  
  return (
    <div className="fade-in">
      <div className="card mb-6 bg-gradient-to-r from-primary to-secondary text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-white/90">
          <p><span className="font-medium">ID:</span> {user?.id}</p>
          <p><span className="font-medium">Branch:</span> {user?.branch}</p>
        </div>
      </div>
      
      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-secondary mb-6 pb-2 border-b border-gray-200">
          Academic Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary/10 rounded-lg p-4 flex items-center">
            <div className="rounded-full bg-primary p-3 mr-4">
              <Award size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Semesters</h3>
              <p className="text-2xl font-semibold">{semestersToShow}</p>
            </div>
          </div>
          
          <div className="bg-secondary/10 rounded-lg p-4 flex items-center">
            <div className="rounded-full bg-secondary p-3 mr-4">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Current Year</h3>
              <p className="text-2xl font-semibold">
                {user?.id.substring(0, 2) === '28' ? '1st' : 
                 user?.id.substring(0, 2) === '27' ? '2nd' : 
                 user?.id.substring(0, 2) === '26' ? '3rd' : '4th'}
              </p>
            </div>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-4 flex items-center">
            <div className="rounded-full bg-accent p-3 mr-4">
              <ClipboardList size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Current Status</h3>
              <p className="text-2xl font-semibold">Active</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-secondary mb-4">Semester Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: semestersToShow }, (_, i) => (
            <SemesterCard key={i} semesterNumber={i + 1} />
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={() => navigate('/enter-marks')}
            className="btn btn-primary"
          >
            <PenTool size={20} className="mr-2" />
            Enter Marks
          </button>
          
          <button
            onClick={() => navigate('/view-results')}
            className="btn btn-secondary"
          >
            <BookOpen size={20} className="mr-2" />
            View Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;