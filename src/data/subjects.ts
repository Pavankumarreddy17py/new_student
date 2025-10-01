export const semesterSubjects: {
  [key: number]: {
    subjects: string[];
    labs?: string[];
    maxMarks: {
      subject: number | ((subject: string) => number);
      lab: number;
    };
  };
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
    maxMarks: { subject: 100, lab: 100 }
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
    maxMarks: { subject: 100, lab: 100 }
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
    maxMarks: { subject: 100, lab: 100 }
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
          return 30;
        }
        return 100;
      },
      lab: 100
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
          return 30;
        }
        return 100;
      },
      lab: 100
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
          return 30;
        }
        return 100;
      },
      lab: 100
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
    maxMarks: { subject: 100, lab: 100 }
  },
  8: {
    subjects: [
      "Internship & Project"
    ],
    maxMarks: { subject: 200, lab: 100 }
  }
};