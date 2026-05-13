const db = require('../config/db');

const getSubjects = async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM subjects WHERE user_id = ? ORDER BY created_at DESC',
      args: [req.user.user_id]
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const createSubject = async (req, res) => {
  try {
    const { subject_name, color_tag } = req.body;
    if (!subject_name)
      return res.status(400).json({ error: 'Subject name is required' });

    const result = await db.execute({
      sql: 'INSERT INTO subjects (user_id, subject_name, color_tag) VALUES (?, ?, ?)',
      args: [req.user.user_id, subject_name, color_tag || '#2E4057']
    });
    res.status(201).json({
      message: 'Subject created',
      subject_id: Number(result.lastInsertRowid)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { subject_name, color_tag } = req.body;
    const { id } = req.params;
    await db.execute({
      sql: 'UPDATE subjects SET subject_name = ?, color_tag = ? WHERE subject_id = ? AND user_id = ?',
      args: [subject_name, color_tag, id, req.user.user_id]
    });
    res.json({ message: 'Subject updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: 'DELETE FROM subjects WHERE subject_id = ? AND user_id = ?',
      args: [id, req.user.user_id]
    });
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };