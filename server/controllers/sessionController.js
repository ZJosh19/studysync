const db = require('../config/db');

const getSessions = async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT ss.*, s.subject_name
            FROM study_sessions ss
            LEFT JOIN subjects s ON ss.subject_id = s.subject_id
            WHERE ss.user_id = ?
            ORDER BY ss.created_at DESC`,
      args: [req.user.user_id]
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const createSession = async (req, res) => {
  try {
    const { subject_id, start_time, end_time, duration_mins } = req.body;
    if (!duration_mins)
      return res.status(400).json({ error: 'Duration is required' });

    const result = await db.execute({
      sql: `INSERT INTO study_sessions (user_id, subject_id, start_time, end_time, duration_mins)
            VALUES (?, ?, ?, ?, ?)`,
      args: [req.user.user_id, subject_id || null, start_time, end_time, duration_mins]
    });
    res.status(201).json({
      message: 'Session saved',
      session_id: Number(result.lastInsertRowid)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: 'DELETE FROM study_sessions WHERE session_id = ? AND user_id = ?',
      args: [id, req.user.user_id]
    });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getSessions, createSession, deleteSession };