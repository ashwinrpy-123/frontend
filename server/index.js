import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectToDatabase } from './config/db.js';
import chatRouter from './routes/chat.js';
import authRouter from './routes/auth.js';
import quizRouter from './routes/quiz.js';
import flashcardsRouter from './routes/flashcards.js';
import conversationsRouter from './routes/conversations.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and basic middlewares
app.use(helmet());

const corsOrigin = process.env.FRONTEND_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin,
    credentials: false,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

// Basic rate limiting to protect the /chat endpoint
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/chat', limiter);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/chat', chatRouter);
app.use('/auth', authRouter);
app.use('/quiz', quizRouter);
app.use('/flashcards', flashcardsRouter);
app.use('/conversations', conversationsRouter);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();


