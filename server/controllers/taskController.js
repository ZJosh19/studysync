const db = require('../config/db');

const getTasks = async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT t.*, s.subject_name, s.color_tag
            FROM tasks t
            LEFT JOIN subjects s ON t.subject_id = s.subject_id
            WHERE t.user_id = ?
            ORDER BY t.created_at DESC`,
      args: [req.user.user_id]
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, subject_id, priority } = req.body;
    if (!title)
      return res.status(400).json({ error: 'Task title is required' });

    const result = await db.execute({
      sql: 'INSERT INTO tasks (user_id, subject_id, title, priority) VALUES (?, ?, ?, ?)',
      args: [req.user.user_id, subject_id || null, title, priority || 'medium']
    });
    res.status(201).json({
      message: 'Task created',
      task_id: Number(result.lastInsertRowid)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, priority, status } = req.body;
    const { id } = req.params;
    await db.execute({
      sql: 'UPDATE tasks SET title = ?, priority = ?, status = ? WHERE task_id = ? AND user_id = ?',
      args: [title, priority, status, id, req.user.user_id]
    });
    res.json({ message: 'Task updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: 'DELETE FROM tasks WHERE task_id = ? AND user_id = ?',
      args: [id, req.user.user_id]
    });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };