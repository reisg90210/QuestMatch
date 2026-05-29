const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'questmatch-secret-key';

// Middleware for auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await db.run('INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)', [id, username, email, passwordHash]);
    res.status(201).json({ message: 'User created', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await db.run('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Profile Routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const users = await db.run('SELECT id, username, email, bio, platforms, games, skill_level, avatar_url FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    
    const user = users[0];
    if (user.platforms) user.platforms = JSON.parse(user.platforms);
    if (user.games) user.games = JSON.parse(user.games);
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  const { bio, platforms, games, skill_level, avatar_url } = req.body;
  
  try {
    const platformsStr = platforms ? JSON.stringify(platforms) : null;
    const gamesStr = games ? JSON.stringify(games) : null;

    let updateFields = [];
    let params = [];
    
    if (bio !== undefined) { updateFields.push('bio = ?'); params.push(bio); }
    if (platforms !== undefined) { updateFields.push('platforms = ?'); params.push(platformsStr); }
    if (games !== undefined) { updateFields.push('games = ?'); params.push(gamesStr); }
    if (skill_level !== undefined) { updateFields.push('skill_level = ?'); params.push(skill_level); }
    if (avatar_url !== undefined) { updateFields.push('avatar_url = ?'); params.push(avatar_url); }

    if (updateFields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    params.push(req.user.id);
    await db.run(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Profile updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const users = await db.run('SELECT id, username, bio, platforms, games, skill_level, avatar_url FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    
    const user = users[0];
    if (user.platforms) user.platforms = JSON.parse(user.platforms);
    if (user.games) user.games = JSON.parse(user.games);
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Discovery & Swiping
app.get('/api/discover', authenticateToken, async (req, res) => {
  try {
    const swipesRows = await db.run('SELECT swiped_id FROM swipes WHERE swiper_id = ?', [req.user.id]);
    const swipedIds = swipesRows.map(s => s.swiped_id);
    
    let query = 'SELECT id, username, bio, platforms, games, skill_level, avatar_url FROM users WHERE id != ?';
    let params = [req.user.id];
    
    if (swipedIds.length > 0) {
      query += ` AND id NOT IN (${swipedIds.map(() => '?').join(',')})`;
      params.push(...swipedIds);
    }
    
    const potentialMatches = await db.run(query, params);
    
    potentialMatches.forEach(u => {
      if (u.platforms) u.platforms = JSON.parse(u.platforms);
      if (u.games) u.games = JSON.parse(u.games);
    });
    
    res.json(potentialMatches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch discovery users' });
  }
});

app.post('/api/swipes', authenticateToken, async (req, res) => {
  const { swiped_id, direction } = req.body;
  if (!swiped_id || !['like', 'dislike'].includes(direction)) {
    return res.status(400).json({ error: 'Invalid swipe' });
  }

  try {
    await db.run('INSERT INTO swipes (swiper_id, swiped_id, direction) VALUES (?, ?, ?)', [req.user.id, swiped_id, direction]);
    
    if (direction === 'like') {
      const mutualLike = await db.run('SELECT * FROM swipes WHERE swiper_id = ? AND swiped_id = ? AND direction = ?', [swiped_id, req.user.id, 'like']);
      
      if (mutualLike.length > 0) {
        const user1 = req.user.id < swiped_id ? req.user.id : swiped_id;
        const user2 = req.user.id < swiped_id ? swiped_id : req.user.id;
        
        await db.run('INSERT OR IGNORE INTO matches (user1_id, user2_id) VALUES (?, ?)', [user1, user2]);
        const matches = await db.run('SELECT id FROM matches WHERE user1_id = ? AND user2_id = ?', [user1, user2]);
        
        return res.json({ match: true, match_id: matches[0].id });
      }
    }
    
    res.json({ match: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record swipe' });
  }
});

// Matches & Chat
app.get('/api/matches', authenticateToken, async (req, res) => {
  try {
    const matches = await db.run(`
      SELECT m.id, 
             u.id as other_user_id, u.username, u.avatar_url
      FROM matches m
      JOIN users u ON (u.id = m.user1_id OR u.id = m.user2_id)
      WHERE (m.user1_id = ? OR m.user2_id = ?)
      AND u.id != ?
    `, [req.user.id, req.user.id, req.user.id]);
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

app.get('/api/matches/:match_id/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await db.run('SELECT * FROM messages WHERE match_id = ? ORDER BY created_at ASC', [req.params.match_id]);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/matches/:match_id/messages', authenticateToken, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Message content required' });

  try {
    await db.run('INSERT INTO messages (match_id, sender_id, content) VALUES (?, ?, ?)', [req.params.match_id, req.user.id, content]);
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
