const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// ── Register ──────────────────────────────────────────────────────
const register = (req, res) => {
  const { username, email, password } = req.body;

  // Validate inputs
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Check if username already exists
  const existingUser = db.prepare(
    'SELECT * FROM users WHERE username = ? OR email = ?'
  ).get(username, email);

  if (existingUser) {
    if (existingUser.username === username) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Hash password
  const saltRounds = 10;
  const password_hash = bcrypt.hashSync(password, saltRounds);

  // Insert user into database
  const insert = db.prepare(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
  );
  insert.run(username, email, password_hash);

  res.status(201).json({ message: 'User registered successfully' });
};

// ── Login ─────────────────────────────────────────────────────────
const login = (req, res) => {
  const { username, password } = req.body;

  // Validate inputs
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Find user
  const user = db.prepare(
    'SELECT * FROM users WHERE username = ?'
  ).get(username);

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Compare password
  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { user_id: user.user_id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { user_id: user.user_id, username: user.username }
  });
};

module.exports = { register, login };