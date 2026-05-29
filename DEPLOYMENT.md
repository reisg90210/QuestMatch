# QuestMatch Public Deployment Guide

This document outlines the steps to take QuestMatch public on **Render** (recommended) or **Vercel**.

## Prerequisites
- A **Turso** database (already set up).
- The following environment variables from your Turso dashboard:
  - `TURSO_URL`: `libsql://agent-team-4cc060f7-cto.aws-us-west-2.turso.io`
  - `TURSO_AUTH_TOKEN`: (Your Turso Auth Token)

## Option 1: Render (Recommended for Monorepo)

1.  **Connect GitHub**: Connect your GitHub repository containing the QuestMatch code to Render.
2.  **Deploy Backend**:
    - Create a new **Web Service** on Render.
    - Point it to the `backend` directory.
    - Build Command: `npm install`
    - Start Command: `node server.js`
    - Environment Variables:
      - `PORT`: `3000`
      - `JWT_SECRET`: (Any long random string)
      - `TURSO_URL`: `libsql://agent-team-4cc060f7-cto.aws-us-west-2.turso.io`
      - `TURSO_AUTH_TOKEN`: (Your Turso Auth Token)
      - `NODE_ENV`: `production`
3.  **Deploy Frontend**:
    - Create a new **Static Site** on Render.
    - Point it to the `frontend` directory.
    - Build Command: `npm install && npm run build`
    - Publish Directory: `dist`
    - Environment Variables:
      - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`

## Option 2: Vercel (Frontend) + Render (Backend)

1.  **Backend**: Follow the Render steps above.
2.  **Frontend**:
    - Import your repository into Vercel.
    - Select the `frontend` directory as the project root.
    - Vercel will automatically detect Vite.
    - Environment Variables:
      - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
    - Ensure `vercel.json` (included in the `frontend` directory) is present to handle SPA routing and API proxying.

## Environment Variables Summary

| Variable | Location | Description |
| :--- | :--- | :--- |
| `TURSO_URL` | Backend | The URL of your Turso database. |
| `TURSO_AUTH_TOKEN` | Backend | The authentication token for Turso. |
| `JWT_SECRET` | Backend | Secret key for signing JWT tokens. |
| `VITE_API_URL` | Frontend | The absolute URL of your deployed backend API. |

## Production Optimizations
- The backend has been updated to use the native `@libsql/client` for high-performance Turso connection in production.
- SQL queries have been updated to use parameterized statements to prevent SQL injection.
- The frontend `api.js` is now configurable via environment variables.
