import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { FlashcardSet } from '../models/FlashcardSet.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const genSchema = z.object({ topic: z.string().min(1), numCards: z.number().min(3).max(50).default(10) });
const deleteSchema = z.object({ id: z.string().min(1) });

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const { topic, numCards } = genSchema.parse(req.body);
    const model = getModel();
    const prompt = `Generate ${numCards} flashcards for topic "${topic}".
Return JSON array with objects: { front: string, back: string }.`;
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() ?? '[]';
    let cards = [];
    try { cards = JSON.parse(text); } catch { /* fallback */ }
    const set = await FlashcardSet.create({ userId: req.userId, topic, cards });
    res.status(201).json({ id: set._id, topic: set.topic, cards: set.cards });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = deleteSchema.parse(req.params);
    const set = await FlashcardSet.findOneAndDelete({ _id: id, userId: req.userId });
    if (!set) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const items = await FlashcardSet.find({ userId: req.userId }).sort({ updatedAt: -1 }).limit(100);
    res.json(items);
  } catch (err) { next(err); }
});

export default router;



