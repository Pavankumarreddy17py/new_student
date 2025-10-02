// pavankumarreddy17py/new_student/new_student-5dd13c6c821a0a0acaddaf6bb02e8aacbb5e6068/src/data/subjects.ts

export interface SubjectMaxMarks {
  total: number;
  internal: number;
  external: number;
  credits: number;
}

export type SubjectConfig = {
  subjects: string[];
  labs?: string[];
  maxMarks: {
    subject: SubjectMaxMarks | ((subject: string) => SubjectMaxMarks);
    lab: SubjectMaxMarks;
  };
};

// Standard marks for Semesters 1-7 Theory: Total 100, Internal 30, External 70, Credits 3
const STANDARD_THEORY_MARKS: SubjectMaxMarks = {
  total: 100,
  internal: 30,
  external: 70,
  credits: 3
};

// Standard marks for All Labs: Total 100, Internal 30, External 70, Credits 1.5
const STANDARD_LAB_MARKS: SubjectMaxMarks = {
  total: 100,
  internal: 30,
  external: 70,
  credits: 1.5
};

// Subjects with custom low max marks are assumed to be 100% Internal.
const CUSTOM_30_MARKS: SubjectMaxMarks = {
  total: 30,
  internal: 30,
  external: 0,
  credits: 1.5 // Assuming 3 credits for these non-lab theory subjects
};

// Final Year (Sem 8) Project: Total 200, Internal 60, External 140
const PROJECT_200_MARKS: SubjectMaxMarks = {
  total: 200,
  internal: 60,
  external: 140,
  credits: 12 // Assuming 3 credits for the project/internship as per the existing structure
};

export const semesterSubjects: {
  [key: number]: SubjectConfig;
} = {
  1: {
    subjects: [
      "C-PROGRAMMING & DATA STRUCTURES",
      "Chemistry",
      "BASIC ELECTRICAL & ELECTRONICS ENGINEERING",
      "LINEAR ALGEBRA AND CALCULUS"
    ],
    labs: [
      "BASIC ELECTRICAL & ELECTRONICS ENGINEERING LAB",
      "Chemistry Lab",
      "IT WORKSHOP",
      "ENGINEERING WORKSHOP",
      "C-PROGRAMMING & DATA STRUCTURES LAB"
    ],
    maxMarks: { subject: STANDARD_THEORY_MARKS, lab: STANDARD_LAB_MARKS }
  },
  2: {
    subjects: [
      "ENGINEERING DRAWING",
      "COMMUNICATIVE ENGLISH",
      "APPLIED PHYSICS",
      "PYTHON PROGRAMMING & DATA SCIENCE",
      "PROBABILITY & STATISTICS"
    ],
    labs: [
      "APPLIED PHYSICS LAB",
      "ENGINEERING GRAPHICS LAB",
      "COMMUNICATIVE ENGLISH LAB",
      "PYTHON PROGRAMMING & DATA SCIENCE LAB"
    ],
    maxMarks: { subject: STANDARD_THEORY_MARKS, lab: STANDARD_LAB_MARKS }
  },
  3: {
    subjects: [
      "COMPUTER ORGANIZATION",
      "DISCRETE MATHEMATICS & GRAPH THEORY",
      "OBJECT ORIENTED PROGRAMMING THROUGH JAVA",
      "ADVANCED DATA STRUCTURES & ALGORITHMS",
      "DIGITAL ELECTRONICS & MICROPROCESSORS",
      "UNIVERSAL HUMAN VALUES"
    ],
    labs: [
      "OBJECT ORIENTED PROGRAMMING THROUGH JAVA LAB",
      "ADVANCED DATA STRUCTURES & ALGORITHMS LAB",
      "DIGITAL ELECTRONICS & MICROPROCESSORS LAB"
    ],
    maxMarks: { subject: STANDARD_THEORY_MARKS, lab: STANDARD_LAB_MARKS }
  },
  4: {
    subjects: [
      "DATABASE MANAGEMENT SYSTEMS",
      "DETERMINISTIC & STOCHASTIC STATISTICAL METHODS",
      "OPERATING SYSTEMS",
      "SOFTWARE ENGINEERING",
      "MANAGERIAL ECONOMICS & FINANCIAL ANALYSIS",
      "DESIGN THINKING FOR INNOVATION",
      "NSS/NCC/NSO ACTIVITIES",
      "SOC-II: EXPLORATORY DATA ANALYSIS WITH R"
    ],
    labs: [
      "DATABASE MANAGEMENT SYSTEMS LAB",
      "SOFTWARE ENGINEERING LAB",
      "OPERATING SYSTEMS LAB"
    ],
    maxMarks: {
      subject: (subject: string) => {
        if (subject === "NSS/NCC/NSO ACTIVITIES" || subject === "DESIGN THINKING FOR INNOVATION") {
          return CUSTOM_30_MARKS; // Total 30, Internal 30, External 0, Credits 3
        }
        return STANDARD_THEORY_MARKS;
      },
      lab: STANDARD_LAB_MARKS
    }
  },
  5: {
    subjects: [
      "Computer Networks",
      "Artificial Intelligence",
      "SOFTWARE PROJECT MANAGEMENT",
      "FORMAL LANGUAGES AND AUTOMATA THEORY",
      "COMPUTER APPLICATIONS IN FOOD PROCESSING",
      "COMMUNITY SERVICE PROJECT",
      "SOC III-ADVANCED WEB APPLICATION DEVELOPMENT",
      "ENVIRONMENTAL SCIENCE"
    ],
    labs: [
      "COMPUTER NETWORKS LAB",
      "ARTIFICIAL INTELLIGENCE LAB"
    ],
    maxMarks: {
      subject: (subject: string) => {
        if (subject === "ENVIRONMENTAL SCIENCE") {
          return CUSTOM_30_MARKS; // Total 30, Internal 30, External 0, Credits 3
        }
        return STANDARD_THEORY_MARKS;
      },
      lab: STANDARD_LAB_MARKS
    }
  },
  6: {
    subjects: [
      "COMPILER DESIGN",
      "BASIC VLSI DESIGN",
      "Internet of Things",
      "MACHINE LEARNING",
      "SOFTWARE TESTING",
      "SOC-IV:SOFT SKILLS",
      "INTELLECTUAL PROPERTY RIGHTS & PATENTS"
    ],
    labs: [
      "INTERNET OF THINGS LAB",
      "COMPILER DESIGN LAB",
      "MACHINE LEARNING LAB"
    ],
    maxMarks: {
      subject: (subject: string) => {
        if (subject === "INTELLECTUAL PROPERTY RIGHTS & PATENTS") {
          return CUSTOM_30_MARKS; // Total 30, Internal 30, External 0, Credits 3
        }
        return STANDARD_THEORY_MARKS;
      },
      lab: STANDARD_LAB_MARKS
    }
  },
  7: {
    subjects: [
      "Management Science",
      "Numerical Methods for Engineers",
      "Health Safety & Environmental Management",
      "Cloud Computing",
      "Full Stack Development",
      "Cryptography & Network Security",
      "Evaluation of Industry Internship",
      "SOC-V Mobile Application Development"
    ],
    // Assuming these are standard theory subjects, credits for Internship Evaluation is 3.
    maxMarks: { subject: STANDARD_THEORY_MARKS, lab: STANDARD_LAB_MARKS }
  },
  8: {
    subjects: [
      "Internship & Project"
    ],
    maxMarks: { 
        subject: PROJECT_200_MARKS, // Total 200, Internal 60, External 140, Credits 3
        lab: STANDARD_LAB_MARKS // No labs in Sem 8, but for type consistency
    }
  }
};