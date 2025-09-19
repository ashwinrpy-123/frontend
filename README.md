 
## Backend (Node.js + Express + Gemini + MongoDB)

A production-ready backend scaffold is included in `server/`:

- Express with Helmet, CORS, logging, and rate limiting
- Google Gemini via `@google/generative-ai`
- MongoDB via Mongoose (`Chat` model)
- Centralized error handling and Zod validation
- `.env` support via `dotenv`

### 1) Prerequisites

- Node.js 18+
- MongoDB connection string (Atlas or local)
- Google Gemini API key

### 2) Configure environment

Create `server/.env` with:

```
PORT=5000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
MONGODB_URI=YOUR_MONGODB_URI
# MONGODB_DB_NAME=optional_db_name
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
# GEMINI_MODEL=gemini-1.5-flash
```

### 3) Install and run backend

```
cd server
npm install
npm run dev
```

Server will run on `http://localhost:5000`.

### 4) API endpoint

- POST `/chat`
  - Body: `{ "message": "Hello" }`
  - Response: `{ "reply": "...", "id": "<mongo_id>", "timestamp": "<ISO>" }`

Example:

```
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

### 5) Frontend integration

In your React app:

```ts
async function sendMessage(message: string) {
  const res = await fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}
```

Ensure `FRONTEND_ORIGIN` matches your Vite dev server origin.

### 6) Production notes

- Set `NODE_ENV=production` to hide stack traces.
- Restrict `FRONTEND_ORIGIN` to your deployed frontend domain.
- Use a process manager (PM2) and HTTPS-enabled proxy in production.