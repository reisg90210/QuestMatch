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

// Initialize Database Tables
const initDB = async () => {
  try {
    console.log('Ensuring database tables exist...');
    await db.run('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, bio TEXT, platforms TEXT, games TEXT, skill_level TEXT, avatar_url TEXT, is_premium BOOLEAN DEFAULT 0, is_verified BOOLEAN DEFAULT 0, referrer_id TEXT, referrals_count INTEGER DEFAULT 0, first_quest_completed BOOLEAN DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
    
    // Migration: Add columns if they don't exist
    try {
      await db.run('ALTER TABLE users ADD COLUMN is_premium BOOLEAN DEFAULT 0');
    } catch (e) { /* already exists */ }
    try {
      await db.run('ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0');
    } catch (e) { /* already exists */ }
    try {
      await db.run('ALTER TABLE users ADD COLUMN referrer_id TEXT');
    } catch (e) { /* already exists */ }
    try {
      await db.run('ALTER TABLE users ADD COLUMN referrals_count INTEGER DEFAULT 0');
    } catch (e) { /* already exists */ }
    try {
      await db.run('ALTER TABLE users ADD COLUMN first_quest_completed BOOLEAN DEFAULT 0');
    } catch (e) { /* already exists */ }
    await db.run('CREATE TABLE IF NOT EXISTS swipes (id INTEGER PRIMARY KEY AUTOINCREMENT, swiper_id TEXT NOT NULL, swiped_id TEXT NOT NULL, direction TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(swiper_id) REFERENCES users(id), FOREIGN KEY(swiped_id) REFERENCES users(id), UNIQUE(swiper_id, swiped_id))');
    await db.run('CREATE TABLE IF NOT EXISTS matches (id INTEGER PRIMARY KEY AUTOINCREMENT, user1_id TEXT NOT NULL, user2_id TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user1_id) REFERENCES users(id), FOREIGN KEY(user2_id) REFERENCES users(id), UNIQUE(user1_id, user2_id))');
    await db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, match_id INTEGER NOT NULL, sender_id TEXT NOT NULL, content TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(match_id) REFERENCES matches(id), FOREIGN KEY(sender_id) REFERENCES users(id))');
    await db.run('CREATE TABLE IF NOT EXISTS quests (id TEXT PRIMARY KEY, creator_id TEXT NOT NULL, game_id TEXT NOT NULL, quest_type TEXT NOT NULL, title TEXT NOT NULL, description TEXT, requirements TEXT, start_time TEXT, total_slots INTEGER NOT NULL, filled_slots INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(creator_id) REFERENCES users(id))');
    await db.run('CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY AUTOINCREMENT, quest_id TEXT NOT NULL, applicant_id TEXT NOT NULL, status TEXT DEFAULT "pending", created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(quest_id) REFERENCES quests(id), FOREIGN KEY(applicant_id) REFERENCES users(id), UNIQUE(quest_id, applicant_id))');
    await db.run('CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, type TEXT NOT NULL, content TEXT NOT NULL, quest_id TEXT, sender_id TEXT, is_read BOOLEAN DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id))');
    console.log('Database tables verified/created');
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
  }
};
initDB();

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
  const { username, email, password, referrer_id } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    // Ensure tables exist before signup
    await initDB();
    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await db.run('INSERT INTO users (id, username, email, password_hash, referrer_id) VALUES (?, ?, ?, ?, ?)', [id, username, email, passwordHash, referrer_id || null]);
    res.status(201).json({ message: 'User created', id });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: `Failed to create user: ${error.message}` });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await db.run('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, is_premium: !!user.is_premium, is_verified: !!user.is_verified } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// User Profile Routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const users = await db.run('SELECT id, username, email, bio, platforms, games, skill_level, avatar_url, is_premium, is_verified, referrer_id, referrals_count, first_quest_completed FROM users WHERE id = ?', [req.user.id]);
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  const { bio, platforms, games, skill_level, avatar_url, is_premium, is_verified } = req.body;
  try {
    await db.run(
      'UPDATE users SET bio = ?, platforms = ?, games = ?, skill_level = ?, avatar_url = ?, is_premium = ?, is_verified = ? WHERE id = ?',
      [bio, JSON.stringify(platforms), JSON.stringify(games), skill_level, avatar_url, is_premium ? 1 : 0, is_verified ? 1 : 0, req.user.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Mock Upgrade/Verify Endpoint
app.post('/api/users/upgrade', authenticateToken, async (req, res) => {
  const { type } = req.body; // 'premium' or 'verify'
  try {
    if (type === 'premium') {
      await db.run('UPDATE users SET is_premium = 1 WHERE id = ?', [req.user.id]);
    } else if (type === 'verify') {
      await db.run('UPDATE users SET is_verified = 1 WHERE id = ?', [req.user.id]);
    }
    res.json({ message: `Account updated: ${type}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upgrade account' });
  }
});

// Discovery & Swiping
app.get('/api/discover', authenticateToken, async (req, res) => {
  try {
    // Basic discovery: users not yet swiped on
    const potentialMatches = await db.run(`
      SELECT id, username, bio, platforms, games, skill_level, avatar_url, is_premium, is_verified
      FROM users
      WHERE id != ?
      AND id NOT IN (SELECT swiped_id FROM swipes WHERE swiper_id = ?)
      LIMIT 20
    `, [req.user.id, req.user.id]);
    
    // Parse JSON fields
    const parsed = potentialMatches.map(u => ({
      ...u,
      platforms: u.platforms ? JSON.parse(u.platforms) : [],
      games: u.games ? JSON.parse(u.games) : []
    }));
    
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch discovery list' });
  }
});

app.post('/api/swipes', authenticateToken, async (req, res) => {
  const { swiped_id, direction } = req.body;
  try {
    await db.run('INSERT INTO swipes (swiper_id, swiped_id, direction) VALUES (?, ?, ?)', [req.user.id, swiped_id, direction]);
    
    if (direction === 'like') {
      const mutual = await db.run('SELECT * FROM swipes WHERE swiper_id = ? AND swiped_id = ? AND direction = "like"', [swiped_id, req.user.id]);
      if (mutual.length > 0) {
        await db.run('INSERT INTO matches (user1_id, user2_id) VALUES (?, ?)', [req.user.id, swiped_id]);
        return res.json({ match: true });
      }
    }
    res.json({ match: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record swipe' });
  }
});

// Matches & Messages
app.get('/api/matches', authenticateToken, async (req, res) => {
  try {
    const matches = await db.run(`
      SELECT m.id as match_id, u.id, u.username, u.avatar_url, u.is_verified
      FROM matches m
      JOIN users u ON (u.id = m.user1_id OR u.id = m.user2_id)
      WHERE (m.user1_id = ? OR m.user2_id = ?) AND u.id != ?
    `, [req.user.id, req.user.id, req.user.id]);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Quest Applications & Squad Management
app.post('/api/quests/:id/apply', authenticateToken, async (req, res) => {
  try {
    const questId = req.params.id;
    const quests = await db.run('SELECT creator_id, title FROM quests WHERE id = ?', [questId]);
    if (quests.length === 0) return res.status(404).json({ error: 'Quest not found' });
    
    await db.run('INSERT INTO applications (quest_id, applicant_id) VALUES (?, ?)', [questId, req.user.id]);
    
    // Notify creator
    await db.run(
      'INSERT INTO notifications (user_id, type, content, quest_id, sender_id) VALUES (?, ?, ?, ?, ?)',
      [quests[0].creator_id, 'new_applicant', `User ${req.user.username} wants to join your quest: ${quests[0].title}.`, questId, req.user.id]
    );
    
    res.status(201).json({ message: 'Application sent' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Already applied to this quest' });
    }
    res.status(500).json({ error: 'Failed to apply' });
  }
});

app.get('/api/quests/:id/applications', authenticateToken, async (req, res) => {
  try {
    const questId = req.params.id;
    const quests = await db.run('SELECT creator_id FROM quests WHERE id = ?', [questId]);
    if (quests.length === 0) return res.status(404).json({ error: 'Quest not found' });
    if (quests[0].creator_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    const applications = await db.run(`
      SELECT a.*, u.username, u.avatar_url, u.skill_level
      FROM applications a
      JOIN users u ON a.applicant_id = u.id
      WHERE a.quest_id = ?
    `, [questId]);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.put('/api/applications/:id', authenticateToken, async (req, res) => {
  const { status } = req.body; // 'accepted', 'rejected', or 'completed'
  try {
    const apps = await db.run(`
      SELECT a.*, q.creator_id, q.title, q.total_slots, q.filled_slots 
      FROM applications a 
      JOIN quests q ON a.quest_id = q.id 
      WHERE a.id = ?
    `, [req.params.id]);
    
    if (apps.length === 0) return res.status(404).json({ error: 'Application not found' });
    const appData = apps[0];
    
    if (appData.creator_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    if (status === 'accepted') {
      // Atomic increment and capacity check using RETURNING
      const updateResult = await db.run(
        'UPDATE quests SET filled_slots = filled_slots + 1 WHERE id = ? AND filled_slots < total_slots RETURNING filled_slots, total_slots',
        [appData.quest_id]
      );
      
      if (updateResult.length === 0) {
        return res.status(400).json({ error: 'Quest is already full.' });
      }

      const newFilledSlots = updateResult[0].filled_slots;
      const totalSlots = updateResult[0].total_slots;
      
      // Notify applicant
      await db.run(
        'INSERT INTO notifications (user_id, type, content, quest_id, sender_id) VALUES (?, ?, ?, ?, ?)',
        [appData.applicant_id, 'application_accepted', `Your application to ${appData.title} was accepted! Pack your gear.`, appData.quest_id, req.user.id]
      );
      
      // Check if quest is now full
      if (newFilledSlots >= totalSlots) {
         await db.run(
          'INSERT INTO notifications (user_id, type, content, quest_id) VALUES (?, ?, ?, ?)',
          [appData.creator_id, 'quest_full', `Your quest ${appData.title} is now fully manned!`, appData.quest_id]
        );
      }
    } else if (status === 'completed') {
      // Referral Logic
      const users = await db.run('SELECT referrer_id, first_quest_completed FROM users WHERE id = ?', [appData.applicant_id]);
      const user = users[0];
      
      if (user && !user.first_quest_completed && user.referrer_id) {
        // Mark first quest as completed for the referee
        await db.run('UPDATE users SET first_quest_completed = 1 WHERE id = ?', [appData.applicant_id]);
        
        // Increment referrer's count
        await db.run('UPDATE users SET referrals_count = referrals_count + 1 WHERE id = ?', [user.referrer_id]);
        
        // Check milestones for referrer
        const referrers = await db.run('SELECT id, username, referrals_count FROM users WHERE id = ?', [user.referrer_id]);
        const referrer = referrers[0];
        
        if (referrer) {
          const count = referrer.referrals_count;
          let milestone = null;
          if (count === 1) milestone = 'Scout';
          else if (count === 3) milestone = 'Commander';
          else if (count === 10) milestone = 'Legend';
          
          if (milestone) {
            console.log(`REFERRAL MILESTONE: User ${referrer.username} reached ${milestone} tier (${count} referrals)`);
            // In a real app, we'd add rewards here. For now, we log and could send a notification.
            await db.run(
              'INSERT INTO notifications (user_id, type, content) VALUES (?, ?, ?)',
              [referrer.id, 'referral_milestone', `Congratulations! You've reached the ${milestone} tier with ${count} successful referrals.`]
            );
          }
        }
      } else if (user && !user.first_quest_completed) {
        // Even if no referrer, mark first quest as completed
        await db.run('UPDATE users SET first_quest_completed = 1 WHERE id = ?', [appData.applicant_id]);
      }
      
      // Notify applicant of completion
      await db.run(
        'INSERT INTO notifications (user_id, type, content, quest_id, sender_id) VALUES (?, ?, ?, ?, ?)',
        [appData.applicant_id, 'quest_completed', `Congratulations! You've successfully completed the quest: ${appData.title}.`, appData.quest_id, req.user.id]
      );
    }

    await db.run('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);
    
    res.json({ message: `Application ${status}` });
  } catch (error) {
    console.error('Update Application Error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

app.delete('/api/applications/:id', authenticateToken, async (req, res) => {
  try {
    const apps = await db.run(`
      SELECT a.*, q.creator_id, q.filled_slots 
      FROM applications a 
      JOIN quests q ON a.quest_id = q.id 
      WHERE a.id = ?
    `, [req.params.id]);
    
    if (apps.length === 0) return res.status(404).json({ error: 'Application not found' });
    const appData = apps[0];
    
    if (appData.creator_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    await db.run('DELETE FROM applications WHERE id = ?', [req.params.id]);

    if (appData.status === 'accepted') {
      await db.run('UPDATE quests SET filled_slots = MAX(1, filled_slots - 1) WHERE id = ?', [appData.quest_id]);
    }
    
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await db.run('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.get('/api/notifications/unread-count', authenticateToken, async (req, res) => {
  try {
    const results = await db.run('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [req.user.id]);
    res.json({ count: results[0].count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    await db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

app.get('/api/matches/:match_id/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await db.run('SELECT * FROM messages WHERE match_id = ? ORDER BY created_at ASC', [req.params.match_id]);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/matches/:match_id/messages', authenticateToken, async (req, res) => {
  const { content } = req.body;
  try {
    await db.run('INSERT INTO messages (match_id, sender_id, content) VALUES (?, ?, ?)', [req.params.match_id, req.user.id, content]);
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Quest Routes
app.post('/api/quests', authenticateToken, async (req, res) => {
  const { game_id, quest_type, title, description, requirements, start_time, total_slots } = req.body;
  if (!game_id || !quest_type || !title || !total_slots) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const id = uuidv4();
    await db.run(
      'INSERT INTO quests (id, creator_id, game_id, quest_type, title, description, requirements, start_time, total_slots) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, req.user.id, game_id, quest_type, title, description || null, JSON.stringify(requirements || {}), start_time || null, total_slots]
    );
    res.status(201).json({ message: 'Quest created', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create quest' });
  }
});

app.get('/api/quests', async (req, res) => {
  try {
    const quests = await db.run(`
      SELECT q.*, u.username as creator_name, u.avatar_url as creator_avatar, u.is_verified as creator_is_verified
      FROM quests q
      JOIN users u ON q.creator_id = u.id
      ORDER BY q.created_at DESC
    `);

    const parsed = quests.map(q => ({
      ...q,
      requirements: q.requirements ? JSON.parse(q.requirements) : {}
    }));
    
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
});

app.get('/api/quests/:id', async (req, res) => {
  try {
    const quests = await db.run(`
      SELECT q.*, u.username as creator_name, u.avatar_url as creator_avatar, u.is_verified as creator_is_verified
      FROM quests q
      JOIN users u ON q.creator_id = u.id
      WHERE q.id = ?
    `, [req.params.id]);

    if (quests.length === 0) return res.status(404).json({ error: 'Quest not found' });
    
    const quest = {
      ...quests[0],
      requirements: quests[0].requirements ? JSON.parse(quests[0].requirements) : {}
    };
    
    res.json(quest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
