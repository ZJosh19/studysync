const db = require('../config/db');

// GET all sessions for logged-in user
const getSessions = (req, res) => {
  const sessions = db.prepare(`
    SELECT ss.*, s.subject_name
    FROM study_sessions ss
    LEFT JOIN subjects s ON ss.subject_id = s.subject_id
    WHERE ss.user_id = ?
    ORDER BY ss.created_at DESC
  `).all(req.user.user_id);
  res.json(sessions);
};

// POST create new session (start + stop together)
const createSession = (req, res) => {
  const { subject_id, start_time, end_time, duration_mins } = req.body;
  if (!duration_mins) {
    return res.status(400).json({ error: 'Duration is required' });
  }
  const result = db.prepare(`
    INSERT INTO study_sessions (user_id, subject_id, start_time, end_time, duration_mins)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.user.user_id, subject_id || null, start_time, end_time, duration_mins);
  res.status(201).json({
    message: 'Session saved',
    session_id: result.lastInsertRowid
  });
};

// DELETE session
const deleteSession = (req, res) => {
  const { id } = req.params;
  db.prepare(
    'DELETE FROM study_sessions WHERE session_id = ? AND user_id = ?'
  ).run(id, req.user.user_id);
  res.json({ message: 'Session deleted' });
};

module.exports = { getSessions, createSession, deleteSession };