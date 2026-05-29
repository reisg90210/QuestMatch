# QuestMatch System Design & Specification

QuestMatch is a social platform for gamers to find their perfect squad or duo using a swiping interface.

## 1. Database Schema

The following tables are designed for a SQLite environment.

### `users`
Stores user profile information.
- `id` (TEXT, PRIMARY KEY): UUID
- `username` (TEXT, UNIQUE, NOT NULL)
- `email` (TEXT, UNIQUE, NOT NULL)
- `password_hash` (TEXT, NOT NULL)
- `bio` (TEXT)
- `platforms` (TEXT): JSON array (e.g., `["PS5", "PC"]`)
- `games` (TEXT): JSON array of game objects/IDs (e.g., `["Apex Legends", "Valorant"]`)
- `skill_level` (TEXT): Enum ('Casual', 'Competitive', 'Pro')
- `avatar_url` (TEXT)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### `swipes`
Records swiping actions between users.
- `id` (INTEGER, PRIMARY KEY AUTOINCREMENT)
- `swiper_id` (TEXT, NOT NULL): User who is swiping.
- `swiped_id` (TEXT, NOT NULL): User being swiped on.
- `direction` (TEXT, NOT NULL): 'like' or 'dislike'.
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- FOREIGN KEY(swiper_id) REFERENCES users(id)
- FOREIGN KEY(swiped_id) REFERENCES users(id)
- UNIQUE(swiper_id, swiped_id)

### `matches`
Stores mutual 'like' matches.
- `id` (INTEGER, PRIMARY KEY AUTOINCREMENT)
- `user1_id` (TEXT, NOT NULL)
- `user2_id` (TEXT, NOT NULL)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- FOREIGN KEY(user1_id) REFERENCES users(id)
- FOREIGN KEY(user2_id) REFERENCES users(id)
- UNIQUE(user1_id, user2_id)

### `messages`
Stores chat messages for matches.
- `id` (INTEGER, PRIMARY KEY AUTOINCREMENT)
- `match_id` (INTEGER, NOT NULL)
- `sender_id` (TEXT, NOT NULL)
- `content` (TEXT, NOT NULL)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- FOREIGN KEY(match_id) REFERENCES matches(id)
- FOREIGN KEY(sender_id) REFERENCES users(id)

---

## 2. API Specifications

### Authentication
- `POST /api/auth/signup`: Create a new account.
- `POST /api/auth/login`: Authenticate and receive a token.

### User Profiles
- `GET /api/users/profile`: Fetch current user's profile.
- `PUT /api/users/profile`: Update bio, games, platforms, etc.
- `GET /api/users/:id`: Fetch a specific user's public profile.

### Discovery & Swiping
- `GET /api/discover`: Returns a list of potential matches.
    - Filters: Platforms, shared games, skill level.
    - Excludes: Users already swiped on by the current user.
- `POST /api/swipes`: Submit a swipe.
    - Body: `{ swiped_id: string, direction: 'like' | 'dislike' }`
    - Response: `{ match: boolean, match_id?: number }`

### Matches & Chat
- `GET /api/matches`: List all current matches for the user.
- `GET /api/matches/:match_id/messages`: Retrieve chat history.
- `POST /api/matches/:match_id/messages`: Send a new message.

---

## 3. Core Logic

### Discovery Algorithm
The discovery endpoint should prioritize users who:
1. Play at least one common game.
2. Share at least one common platform.
3. Have similar skill levels.
4. Are within a reasonable geographic proximity (if location is added later).

### Matching Process
1. User A likes User B (`POST /api/swipes`).
2. Server checks if a record exists in `swipes` where `swiper_id = User B` and `swiped_id = User A` and `direction = 'like'`.
3. If found:
    - Create a record in `matches` for User A and User B.
    - Return `match: true` in the swipe response.
4. If not found:
    - Record User A's swipe.
    - Return `match: false`.

### Chat Activation
Matches are "activated" as soon as both users like each other. The first message can be sent by either party through the match interface.
