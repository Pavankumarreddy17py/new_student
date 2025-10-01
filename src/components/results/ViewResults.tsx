import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { semesterSubjects } from '../../data/subjects';
import SemesterResults from './SemesterResults';
import api from '../../services/api';

// Interface for API response mark data
interface ApiMark {
  semester: number;
  marks: number;
  max_marks: number;
  subject_name: string;
  is_lab: boolean;
}

interface ProcessedResultDetail {
  subject: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  isLab?: boolean;
}

interface ProcessedSemesterResult {
  semester: number;
  marks: number;
  maxMarks: number;
  percentage: number;
  details: ProcessedResultDetail[];
}

const ViewResults: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSemester, setSelectedSemester] = useState<number | null>(
    location.state?.selectedSemester || null
  );
  const [totalMarks, setTotalMarks] = useState(0);
  const [totalMaxMarks, setTotalMaxMarks] = useState(0);
  const [semesterResults, setSemesterResults] = useState<ProcessedSemesterResult[]>([]);

  const calculateCGPA = (percentage: number): number => {
    return percentage / 10;
  };

  // Determine which semesters to show based on student ID prefix (year)
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

  useEffect(() => {
    loadResults();
  }, [user]);

  const loadResults = async () => {
    if (!user) return;
    
    try {
      // 1. Fetch all marks for the student from the API
      const response = await api.get(`/marks/${user.id}`);
      const apiMarks: ApiMark[] = response.data;
      
      const resultsMap: Record<number, {
        totalMarks: number;
        totalMaxMarks: number;
        details: ProcessedResultDetail[];
      }> = {};

      // 2. Group and process marks by semester
      apiMarks.forEach(mark => {
        if (!resultsMap[mark.semester]) {
          resultsMap[mark.semester] = {
            totalMarks: 0,
            totalMaxMarks: 0,
            details: []
          };
        }
        
        // Find the correct max marks from the frontend config (as some subjects have custom max marks)
        let maxMark = mark.max_marks;
        const semesterConfig = semesterSubjects[mark.semester];
        
        if (semesterConfig?.maxMarks.subject) {
            if (typeof semesterConfig.maxMarks.subject === 'function' && !mark.is_lab) {
                // Use the custom function if applicable and it's not a lab
                maxMark = semesterConfig.maxMarks.subject(mark.subject_name);
            } else if (mark.is_lab) {
                maxMark = semesterConfig.maxMarks.lab;
            } else if (typeof semesterConfig.maxMarks.subject === 'number' && !mark.is_lab) {
                maxMark = semesterConfig.maxMarks.subject;
            }
        }

        const percentage = maxMark > 0 ? (mark.marks / maxMark * 100) : 0;
        
        resultsMap[mark.semester].totalMarks += mark.marks;
        resultsMap[mark.semester].totalMaxMarks += maxMark;
        
        resultsMap[mark.semester].details.push({
          subject: mark.subject_name,
          marks: mark.marks,
          maxMarks: maxMark,
          percentage: percentage,
          isLab: mark.is_lab,
        });
      });
      
      // 3. Convert map to final results array and calculate overall totals
      let overallTotalM = 0;
      let overallTotalMaxM = 0;
      const finalResults: ProcessedSemesterResult[] = [];
      
      // Only iterate through relevant semestersToShow
      for (let i = 1; i <= semestersToShow; i++) {
          const result = resultsMap[i];
          if (result) {
              overallTotalM += result.totalMarks;
              overallTotalMaxM += result.totalMaxMarks;
              
              finalResults.push({
                  semester: i,
                  marks: result.totalMarks,
                  maxMarks: result.totalMaxMarks,
                  percentage: result.totalMaxMarks > 0 ? (result.totalMarks / result.totalMaxMarks * 100) : 0,
                  details: result.details
              });
          }
      }

      setSemesterResults(finalResults);
      setTotalMarks(overallTotalM);
      setTotalMaxMarks(overallTotalMaxM);

    } catch (error) {
      console.error('Error loading results:', error);
      // Handle API errors
      setSemesterResults([]);
      setTotalMarks(0);
      setTotalMaxMarks(0);
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const getGradeClass = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 70) return 'text-blue-500';
    if (percentage >= 60) return 'text-yellow-500';
    if (percentage >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getGradeText = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding';
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 70) return 'Very Good';
    if (percentage >= 60) return 'Good';
    if (percentage >= 50) return 'Satisfactory';
    if (percentage >= 40) return 'Pass';
    return 'Fail';
  };

  return (
    <div className="fade-in">
      <div className="card bg-gradient-to-r from-primary to-secondary text-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Academic Results</h2>
            <p className="text-white/90">{user?.name} | {user?.id} | {user?.branch}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div>
              <p className="text-sm">Overall Percentage</p>
              <p className="text-2xl font-bold">
                {totalMaxMarks > 0 ? (totalMarks / totalMaxMarks * 100).toFixed(2) : 0}%
              </p>
            </div>
            
            <div>
              <p className="text-sm">CGPA</p>
              <p className="text-2xl font-bold">
                {totalMaxMarks > 0 ? calculateCGPA(totalMarks / totalMaxMarks * 100).toFixed(2) : 0}/10
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold text-secondary mb-4">Semester-wise Results</h3>
          
          {semesterResults.length > 0 ? (
            <div className="space-y-4">
              {semesterResults.map((result) => (
                <SemesterResults
                  key={result.semester}
                  result={result}
                  isSelected={selectedSemester === result.semester}
                  onSelect={() => setSelectedSemester(selectedSemester === result.semester ? null : result.semester)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No results data available. Please enter marks for at least one semester.</p>
            </div>
          )}
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary mb-4">Results Summary</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">Total Marks</p>
              <p className="text-2xl font-bold">
                {totalMarks} <span className="text-gray-500 text-lg">/ {totalMaxMarks}</span>
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">Overall Percentage</p>
              <p className={`text-2xl font-bold ${getGradeClass(totalMaxMarks > 0 ? (totalMarks / totalMaxMarks * 100) : 0)}`}>
                {totalMaxMarks > 0 ? (totalMarks / totalMaxMarks * 100).toFixed(2) : 0}%
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">Performance</p>
              <p className={`text-2xl font-bold ${getGradeClass(totalMaxMarks > 0 ? (totalMarks / totalMaxMarks * 100) : 0)}`}>
                {getGradeText(totalMaxMarks > 0 ? (totalMarks / totalMaxMarks * 100) : 0)}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">Semesters Completed</p>
              <p className="text-2xl font-bold">{semesterResults.length} <span className="text-gray-500 text-lg">/ {semestersToShow}</span></p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <button
          className="btn border border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={handleGoBack}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ViewResults;