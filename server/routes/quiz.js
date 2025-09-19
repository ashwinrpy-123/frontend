import { Router } from 'express';
import { z } from 'zod';
import { QuizHistory } from '../models/QuizHistory.js';
import { requireAuth } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const genSchema = z.object({ topic: z.string().min(1), numQuestions: z.number().min(1).max(20).default(10) });
const submitSchema = z.object({
  topic: z.string().min(1),
  totalQuestions: z.number().min(1),
  correct: z.number().min(0),
});

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const { topic, numQuestions } = genSchema.parse(req.body);
    const model = getModel();
    const prompt = `Create ${numQuestions} multiple-choice questions on the topic "${topic}".
Return JSON array with fields: question, options (array of 4), correctIndex (0-3).`;
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() ?? '[]';
    let questions = [];
    try { questions = JSON.parse(text); } catch { /* fallback */ }
    return res.json({ topic, questions });
  } catch (err) { next(err); }
});

router.post('/submit', requireAuth, async (req, res, next) => {
  try {
    const { topic, totalQuestions, correct } = submitSchema.parse(req.body);
    const score = Math.round((correct / totalQuestions) * 100);
    const history = await QuizHistory.create({ userId: req.userId, topic, score, totalQuestions });
    return res.status(201).json({ id: history._id, score });
  } catch (err) { next(err); }
});

router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const items = await QuizHistory.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (err) { next(err); }
});

export default router;



