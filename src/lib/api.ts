export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export async function sendChatMessage(message: string): Promise<{ reply: string; id: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    let errorText = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      errorText = data?.message || data?.error || errorText;
    } catch {
      const text = await response.text().catch(() => '');
      if (text) errorText = text;
    }
    throw new Error(errorText);
  }

  return response.json();
}

// Auth endpoints
export async function login(email: string, password: string): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function register(email: string, password: string): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
}

// Quiz endpoints
export async function generateQuiz(topic: string, numQuestions: number = 10): Promise<{ topic: string; questions: any[] }> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ topic, numQuestions }),
  });
  if (!response.ok) throw new Error('Failed to generate quiz');
  return response.json();
}

export async function submitQuiz(topic: string, totalQuestions: number, correct: number): Promise<{ id: string; score: number }> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ topic, totalQuestions, correct }),
  });
  if (!response.ok) throw new Error('Failed to submit quiz');
  return response.json();
}

export async function getQuizHistory(): Promise<any[]> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/quiz/history`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' },
  });
  if (!response.ok) throw new Error('Failed to fetch quiz history');
  return response.json();
}

// Flashcard endpoints
export async function generateFlashcards(topic: string, numCards: number = 10): Promise<{ id: string; topic: string; cards: any[] }> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/flashcards/generate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ topic, numCards }),
  });
  if (!response.ok) throw new Error('Failed to generate flashcards');
  return response.json();
}

export async function getFlashcards(): Promise<any[]> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/flashcards`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' },
  });
  if (!response.ok) throw new Error('Failed to fetch flashcards');
  return response.json();
}

export async function deleteFlashcard(id: string): Promise<void> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': token ? `Bearer ${token}` : '' },
  });
  if (!response.ok) throw new Error('Failed to delete flashcard');
}

// Conversation endpoints
export interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  files?: UploadedFile[];
  timestamp: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch conversations');
  return response.json();
}

export async function getConversation(id: string): Promise<Conversation> {
  const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch conversation');
  return response.json();
}

export async function createConversation(title: string, firstMessage?: Message): Promise<Conversation> {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, firstMessage }),
  });
  if (!response.ok) throw new Error('Failed to create conversation');
  return response.json();
}

export async function addMessageToConversation(conversationId: string, message: Message): Promise<Conversation> {
  const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(message),
  });
  if (!response.ok) throw new Error('Failed to add message');
  return response.json();
}

export async function deleteConversation(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete conversation');
}

export async function updateConversationTitle(id: string, title: string): Promise<Conversation> {
  const response = await fetch(`${API_BASE_URL}/conversations/${id}/title`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to update conversation title');
  return response.json();
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/conversations/upload`, {
    method: 'POST',
    headers: { 'Authorization': token ? `Bearer ${token}` : '' },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload file');
  return response.json();
}


