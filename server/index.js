// pavankumarreddy17py/new_student/new_student-5dd13c6c821a0a0acaddaf6bb02e8aacbb5e6068/server/index.js

import express from 'express';
import cors from 'cors';
import pool from './db.js';
import 'dotenv/config'; 
const app = express();

app.use(cors());
app.use(express.json());

// Auth routes (unchanged)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { id, name, branch, password } = req.body;
    
    const [existingUser] = await pool.query(
      'SELECT id FROM students WHERE id = ?',
      [id]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }
    
    await pool.query(
      'INSERT INTO students (id, name, branch, password) VALUES (?, ?, ?, ?)',
      [id, name, branch, password]
    );
    
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { id, password } = req.body;
    
    const [user] = await pool.query(
      'SELECT id, name, branch FROM students WHERE id = ? AND password = ?',
      [id, password]
    );
    
    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// MARK: FINAL FIXED POST /api/marks/:semester
app.post('/api/marks/:semester', async (req, res) => {
  try {
    const semester = parseInt(req.params.semester, 10);
    const { studentId, marks } = req.body; 
    
    if (!studentId || !marks || Object.keys(marks).length === 0) {
        return res.status(400).json({ message: 'Invalid mark submission data: Missing student ID or marks.' });
    }

    const connection = await pool.getConnection();
    
    try {
      // 1. Begin Transaction
      await connection.beginTransaction();

      // 2. Delete existing marks for idempotency
      await connection.query(
        'DELETE FROM marks WHERE student_id = ? AND semester = ?',
        [studentId, semester]
      );
      
      // 3. Insert new marks
      for (const [subjectIdString, markSplit] of Object.entries(marks)) {
        const subjectId = parseInt(subjectIdString, 10);
        
        // Use property access with safe defaults and parseInt for strict integer conversion
        const rawInternal = markSplit ? markSplit.internal : 0;
        const rawExternal = markSplit ? markSplit.external : 0;
        
        // Math.max(0, ...) prevents negative values
        const internal = Math.max(0, parseInt(rawInternal, 10) || 0);
        const external = Math.max(0, parseInt(rawExternal, 10) || 0);

        if (internal === 0 && external === 0) continue; // Skip if no mark was actually entered
        
        await connection.query(
          'INSERT INTO marks (student_id, subject_id, internal_marks, external_marks, semester) VALUES (?, ?, ?, ?, ?)',
          [studentId, subjectId, internal, external, semester]
        );
      }
      
      // 4. Commit transaction
      await connection.commit();
      res.json({ message: 'Marks saved successfully' });
    } catch (error) {
      // 5. Rollback on error
      await connection.rollback();
      // CRITICAL LOGGING: This prints the exact SQL error (e.g., Foreign Key failure)
      console.error('CRITICAL SQL ERROR DURING MARKS INSERTION:', error); 
      res.status(500).json({ message: 'Server error occurred during save. Check console for SQL details.' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error saving marks (Outer Catch):', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// MARK: GET /api/marks/:studentId 
app.get('/api/marks/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const [marks] = await pool.query(
      `SELECT m.semester, m.internal_marks, m.external_marks, s.name as subject_name, s.max_marks, s.is_lab 
       FROM marks m 
       JOIN subjects s ON m.subject_id = s.id 
       WHERE m.student_id = ?`,
      [studentId]
    );
    
    res.json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});