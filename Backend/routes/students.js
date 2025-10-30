import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Lấy tất cả sinh viên
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Thêm sinh viên
router.post('/', async (req, res) => {
  const { ma, hoTen, ngaySinh, lop } = req.body;
  try {
    await pool.query(
      'INSERT INTO students (ma, hoTen, ngaySinh, lop) VALUES (?, ?, ?, ?)',
      [ma, hoTen, ngaySinh, lop]
    );
    res.send('Student added');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Cập nhật sinh viên
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { ma, hoTen, ngaySinh, lop } = req.body;
  try {
    await pool.query(
      'UPDATE students SET ma=?, hoTen=?, ngaySinh=?, lop=? WHERE id=?',
      [ma, hoTen, ngaySinh, lop, id]
    );
    res.send('Student updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Xóa sinh viên
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM students WHERE id=?', [id]);
    res.send('Student deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
