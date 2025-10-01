import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { semesterSubjects } from '../../data/subjects';
import SubjectInput from './SubjectInput';
import api from '../../services/api';
import { subjectIdMap } from '../../contexts/AuthContext'; // Import subjectIdMap

// Interface for API response mark data
interface ApiMark {
  subject_name: string;
  marks: number;
}

const EnterMarks: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    loadMarks(selectedSemester);
  }, [selectedSemester, user]);

  const loadMarks = async (semester: number) => {
    if (!user) return;

    // Fetch marks from the API
    try {
      const response = await api.get(`/marks/${user.id}`);
      const apiMarks: ApiMark[] = response.data;
      
      const semesterMarks: Record<string, number> = {};
      
      apiMarks.forEach(mark => {
        // Re-map the subject name from the API to the frontend's slug format
        const subjectSlug = mark.subject_name.toLowerCase().replace(/\s+/g, '-');
        
        // Find if this mark belongs to the current semester
        const semesterConfig = semesterSubjects[semester];
        
        const isSubject = semesterConfig?.subjects.some(s => s.toLowerCase().replace(/\s+/g, '-') === subjectSlug);
        const isLab = semesterConfig?.labs?.some(l => l.toLowerCase().replace(/\s+/g, '-') === subjectSlug);

        if (isSubject || isLab) {
            semesterMarks[subjectSlug] = mark.marks;
        }
      });

      setMarks(semesterMarks);

    } catch (error) {
      console.error('Error fetching marks:', error);
      // Fallback to empty marks if API fails
      setMarks({});
    }
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(Number(e.target.value));
  };

  const handleMarkChange = (key: string, value: number) => {
    setMarks(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    
    // Prepare data for API call: map frontend slugs back to subject IDs
    const marksForAPI: Record<string, number> = {};

    for (const [key, mark] of Object.entries(marks)) {
        const subjectId = subjectIdMap[key];
        if (subjectId) {
            // Only send valid marks (0 to max)
            if (mark !== null && mark !== undefined && mark >= 0) {
                marksForAPI[subjectId] = mark;
            }
        }
    }
    
    try {
      await api.post(`/marks/${selectedSemester}`, {
        studentId: user.id,
        marks: marksForAPI
      });
      
      toast.success(`Marks for Semester ${selectedSemester} saved successfully!`);
    } catch (error) {
      console.error('Error saving marks:', error);
      toast.error('Failed to save marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold text-secondary mb-2 md:mb-0">Enter Semester Marks</h2>
          
          <div className="inline-flex items-center">
            <label htmlFor="semester" className="mr-2 text-sm font-medium">Select Semester:</label>
            <select
              id="semester"
              className="form-input py-2 w-40"
              value={selectedSemester}
              onChange={handleSemesterChange}
            >
              {Array.from({ length: semestersToShow }, (_, i) => (
                <option key={i} value={i + 1}>Semester {i + 1}</option>
              ))}
            </select>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-primary mb-4 pb-2 border-b border-gray-200">
              Theory Subjects
            </h3>
            
            <div className="space-y-4">
              {semesterSubjects[selectedSemester]?.subjects.map((subject) => (
                <SubjectInput
                  key={subject}
                  label={subject}
                  // The name here is the slug, used as the key in the `marks` state
                  name={subject.toLowerCase().replace(/\s+/g, '-')}
                  value={marks[subject.toLowerCase().replace(/\s+/g, '-')] ?? ''}
                  onChange={handleMarkChange}
                  max={typeof semesterSubjects[selectedSemester].maxMarks.subject === 'function'
                    ? semesterSubjects[selectedSemester].maxMarks.subject(subject)
                    : semesterSubjects[selectedSemester].maxMarks.subject
                  }
                />
              ))}
            </div>
          </div>
          
          {semesterSubjects[selectedSemester]?.labs && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-primary mb-4 pb-2 border-b border-gray-200">
                Lab Subjects
              </h3>
              
              <div className="space-y-4">
                {semesterSubjects[selectedSemester].labs.map((lab) => (
                  <SubjectInput
                    key={lab}
                    label={lab}
                    name={lab.toLowerCase().replace(/\s+/g, '-')}
                    value={marks[lab.toLowerCase().replace(/\s+/g, '-')] ?? ''}
                    onChange={handleMarkChange}
                    max={semesterSubjects[selectedSemester].maxMarks.lab}
                    isLab={true}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Save Marks
                </>
              )}
            </button>
            
            <button
              type="button"
              className="btn border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterMarks;