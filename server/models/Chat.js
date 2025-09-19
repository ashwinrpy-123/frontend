import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    userMessage: {
      type: String,
      required: true,
      trim: true,
    },
    botResponse: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { versionKey: false }
);

export const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);



