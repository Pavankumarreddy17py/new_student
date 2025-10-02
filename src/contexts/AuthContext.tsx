// pavankumarreddy17py/new_student/new_student-5dd13c6c821a0a0acaddaf6bb02e8aacbb5e6068/src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { semesterSubjects } from '../data/subjects'; // Import subjects data for subject list retrieval

interface User {
  id: string;
  name: string;
  branch: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (id: string, password: string) => Promise<void>;
  register: (id: string, name: string, branch: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get subject ID (needed for mark saving later)
const getSubjectIdMap = () => {
  const subjectMap: Record<string, string> = {};
  let currentId = 1;

  for (const semester in semesterSubjects) {
    const config = semesterSubjects[Number(semester)];
    
    // Subjects
    config.subjects.forEach(subject => {
      const key = subject.toLowerCase().replace(/\s+/g, '-');
      subjectMap[key] = (currentId++).toString();
    });

    // Labs
    if (config.labs) {
      config.labs.forEach(lab => {
        const key = lab.toLowerCase().replace(/\s+/g, '-');
        subjectMap[key] = (currentId++).toString();
      });
    }
  }
  return subjectMap;
};

const subjectIdMap = getSubjectIdMap();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (id: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { id, password });
      
      const loggedInUser: User = response.data;
      
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
    } catch (error) {
      // The Node.js server sends a 401 on invalid credentials.
      throw new Error('Invalid credentials');
    }
  };

  const register = async (id: string, name: string, branch: string, password: string) => {
    try {
      await api.post('/auth/register', { id, name, branch, password });
      
      // Auto-login after successful registration
      const newUser: User = { id, name, branch };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));

    } catch (error: any) {
      // The Node.js server sends a 400 on existing ID.
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the subject map for use in other components like EnterMarks
export { subjectIdMap };