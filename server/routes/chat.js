import { Router } from 'express';
import { z } from 'zod';
import { Conversation } from '../models/Chat.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const requestSchema = z.object({
  message: z
    .string({ required_error: 'message is required' })
    .min(1, 'message cannot be empty')
    .max(4000, 'message too long'),
});

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

router.post('/', async (req, res, next) => {
  try {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation_error',
        details: parsed.error.flatten(),
      });
    }

    const { message } = parsed.data;
    const model = getModel();

    let result;
    try {
      result = await model.generateContent(message);
    } catch (genErr) {
      console.error('Gemini generateContent error:', genErr);
      const status = genErr?.status || 502;
      return res.status(status).json({
        error: 'gemini_error',
        message: genErr?.message || 'Failed to get response from Gemini',
      });
    }

    const botText = result?.response?.text?.() ?? '';

    if (!botText) {
      console.warn('Empty response from Gemini for message:', message);
      return res.status(502).json({ error: 'empty_response_from_model' });
    }

    // For backward compatibility, create a simple conversation entry
    const conversation = await Conversation.create({
      user: null, // This endpoint doesn't require authentication
      title: 'Legacy Chat',
      messages: [
        {
          role: 'user',
          content: message,
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: botText,
          timestamp: new Date()
        }
      ]
    });

    return res.status(200).json({
      reply: botText,
      id: conversation._id,
      timestamp: conversation.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;


