# QuestMatch Backend

Lightweight Express API for QuestMatch.

## Setup

```bash
npm install
```

## Running

```bash
node server.js
```

## Endpoints

### Authentication
- `POST /api/auth/signup`: Create a new account.
- `POST /api/auth/login`: Authenticate and receive a token.

### User Profiles
- `GET /api/users/profile`: Fetch current user's profile.
- `PUT /api/users/profile`: Update bio, games, platforms, etc.
- `GET /api/users/:id`: Fetch a specific user's public profile.

### Discovery & Swiping
- `GET /api/discover`: Returns a list of potential matches.
- `POST /api/swipes`: Submit a swipe.

### Matches & Chat
- `GET /api/matches`: List all current matches for the user.
- `GET /api/matches/:match_id/messages`: Retrieve chat history.
- `POST /api/matches/:match_id/messages`: Send a new message.
