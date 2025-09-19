import express from 'express';
import { Conversation } from '../models/Chat.js';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'), false);
    }
  }
});

// Get all conversations for a user
router.get('/', requireAuth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ 
      $or: [
        { user: req.userId },
        { user: null } // Include legacy conversations
      ]
    })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt messages');
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

// Get a specific conversation
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
});

// Create a new conversation
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, firstMessage } = req.body;
    
    const conversation = new Conversation({
      user: req.userId,
      title: title || 'New Conversation',
      messages: firstMessage ? [firstMessage] : []
    });
    
    await conversation.save();
    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
});

// Add message to conversation
router.post('/:id/messages', requireAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    conversation.messages.push(req.body);
    await conversation.save();
    
    res.json(conversation);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Failed to add message' });
  }
});

// Upload file
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      preview: req.file.mimetype.startsWith('image/') ? fileUrl : undefined
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

// Delete conversation
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Failed to delete conversation' });
  }
});

// Update conversation title
router.patch('/:id/title', requireAuth, async (req, res) => {
  try {
    const { title } = req.body;
    
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, updatedAt: new Date() },
      { new: true }
    );
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    res.json(conversation);
  } catch (error) {
    console.error('Error updating conversation title:', error);
    res.status(500).json({ message: 'Failed to update conversation title' });
  }
});

export default router;
