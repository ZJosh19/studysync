const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database (creates tables on startup)
require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes     = require('./routes/authRoutes');
const subjectRoutes  = require('./routes/subjectRoutes');
const taskRoutes     = require('./routes/taskRoutes');
const sessionRoutes  = require('./routes/sessionRoutes');
const deadlineRoutes = require('./routes/deadlineRoutes');

app.use('/api/auth',      authRoutes);
app.use('/api/subjects',  subjectRoutes);
app.use('/api/tasks',     taskRoutes);
app.use('/api/sessions',  sessionRoutes);
app.use('/api/deadlines', deadlineRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'StudySync API is running!' });
});

// Quote proxy route (fixes CORS issue with ZenQuotes)
app.get('/api/quote', async (req, res) => {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json([{ q: 'Keep pushing forward. You are doing great!', a: 'StudySync' }]);
  }
});

// ── Admin middleware ──────────────────────────────────────────────
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin_studysync_2026';

const verifyAdmin = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (key !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

// ── Admin routes ──────────────────────────────────────────────────
const db = require('./config/db');

// GET all users
app.get('/admin/users', verifyAdmin, (req, res) => {
  const users = db.prepare(
    'SELECT user_id, username, email, created_at FROM users'
  ).all();
  res.json(users);
});

// DELETE user
app.delete('/admin/users/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM users WHERE user_id = ?').run(req.params.id);
  res.json({ message: 'User deleted' });
});

// GET all subjects (all users)
app.get('/admin/subjects', verifyAdmin, (req, res) => {
  const subjects = db.prepare(`
    SELECT s.*, u.username FROM subjects s
    JOIN users u ON s.user_id = u.user_id
    ORDER BY s.created_at DESC
  `).all();
  res.json(subjects);
});

// DELETE subject
app.delete('/admin/subjects/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM subjects WHERE subject_id = ?').run(req.params.id);
  res.json({ message: 'Subject deleted' });
});

// GET all tasks (all users)
app.get('/admin/tasks', verifyAdmin, (req, res) => {
  const tasks = db.prepare(`
    SELECT t.*, u.username FROM tasks t
    JOIN users u ON t.user_id = u.user_id
    ORDER BY t.created_at DESC
  `).all();
  res.json(tasks);
});

// DELETE task
app.delete('/admin/tasks/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM tasks WHERE task_id = ?').run(req.params.id);
  res.json({ message: 'Task deleted' });
});

// GET all sessions (all users)
app.get('/admin/sessions', verifyAdmin, (req, res) => {
  const sessions = db.prepare(`
    SELECT ss.*, u.username FROM study_sessions ss
    JOIN users u ON ss.user_id = u.user_id
    ORDER BY ss.created_at DESC
  `).all();
  res.json(sessions);
});

// DELETE session
app.delete('/admin/sessions/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM study_sessions WHERE session_id = ?').run(req.params.id);
  res.json({ message: 'Session deleted' });
});

// GET all deadlines (all users)
app.get('/admin/deadlines', verifyAdmin, (req, res) => {
  const deadlines = db.prepare(`
    SELECT d.*, u.username FROM deadlines d
    JOIN users u ON d.user_id = u.user_id
    ORDER BY d.due_date ASC
  `).all();
  res.json(deadlines);
});

// DELETE deadline
app.delete('/admin/deadlines/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM deadlines WHERE deadline_id = ?').run(req.params.id);
  res.json({ message: 'Deadline deleted' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});