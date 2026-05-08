const db = require('../config/db');

// GET all subjects for logged-in user
const getSubjects = (req, res) => {
  const subjects = db.prepare(
    'SELECT * FROM subjects WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.user_id);
  res.json(subjects);
};

// POST create new subject
const createSubject = (req, res) => {
  const { subject_name, color_tag } = req.body;
  if (!subject_name) {
    return res.status(400).json({ error: 'Subject name is required' });
  }
  const result = db.prepare(
    'INSERT INTO subjects (user_id, subject_name, color_tag) VALUES (?, ?, ?)'
  ).run(req.user.user_id, subject_name, color_tag || '#2E4057');
  res.status(201).json({
    message: 'Subject created',
    subject_id: result.lastInsertRowid
  });
};

// PUT update subject
const updateSubject = (req, res) => {
  const { subject_name, color_tag } = req.body;
  const { id } = req.params;
  db.prepare(
    'UPDATE subjects SET subject_name = ?, color_tag = ? WHERE subject_id = ? AND user_id = ?'
  ).run(subject_name, color_tag, id, req.user.user_id);
  res.json({ message: 'Subject updated' });
};

// DELETE subject
const deleteSubject = (req, res) => {
  const { id } = req.params;
  db.prepare(
    'DELETE FROM subjects WHERE subject_id = ? AND user_id = ?'
  ).run(id, req.user.user_id);
  res.json({ message: 'Subject deleted' });
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };