import mongoose from 'mongoose';

const FlashcardSchema = new mongoose.Schema(
  {
    front: { type: String, required: true },
    back: { type: String, required: true },
  },
  { _id: false }
);

const FlashcardSetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true, trim: true },
    cards: { type: [FlashcardSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

FlashcardSetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const FlashcardSet = mongoose.models.FlashcardSet || mongoose.model('FlashcardSet', FlashcardSetSchema);



