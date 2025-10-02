// pavankumarreddy17py/new_student/new_student-5dd13c6c821a0a0acaddaf6bb02e8aacbb5e6068/src/components/marks/EnterMarks.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { semesterSubjects, SubjectMaxMarks } from '../../data/subjects';
import SubjectInput from './SubjectInput';
import api from '../../services/api';
import { subjectIdMap } from '../../contexts/AuthContext';

// Interface for API response mark data
interface ApiMark {
  subject_name: string;
  internal_marks: number | null; 
  external_marks: number | null; 
}

interface SubjectMarkSplit {
    internal: number | '';
    external: number | '';
}

const getSubjectMaxMarks = (semester: number, subject: string, isLab: boolean): SubjectMaxMarks => {
  const config = semesterSubjects[semester];
  const DEFAULT_MARKS: SubjectMaxMarks = { total: 100, internal: 30, external: 70, credits: isLab ? 1.5 : 3 };
  if (!config) return DEFAULT_MARKS;
  
  const marks = isLab ? config.maxMarks.lab : config.maxMarks.subject;
  
  if (typeof marks === 'function') {
    return marks(subject);
  }
  return (marks || DEFAULT_MARKS) as SubjectMaxMarks;
};

const EnterMarks: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [marks, setMarks] = useState<Record<string, SubjectMarkSplit>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const findApiMark = (apiMarks: ApiMark[], subjectSlug: string): ApiMark | undefined => {
    return apiMarks.find(mark => mark.subject_name.toLowerCase().replace(/\s+/g, '-') === subjectSlug);
  };

  const loadMarks = async (semester: number) => {
    if (!user) return;

    try {
      const response = await api.get(`/marks/${user.id}`);
      const apiMarks: ApiMark[] = response.data;
      
      const semesterMarks: Record<string, SubjectMarkSplit> = {};
      const semesterConfig = semesterSubjects[semester];

      if (semesterConfig) {
          const allSubjectSlugs = [
              ...semesterConfig.subjects, 
              ...(semesterConfig.labs || [])
          ].map(s => s.toLowerCase().replace(/\s+/g, '-'));

          allSubjectSlugs.forEach((subjectSlug) => {
              const apiMarkEntry = findApiMark(apiMarks, subjectSlug);
              
              if (apiMarkEntry) {
                  semesterMarks[subjectSlug] = { 
                      internal: apiMarkEntry.internal_marks ?? 0, 
                      external: apiMarkEntry.external_marks ?? 0
                  };
              } else {
                  semesterMarks[subjectSlug] = { internal: '', external: '' };
              }
          });
      }
      
      setMarks(semesterMarks);

    } catch (error) {
      console.error('Error fetching marks:', error);
      setMarks({});
    }
  };

  useEffect(() => {
    loadMarks(selectedSemester);
  }, [selectedSemester, user]);

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(Number(e.target.value));
  };

  const handleMarkChange = (key: string, field: 'internal' | 'external', value: number | '') => {
    const isLab = semesterSubjects[selectedSemester]?.labs?.some(l => l.toLowerCase().replace(/\s+/g, '-') === key);
    const maxMarks = getSubjectMaxMarks(selectedSemester, key, isLab || false);

    // Client-side validation to cap the mark
    if (field === 'internal' && typeof value === 'number' && value > maxMarks.internal) {
        value = maxMarks.internal;
    }
    if (field === 'external' && typeof value === 'number' && value > maxMarks.external) {
        value = maxMarks.external;
    }

    setMarks(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    
    const marksForAPI: Record<string, { internal: number, external: number }> = {};

    for (const [slug, markSplit] of Object.entries(marks)) {
        const subjectId = subjectIdMap[slug];
        
        if (subjectId) {
            // FIX: Ensure empty strings (user input) are converted to 0 for API call
            const internal = typeof markSplit.internal === 'number' ? markSplit.internal : 0;
            const external = typeof markSplit.external === 'number' ? markSplit.external : 0;

            // Only send marks if at least one field has a value > 0
            if (internal > 0 || external > 0) {
                marksForAPI[subjectId] = { internal, external }; 
            }
        }
    }
    
    try {
      const response = await api.post(`/marks/${selectedSemester}`, {
        studentId: user.id,
        marks: marksForAPI 
      });
      
      toast.success(response.data.message || `Marks for Semester ${selectedSemester} saved successfully!`);
      // Reload marks after successful save to update the view
      loadMarks(selectedSemester);
    } catch (error: any) {
      console.error('Error saving marks:', error);
      toast.error(error.response?.data?.message || 'Failed to save marks. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const renderSubjectInputs = (subjects: string[], isLab: boolean) => {
    return subjects.map((subject) => {
      const subjectSlug = subject.toLowerCase().replace(/\s+/g, '-');
      const maxMarks = getSubjectMaxMarks(selectedSemester, subject, isLab);

      if (maxMarks.total === 0) return null;

      return (
        <SubjectInput
          key={subject}
          label={subject}
          name={subjectSlug}
          internalValue={marks[subjectSlug]?.internal ?? ''}
          externalValue={marks[subjectSlug]?.external ?? ''}
          onChange={handleMarkChange}
          maxInternal={maxMarks.internal}
          maxExternal={maxMarks.external}
          isLab={isLab}
        />
      );
    });
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
              {semesterSubjects[selectedSemester]?.subjects && renderSubjectInputs(semesterSubjects[selectedSemester].subjects, false)}
            </div>
          </div>
          
          {semesterSubjects[selectedSemester]?.labs && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-primary mb-4 pb-2 border-b border-gray-200">
                Lab Subjects
              </h3>
              
              <div className="space-y-4">
                {renderSubjectInputs(semesterSubjects[selectedSemester].labs || [], true)}
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