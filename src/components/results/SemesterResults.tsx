import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResultDetail {
  subject: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  isLab?: boolean;
}

interface SemesterResult {
  semester: number;
  marks: number;
  maxMarks: number;
  percentage: number;
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
                <th className="p-2 text-center">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {result.details.map((detail, index) => (
                <tr key={index} className={`${detail.isLab ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <td className="p-2 border-t">{detail.subject}</td>
                  <td className="p-2 border-t text-center">{detail.marks}</td>
                  <td className="p-2 border-t text-center">{detail.maxMarks}</td>
                  <td className={`p-2 border-t text-center ${getGradeClass(detail.percentage)}`}>
                    {detail.percentage.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-medium">
              <tr>
                <td className="p-2">Total</td>
                <td className="p-2 text-center">{result.marks}</td>
                <td className="p-2 text-center">{result.maxMarks}</td>
                <td className={`p-2 text-center ${getGradeClass(result.percentage)}`}>
                  {result.percentage.toFixed(2)}%
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