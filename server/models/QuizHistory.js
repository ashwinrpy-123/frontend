import mongoose from 'mongoose';

const QuizHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    totalQuestions: { type: Number, required: true, min: 1 },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

export const QuizHistory = mongoose.models.QuizHistory || mongoose.model('QuizHistory', QuizHistorySchema);



