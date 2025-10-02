// pavankumarreddy17py/new_student/new_student-5dd13c6c821a0a0acaddaf6bb02e8aacbb5e6068/src/components/results/ViewResults.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; 
import { semesterSubjects, SubjectMaxMarks } from '../../data/subjects';
import SemesterResults from './SemesterResults';
import api from '../../services/api';

// Interface for API response mark data
interface ApiMark {
  semester: number;
  internal_marks: number | null; // New field from DB
  external_marks: number | null; // New field from DB
  max_marks: number; 
  subject_name: string;
  is_lab: boolean;
}

interface GradeResult {
  grade: string;
  gradePoints: number; // Still required for SGPA/CGPA calculation
}

interface ProcessedResultDetail {
  subject: string;
  marks: number; 
  maxMarks: number;
  percentage: number;
  isLab: boolean;
  internalMarks: number; // New field for display
  externalMarks: number; // New field for display
  credits: number;
  grade: string;
  gradePoints: number; // Kept for SGPA calculation consistency
  passStatus: 'Pass' | 'Fail' | 'Ab';
}

interface ProcessedSemesterResult {
  semester: number;
  marks: number;
  maxMarks: number;
  percentage: number;
  sgpa: number;
  creditsOffered: number;
  creditsEarned: number;
  details: ProcessedResultDetail[];
}

// --- NEW HELPER FUNCTIONS (Outside Component) ---

// Helper function to safely get SubjectMaxMarks from subjects.ts
const getSubjectMaxMarks = (semester: number, subject: string, isLab: boolean): SubjectMaxMarks => {
  const config = semesterSubjects[semester];
  const DEFAULT_MARKS: SubjectMaxMarks = { total: 100, internal: 30, external: 70, credits: isLab ? 1.5 : 3 };
  if (!config) return DEFAULT_MARKS;
  
  const marksConfig = isLab ? config.maxMarks.lab : config.maxMarks.subject;
  
  if (typeof marksConfig === 'function') {
    return marksConfig(subject);
  }
  
  return (marksConfig || DEFAULT_MARKS) as SubjectMaxMarks;
};

// FIX: Corrected the return type and added grade points back for calculation logic
const getGradeAndPoints = (percentage: number): GradeResult => {
  if (percentage >= 90) return { grade: 'S', gradePoints: 10 };
  if (percentage >= 80) return { grade: 'A', gradePoints: 9 };
  if (percentage >= 70) return { grade: 'B', gradePoints: 8 };
  if (percentage >= 60) return { grade: 'C', gradePoints: 7 };
  if (percentage >= 50) return { grade: 'D', gradePoints: 6 };
  if (percentage >= 40) return { grade: 'Y', gradePoints: 5 };
  return { grade: 'F', gradePoints: 0 };
};

