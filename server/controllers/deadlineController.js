const db = require('../config/db');

const getDeadlines = async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT d.*, s.subject_name
            FROM deadlines d
            LEFT JOIN subjects s ON d.subject_id = s.subject_id
            WHERE d.user_id = ?
            ORDER BY d.due_date ASC`,
      args: [req.user.user_id]
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const createDeadline = async (req, res) => {
  try {
    const { title, subject_id, due_date } = req.body;
    if (!title || !due_date)
      return res.status(400).json({ error: 'Title and due date are required' });

    const result = await db.execute({
      sql: 'INSERT INTO deadlines (user_id, subject_id, title, due_date) VALUES (?, ?, ?, ?)',
      args: [req.user.user_id, subject_id || null, title, due_date]
    });
    res.status(201).json({
      message: 'Deadline created',
      deadline_id: Number(result.lastInsertRowid)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateDeadline = async (req, res) => {
  try {
    const { title, due_date, is_done } = req.body;
    const { id } = req.params;
    await db.execute({
      sql: 'UPDATE deadlines SET title = ?, due_date = ?, is_done = ? WHERE deadline_id = ? AND user_id = ?',
      args: [title, due_date, is_done, id, req.user.user_id]
    });
    res.json({ message: 'Deadline updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteDeadline = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: 'DELETE FROM deadlines WHERE deadline_id = ? AND user_id = ?',
      args: [id, req.user.user_id]
    });
    res.json({ message: 'Deadline deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getDeadlines, createDeadline, updateDeadline, deleteDeadline };