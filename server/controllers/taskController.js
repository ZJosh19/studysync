const db = require('../config/db');

// GET all tasks for logged-in user
const getTasks = (req, res) => {
  const tasks = db.prepare(`
    SELECT t.*, s.subject_name, s.color_tag
    FROM tasks t
    LEFT JOIN subjects s ON t.subject_id = s.subject_id
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
  `).all(req.user.user_id);
  res.json(tasks);
};

// POST create new task
const createTask = (req, res) => {
  const { title, subject_id, priority } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }
  const result = db.prepare(`
    INSERT INTO tasks (user_id, subject_id, title, priority)
    VALUES (?, ?, ?, ?)
  `).run(req.user.user_id, subject_id || null, title, priority || 'medium');
  res.status(201).json({
    message: 'Task created',
    task_id: result.lastInsertRowid
  });
};

// PUT update task (title, priority, status)
const updateTask = (req, res) => {
  const { title, priority, status } = req.body;
  const { id } = req.params;
  db.prepare(`
    UPDATE tasks SET title = ?, priority = ?, status = ?
    WHERE task_id = ? AND user_id = ?
  `).run(title, priority, status, id, req.user.user_id);
  res.json({ message: 'Task updated' });
};

// DELETE task
const deleteTask = (req, res) => {
  const { id } = req.params;
  db.prepare(
    'DELETE FROM tasks WHERE task_id = ? AND user_id = ?'
  ).run(id, req.user.user_id);
  res.json({ message: 'Task deleted' });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };