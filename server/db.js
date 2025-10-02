// pavankumarreddy17py/new_student/new_student-5dd13c6c821a0a0acaddaf6bb02e8aacbb5e6068/server/db.js

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Pavanreddy@630', // Ensure this password is correct
  database: process.env.DB_NAME || 'student_results',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;