const getPassStatus = (internalMarks: number, externalMarks: number, maxMarks: SubjectMaxMarks): 'Pass' | 'Fail' | 'Ab' => {
  const totalMarks = internalMarks + externalMarks;
  
  if (totalMarks === 0 && maxMarks.total > 0) return 'Ab'; 
  
  const totalPass = maxMarks.total * 0.4;
  const INT_PASS = maxMarks.internal === 60 ? 24 : 15;
  const EXT_PASS = maxMarks.external === 140 ? 56 : 25;

  // 1. Check for pass in Internal and External components
  const passedInternal = maxMarks.internal > 0 ? (internalMarks >= INT_PASS) : true;
  const passedExternal = maxMarks.external > 0 ? (externalMarks >= EXT_PASS) : true;
  
  // 2. Check Special Case: Internal Marks (10 or less) requires External Marks (30+)
  const isStandardTheory = maxMarks.internal === 30 && maxMarks.external === 70;
  const specialCaseFail = isStandardTheory && (internalMarks <= 10 && externalMarks < 30);

  if (passedInternal && passedExternal && totalMarks >= totalPass && !specialCaseFail) {
      return 'Pass';
  }

  return 'Fail';
};

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
  const [cumulativeCreditsEarned, setCumulativeCreditsEarned] = useState(0);
  const [cumulativeCreditsOffered, setCumulativeCreditsOffered] = useState(0);

  const getSemestersToShow = useCallback(() => {
    if (!user) return 0;
    
    const studentIdPrefix = user.id.substring(0, 2);
    
    if (studentIdPrefix === '28') return 2; 
    if (studentIdPrefix === '27') return 4; 
    if (studentIdPrefix === '26') return 6; 
    if (studentIdPrefix === '25') return 8; 
    
    return 0;
  }, [user]);

  const semestersToShow = getSemestersToShow(); 

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

  const calculateCGPA = (cumulativeGradePoints: number, cumulativeCreditsOffered: number): number => {
    if (cumulativeCreditsOffered === 0) {
        const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks * 100) : 0;
        return percentage / 10;
    }
    return cumulativeGradePoints / cumulativeCreditsOffered;
  };

    const loadResults = useCallback(async () => {
        if (!user) return;
        
        try {
            const response = await api.get(`/marks/${user.id}`);
            const apiMarks: ApiMark[] = response.data;
            
            const resultsMap: Record<number, {
              totalMarks: number;
              totalMaxMarks: number;
              totalCreditsOffered: number;
              totalCreditsEarned: number;
              totalGradePoints: number;
              details: ProcessedResultDetail[];
            }> = {};

            apiMarks.forEach(mark => {
                if (!resultsMap[mark.semester]) {
                    resultsMap[mark.semester] = {
                        totalMarks: 0,
                        totalMaxMarks: 0,
                        totalCreditsOffered: 0,
                        totalCreditsEarned: 0,
                        totalGradePoints: 0,
                        details: []
                    };
                }
                
                // Calculate the total mark from the split fields (defaulting nulls to 0)
                const internalMark = mark.internal_marks ?? 0;
                const externalMark = mark.external_marks ?? 0;
                const totalMark = internalMark + externalMark;  

                // 1. Get detailed max marks and credits from subjects.ts
                const subjectMaxMarks = getSubjectMaxMarks(mark.semester, mark.subject_name, mark.is_lab);
                const maxMark = subjectMaxMarks.total;
                const creditsOffered = subjectMaxMarks.credits;

                const percentage = maxMark > 0 ? (totalMark / maxMark * 100) : 0;
                
                // 2. Determine Pass Status using both internal and external marks
                const passStatus = getPassStatus(internalMark, externalMark, subjectMaxMarks);

                // 3. Get Grade and Grade Points
                const { grade, gradePoints: calculatedGradePoints } = getGradeAndPoints(percentage);
                
                // FIX: Correct calculation of finalGradePoints and creditsEarned
                const finalGradePoints = passStatus === 'Pass' ? calculatedGradePoints : 0;
                const creditsEarned = passStatus === 'Pass' ? creditsOffered : 0;
                
                // 4. Accumulate totals for the semester
                resultsMap[mark.semester].totalMarks += totalMark;
                resultsMap[mark.semester].totalMaxMarks += maxMark;
                resultsMap[mark.semester].totalCreditsOffered += creditsOffered;
                resultsMap[mark.semester].totalCreditsEarned += creditsEarned;
                resultsMap[mark.semester].totalGradePoints += (finalGradePoints * creditsOffered); 
                
                // 5. Build detail object
                resultsMap[mark.semester].details.push({
                    subject: mark.subject_name,
                    marks: totalMark,
                    maxMarks: maxMark,
                    percentage: percentage,
                    isLab: mark.is_lab,
                    internalMarks: internalMark, 
                    externalMarks: externalMark, 
                    credits: creditsOffered,
                    grade: grade,
                    gradePoints: finalGradePoints,
                    passStatus: passStatus,
                });
            });

            // 6. Final totals and result array generation (same logic)
            let overallTotalM = 0;
            let overallTotalMaxM = 0;
            let overallTotalCreditsOffered = 0;
            let overallTotalCreditsEarned = 0;
            let overallTotalGradePoints = 0;
            const finalResults: ProcessedSemesterResult[] = [];
            
            for (let i = 1; i <= semestersToShow; i++) {
                const result = resultsMap[i];
                if (result) {
                    overallTotalM += result.totalMarks;
                    overallTotalMaxM += result.totalMaxMarks;
                    overallTotalCreditsOffered += result.totalCreditsOffered;
                    overallTotalCreditsEarned += result.totalCreditsEarned;
                    overallTotalGradePoints += result.totalGradePoints;
                    
                    const sgpa = result.totalCreditsOffered > 0 
                                ? result.totalGradePoints / result.totalCreditsOffered 
                                : 0;

                    finalResults.push({
                        semester: i,
                        marks: result.totalMarks,
                        maxMarks: result.totalMaxMarks,
                        percentage: result.totalMaxMarks > 0 ? (result.totalMarks / result.totalMaxMarks * 100) : 0,
                        sgpa: sgpa,
                        creditsOffered: result.totalCreditsOffered,
                        creditsEarned: result.totalCreditsEarned,
                        details: result.details
                    });
                }
            }

            setSemesterResults(finalResults);
            setTotalMarks(overallTotalM);
            setTotalMaxMarks(overallTotalMaxM);
            setCumulativeCreditsEarned(overallTotalCreditsEarned);
            setCumulativeCreditsOffered(overallTotalCreditsOffered);

        } catch (error) {
            console.error('Error loading results:', error);
            setSemesterResults([]);
            setTotalMarks(0);
            setTotalMaxMarks(0);
            setCumulativeCreditsEarned(0);
            setCumulativeCreditsOffered(0);
        }
    }, [user, semestersToShow]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const handleGoBack = () => {
    navigate('/dashboard');
  };
  
  const cumulativeGradePoints = semesterResults.reduce((sum, result) => {
    const semesterGradePointsSum = result.details.reduce((subSum, detail) => 
        subSum + (detail.gradePoints * detail.credits)
    , 0);
    return sum + semesterGradePointsSum;
  }, 0);
  
  const overallCGPA = calculateCGPA(cumulativeGradePoints, cumulativeCreditsOffered);

  return (
    <div className="fade-in">
      {/* ... (JSX for headers and overall stats remains the same) */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Academic Results</h2>
            <p className="text-white/90">{user?.name} | {user?.id} | {user?.branch}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div>
              <p className="text-sm">Overall Credits</p>
              <p className="text-2xl font-bold">
                {cumulativeCreditsEarned} <span className="text-gray-500 text-lg">/ {cumulativeCreditsOffered}</span>
              </p>
            </div>
            
            <div>
              <p className="text-sm">CGPA</p>
              <p className="text-2xl font-bold">
                {overallCGPA.toFixed(2)}/10
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
              <p className="text-sm text-gray-600 mb-1">Credits Earned</p>
              <p className="text-2xl font-bold">{cumulativeCreditsEarned} <span className="text-gray-500 text-lg">/ {cumulativeCreditsOffered}</span></p>
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