import express from 'express';
import cors from 'cors';
import pool from './db.js';
import 'dotenv/config'; // Add this line to load .env file
// ... rest of the file
const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
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

/// server/index.js (Modified section)

app.post('/api/marks/:semester', async (req, res) => {
  try {
    // Convert semester parameter to an integer immediately
    const semester = parseInt(req.params.semester, 10);
    const { studentId, marks } = req.body;
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Delete existing marks for this semester
      await connection.query(
        'DELETE FROM marks WHERE student_id = ? AND semester = ?',
        [studentId, semester] // semester is now an integer
      );
      
      // Insert new marks
      for (const [subjectIdString, mark] of Object.entries(marks)) {
        // Convert the subjectId (which comes as a string key) to an integer
        const subjectId = parseInt(subjectIdString, 10);

        await connection.query(
          'INSERT INTO marks (student_id, subject_id, marks, semester) VALUES (?, ?, ?, ?)',
          [studentId, subjectId, mark, semester] // subjectId and semester are now integers
        );
      }
      
      await connection.commit();
      res.json({ message: 'Marks saved successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error saving marks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ... rest of the file

app.get('/api/marks/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const [marks] = await pool.query(
      `SELECT m.*, s.name as subject_name, s.max_marks, s.is_lab 
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