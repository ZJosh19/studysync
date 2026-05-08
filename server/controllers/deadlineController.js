const db = require('../config/db');

// GET all deadlines for logged-in user
const getDeadlines = (req, res) => {
  const deadlines = db.prepare(`
    SELECT d.*, s.subject_name
    FROM deadlines d
    LEFT JOIN subjects s ON d.subject_id = s.subject_id
    WHERE d.user_id = ?
    ORDER BY d.due_date ASC
  `).all(req.user.user_id);
  res.json(deadlines);
};

// POST create new deadline
const createDeadline = (req, res) => {
  const { title, subject_id, due_date } = req.body;
  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due date are required' });
  }
  const result = db.prepare(`
    INSERT INTO deadlines (user_id, subject_id, title, due_date)
    VALUES (?, ?, ?, ?)
  `).run(req.user.user_id, subject_id || null, title, due_date);
  res.status(201).json({
    message: 'Deadline created',
    deadline_id: result.lastInsertRowid
  });
};

// PUT update deadline (mark done or edit)
const updateDeadline = (req, res) => {
  const { title, due_date, is_done } = req.body;
  const { id } = req.params;
  db.prepare(`
    UPDATE deadlines SET title = ?, due_date = ?, is_done = ?
    WHERE deadline_id = ? AND user_id = ?
  `).run(title, due_date, is_done, id, req.user.user_id);
  res.json({ message: 'Deadline updated' });
};

// DELETE deadline
const deleteDeadline = (req, res) => {
  const { id } = req.params;
  db.prepare(
    'DELETE FROM deadlines WHERE deadline_id = ? AND user_id = ?'
  ).run(id, req.user.user_id);
  res.json({ message: 'Deadline deleted' });
};

module.exports = { getDeadlines, createDeadline, updateDeadline, deleteDeadline };