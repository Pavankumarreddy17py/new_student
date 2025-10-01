import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SemesterCardProps {
  semesterNumber: number;
}

const SemesterCard: React.FC<SemesterCardProps> = ({ semesterNumber }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/view-results', { state: { selectedSemester: semesterNumber } });
  };
  
  return (
    <div 
      className="card cursor-pointer hover:border-primary border-t-4 border-t-primary transition-all flex flex-col items-center justify-center p-6"
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold text-primary mb-2">Semester {semesterNumber}</h3>
      <p className="text-sm text-gray-500 mb-2">View Details</p>
      
      <div className="mt-2 text-center">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
          {semesterNumber % 2 === 0 ? 'Even' : 'Odd'} Semester
        </span>
      </div>
    </div>
  );
};

export default SemesterCard;