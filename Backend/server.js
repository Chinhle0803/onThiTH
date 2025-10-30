import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { pool } from './db.js';

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// ✅ Không cần app.options('*', cors())

// ================== ROUTES ==================
app.get('/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/students', async (req, res) => {
  const { ma, hoTen, ngaySinh, lop } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO students (ma, hoTen, ngaySinh, lop) VALUES (?, ?, ?, ?)',
      [ma, hoTen, ngaySinh, lop]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  let { ma, hoTen, ngaySinh, lop } = req.body;
  try {
    if (ngaySinh && ngaySinh.includes('T')) {
      ngaySinh = ngaySinh.split('T')[0];
    }
    const [result] = await pool.query(
      'UPDATE students SET ma=?, hoTen=?, ngaySinh=?, lop=? WHERE id=?',
      [ma, hoTen, ngaySinh, lop, id]
    );
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Deleting student id =', id);
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id=?', [id]);
    console.log('Delete result:', result);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: `Student with id ${id} not found` });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/students', async (req, res) => {
  try {
    await pool.query('DELETE FROM students');
    res.json({ message: 'All students deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
