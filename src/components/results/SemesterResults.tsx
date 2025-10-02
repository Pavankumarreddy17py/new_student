// pavankumarreddy17py/new_student/new_student-5dd13c6c821a0a0acaddaf6bb02e8aacbb5e6068/src/components/results/SemesterResults.tsx

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResultDetail {
  subject: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  isLab: boolean;
  // NEW FIELDS
  credits: number;
  grade: string;
  passStatus: 'Pass' | 'Fail' | 'Ab';
}

interface SemesterResult {
  semester: number;
  marks: number;
  maxMarks: number;
  percentage: number;
  // NEW FIELDS
  sgpa: number;
  creditsOffered: number;
  creditsEarned: number;
  details: ResultDetail[];
}

interface SemesterResultsProps {
  result: SemesterResult;
  isSelected: boolean;
  onSelect: () => void;
}

const SemesterResults: React.FC<SemesterResultsProps> = ({ result, isSelected, onSelect }) => {
  const getGradeClass = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 70) return 'text-blue-500';
    if (percentage >= 60) return 'text-yellow-500';
    if (percentage >= 50) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const getPassStatusClass = (status: 'Pass' | 'Fail' | 'Ab') => {
      if (status === 'Pass') return 'bg-green-100 text-green-700';
      if (status === 'Fail') return 'bg-red-100 text-red-700';
      return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className={`p-4 flex items-center justify-between cursor-pointer ${
          isSelected ? 'bg-primary/10' : 'bg-gray-50'
        }`}
        onClick={onSelect}
      >
        <div>
          <h4 className="font-medium">Semester {result.semester}</h4>
          <div className="flex items-center gap-4 text-sm mt-1">
            <span>Marks: {result.marks}/{result.maxMarks}</span>
            <span className={getGradeClass(result.percentage)}>
              {result.percentage.toFixed(2)}%
            </span>
            <span className="font-semibold text-secondary">
                SGPA: {result.creditsOffered > 0 ? result.sgpa.toFixed(2) : 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="rounded-full bg-white p-2">
          {isSelected ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isSelected && (
        <div className="p-4 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-center">Marks</th>
                <th className="p-2 text-center">Max</th>
                <th className="p-2 text-center">Credits</th>
                <th className="p-2 text-center">Grade</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.details.map((detail, index) => (
                <tr key={index} className={`${detail.isLab ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <td className="p-2 border-t">{detail.subject}</td>
                  <td className="p-2 border-t text-center">{detail.marks}</td>
                  <td className="p-2 border-t text-center">{detail.maxMarks}</td>
                  <td className="p-2 border-t text-center">{detail.credits}</td>
                  <td className={`p-2 border-t text-center ${getGradeClass(detail.percentage)}`}>
                    {detail.grade}
                  </td>
                  <td className="p-2 border-t text-center">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getPassStatusClass(detail.passStatus)}`}>
                      {detail.passStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-medium">
              <tr>
                <td className="p-2">Semester Summary</td>
                <td className="p-2 text-center">{result.marks}</td>
                <td className="p-2 text-center">{result.maxMarks}</td>
                <td className="p-2 text-center">{result.creditsEarned} / {result.creditsOffered}</td>
                <td className="p-2 text-center text-secondary">SGPA: {result.sgpa.toFixed(2)}</td>
                <td className={`p-2 text-center ${result.sgpa >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                  Overall: {result.percentage.toFixed(2)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default SemesterResults;