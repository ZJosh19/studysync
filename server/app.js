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
// ── Admin routes ──────────────────────────────────────────────────
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin_studysync_2026';
const verifyAdmin = (req, res, next) => {
  if (req.headers['x-admin-key'] !== ADMIN_SECRET)
    return res.status(403).json({ error: 'Unauthorized' });
  next();
};

app.get('/admin/users', verifyAdmin, async (req, res) => {
  const r = await db.execute('SELECT user_id, username, email, created_at FROM users');
  res.json(r.rows);
});
app.delete('/admin/users/:id', verifyAdmin, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM users WHERE user_id = ?', args: [req.params.id] });
  res.json({ message: 'User deleted' });
});
app.get('/admin/subjects', verifyAdmin, async (req, res) => {
  const r = await db.execute('SELECT s.*, u.username FROM subjects s JOIN users u ON s.user_id = u.user_id');
  res.json(r.rows);
});
app.delete('/admin/subjects/:id', verifyAdmin, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM subjects WHERE subject_id = ?', args: [req.params.id] });
  res.json({ message: 'Subject deleted' });
});
app.get('/admin/tasks', verifyAdmin, async (req, res) => {
  const r = await db.execute('SELECT t.*, u.username FROM tasks t JOIN users u ON t.user_id = u.user_id');
  res.json(r.rows);
});
app.delete('/admin/tasks/:id', verifyAdmin, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM tasks WHERE task_id = ?', args: [req.params.id] });
  res.json({ message: 'Task deleted' });
});
app.get('/admin/sessions', verifyAdmin, async (req, res) => {
  const r = await db.execute('SELECT ss.*, u.username FROM study_sessions ss JOIN users u ON ss.user_id = u.user_id');
  res.json(r.rows);
});
app.delete('/admin/sessions/:id', verifyAdmin, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM study_sessions WHERE session_id = ?', args: [req.params.id] });
  res.json({ message: 'Session deleted' });
});
app.get('/admin/deadlines', verifyAdmin, async (req, res) => {
  const r = await db.execute('SELECT d.*, u.username FROM deadlines d JOIN users u ON d.user_id = u.user_id');
  res.json(r.rows);
});
app.delete('/admin/deadlines/:id', verifyAdmin, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM deadlines WHERE deadline_id = ?', args: [req.params.id] });
  res.json({ message: 'Deadline deleted' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});