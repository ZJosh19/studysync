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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});