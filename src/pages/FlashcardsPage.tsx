import React, { useState, useEffect } from 'react';
import Flashcard from '../components/Flashcard';
import { Plus, BookOpen, Save, Shuffle } from 'lucide-react';

interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  topic: string;
  saved?: boolean;
  liked?: boolean;
}

export function FlashcardsPage() {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [savedFlashcards, setSavedFlashcards] = useState<FlashcardData[]>([]);
  const [activeTab, setActiveTab] = useState<'generated' | 'saved'>('generated');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentTopic = localStorage.getItem('currentTopic') || 'Machine Learning';
    setTopic(currentTopic);
    generateFlashcards(currentTopic);
    loadSavedFlashcards();
  }, []);

  const generateFlashcards = (topicName: string) => {
    setLoading(true);

    setTimeout(() => {
      const mockFlashcards: FlashcardData[] = [
        {
          id: '1',
          question: `What is ${topicName}?`,
          answer: `${topicName} is a field of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.`,
          topic: topicName
        },
        {
          id: '2',
          question: `Name three types of ${topicName} algorithms.`,
          answer: 'Supervised Learning (learns from labeled data), Unsupervised Learning (finds patterns in unlabeled data), and Reinforcement Learning (learns through trial and error).',
          topic: topicName
        },
        {
          id: '3',
          question: `What is the difference between training and testing data?`,
          answer: 'Training data is used to teach the algorithm patterns and relationships, while testing data is used to evaluate how well the trained model performs on new, unseen data.',
          topic: topicName
        },
        {
          id: '4',
          question: `What is overfitting in ${topicName}?`,
          answer: 'Overfitting occurs when a model learns the training data too well, including noise and random fluctuations, making it perform poorly on new data.',
          topic: topicName
        },
        {
          id: '5',
          question: `What are some real-world applications of ${topicName}?`,
          answer: 'Image recognition, natural language processing, recommendation systems, autonomous vehicles, fraud detection, and predictive analytics.',
          topic: topicName
        },
        {
          id: '6',
          question: `What is a neural network?`,
          answer: 'A neural network is a computing system inspired by biological neural networks, consisting of interconnected nodes (neurons) that process and transmit information.',
          topic: topicName
        }
      ];

      setFlashcards(mockFlashcards);
      setLoading(false);
    }, 1000);
  };

  const loadSavedFlashcards = () => {
    const saved = localStorage.getItem('savedFlashcards');
    if (saved) {
      setSavedFlashcards(JSON.parse(saved));
    }
  };

  const saveFlashcard = (id: string) => {
    const flashcardToSave = flashcards.find(f => f.id === id);
    if (flashcardToSave) {
      const isCurrentlySaved = flashcardToSave.saved;
      
      if (isCurrentlySaved) {
        // Unsave the flashcard
        const newSavedFlashcards = savedFlashcards.filter(f => f.id !== id);
        setSavedFlashcards(newSavedFlashcards);
        localStorage.setItem('savedFlashcards', JSON.stringify(newSavedFlashcards));
        setFlashcards(prev => prev.map(f => f.id === id ? { ...f, saved: false } : f));
      } else {
        // Save the flashcard
        const savedCard = { ...flashcardToSave, saved: true };
        const newSavedFlashcards = [...savedFlashcards, savedCard];
        setSavedFlashcards(newSavedFlashcards);
        localStorage.setItem('savedFlashcards', JSON.stringify(newSavedFlashcards));
        setFlashcards(prev => prev.map(f => f.id === id ? { ...f, saved: true } : f));
      }
    }
  };

  const deleteFlashcard = (id: string) => {
    const newSavedFlashcards = savedFlashcards.filter(f => f.id !== id);
    setSavedFlashcards(newSavedFlashcards);
    localStorage.setItem('savedFlashcards', JSON.stringify(newSavedFlashcards));
    
    setFlashcards(prev => prev.map(f => f.id === id ? { ...f, saved: false } : f));
  };

  const toggleLike = (id: string) => {
    const updated = savedFlashcards.map(f => f.id === id ? { ...f, liked: !f.liked } : f)
    setSavedFlashcards(updated)
    localStorage.setItem('savedFlashcards', JSON.stringify(updated))
  }

  const shuffleFlashcards = () => {
    const currentFlashcards = activeTab === 'generated' ? flashcards : savedFlashcards;
    const shuffled = [...currentFlashcards].sort(() => Math.random() - 0.5);
    
    if (activeTab === 'generated') {
      setFlashcards(shuffled);
    } else {
      setSavedFlashcards(shuffled);
    }
  };

  const currentFlashcards = activeTab === 'generated' ? flashcards : savedFlashcards;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Flashcards: {topic}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Study with interactive flashcards to improve retention
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('generated')}
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === 'generated'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <BookOpen size={20} className="inline mr-2" />
                Generated ({flashcards.length})
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === 'saved'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Save size={20} className="inline mr-2" />
                Saved ({savedFlashcards.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeTab === 'generated' ? 'Generated Flashcards' : 'Your Saved Flashcards'}
              </h2>
              <div className="flex space-x-3">
                {activeTab === 'generated' && (
                  <button
                    onClick={() => generateFlashcards(topic)}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    disabled={loading}
                  >
                    <Plus size={16} className="mr-2" />
                    Generate New
                  </button>
                )}
                <button
                  onClick={shuffleFlashcards}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={currentFlashcards.length === 0}
                >
                  <Shuffle size={16} className="mr-2" />
                  Shuffle
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Generating flashcards...</span>
              </div>
            ) : currentFlashcards.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {activeTab === 'generated' ? 'No flashcards generated yet' : 'No saved flashcards'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab === 'generated' 
                    ? 'Click "Generate New" to create flashcards for this topic'
                    : 'Save some flashcards from the generated tab to see them here'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentFlashcards.map((flashcard) => (
                  <Flashcard
                    key={flashcard.id}
                    card={flashcard}
                    onSave={saveFlashcard}
                    onDelete={deleteFlashcard}
                    onLike={activeTab==='saved'? toggleLike : undefined}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            💡 Study Tips
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• Click on flashcards to flip between question and answer</li>
            <li>• Save important flashcards for later review</li>
            <li>• Use the shuffle feature to randomize your study order</li>
            <li>• Practice regularly for better retention</li>
          </ul>
        </div>
      </div>
    </div>
  );
}