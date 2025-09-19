import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, BookmarkCheck, Shuffle } from 'lucide-react'
import Flashcard from '../components/Flashcard'

interface FlashcardData {
  id: string
  question: string
  answer: string
  saved?: boolean
}

export default function Flashcards() {
  const [topic, setTopic] = useState('')
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([])
  const [savedCards, setSavedCards] = useState<FlashcardData[]>([])
  const [currentView, setCurrentView] = useState<'generated' | 'saved'>('generated')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const currentTopic = localStorage.getItem('currentTopic') || 'Machine Learning'
    setTopic(currentTopic)
    
    const saved = JSON.parse(localStorage.getItem('savedFlashcards') || '[]')
    setSavedCards(saved)
    
    setIsLoading(true)
    setTimeout(() => {
      const mockCards: FlashcardData[] = [
        {
          id: '1',
          question: `What is ${currentTopic}?`,
          answer: `${currentTopic} is a method of data analysis that automates analytical model building using algorithms that iteratively learn from data.`
        },
        {
          id: '2',
          question: 'What is supervised learning?',
          answer: 'Supervised learning is a type of machine learning where the algorithm learns from labeled training data to make predictions on new, unseen data.'
        },
        {
          id: '3',
          question: 'What is the difference between classification and regression?',
          answer: 'Classification predicts discrete categories or classes, while regression predicts continuous numerical values.'
        },
        {
          id: '4',
          question: 'What is overfitting?',
          answer: 'Overfitting occurs when a model learns the training data too well, including noise and outliers, leading to poor performance on new data.'
        },
        {
          id: '5',
          question: 'What is cross-validation?',
          answer: 'Cross-validation is a technique used to assess how well a model will generalize to an independent dataset by partitioning data into training and validation sets.'
        },
        {
          id: '6',
          question: 'What is a neural network?',
          answer: 'A neural network is a computing system inspired by biological neural networks, consisting of interconnected nodes that process information.'
        }
      ]
      
      const cardsWithSavedStatus = mockCards.map(card => ({
        ...card,
        saved: saved.some((savedCard: FlashcardData) => savedCard.id === card.id)
      }))
      
      setFlashcards(cardsWithSavedStatus)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSave = (cardId: string) => {
    const cardToSave = flashcards.find(card => card.id === cardId)
    if (!cardToSave) return

    const isCurrentlySaved = cardToSave.saved
    
    setFlashcards(prev => prev.map(card => 
      card.id === cardId ? { ...card, saved: !isCurrentlySaved } : card
    ))

    if (isCurrentlySaved) {
      const updatedSaved = savedCards.filter(card => card.id !== cardId)
      setSavedCards(updatedSaved)
      localStorage.setItem('savedFlashcards', JSON.stringify(updatedSaved))
    } else {
      const updatedSaved = [...savedCards, { ...cardToSave, saved: true }]
      setSavedCards(updatedSaved)
      localStorage.setItem('savedFlashcards', JSON.stringify(updatedSaved))
    }
  }

  const handleDelete = (cardId: string) => {
    const updatedSaved = savedCards.filter(card => card.id !== cardId)
    setSavedCards(updatedSaved)
    localStorage.setItem('savedFlashcards', JSON.stringify(updatedSaved))
    
    setFlashcards(prev => prev.map(card => 
      card.id === cardId ? { ...card, saved: false } : card
    ))
  }

  const shuffleCards = () => {
    const currentCards = currentView === 'generated' ? flashcards : savedCards
    const shuffled = [...currentCards].sort(() => Math.random() - 0.5)
    
    if (currentView === 'generated') {
      setFlashcards(shuffled)
    } else {
      setSavedCards(shuffled)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 rounded-lg hover:bg-accent/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold">Loading Flashcards</h1>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Creating flashcards for "{topic}"...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentCards = currentView === 'generated' ? flashcards : savedCards

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 rounded-lg hover:bg-accent/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold">
              Flashcards: {currentView === 'generated' ? topic : 'Saved Cards'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={shuffleCards}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Shuffle size={16} />
              <span>Shuffle</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setCurrentView('generated')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              currentView === 'generated'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <Plus size={20} />
            <span>Generated Cards ({flashcards.length})</span>
          </button>
          
          <button
            onClick={() => setCurrentView('saved')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              currentView === 'saved'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <BookmarkCheck size={20} />
            <span>Saved Cards ({savedCards.length})</span>
          </button>
        </div>

        {currentCards.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-lg">
            <div className="text-muted-foreground mb-4">
              {currentView === 'saved' ? (
                <>
                  <BookmarkCheck size={48} className="mx-auto mb-4" />
                  <p className="text-lg">No saved flashcards yet</p>
                  <p>Save flashcards from the generated set to practice them later!</p>
                </>
              ) : (
                <>
                  <Plus size={48} className="mx-auto mb-4" />
                  <p className="text-lg">No flashcards generated</p>
                  <p>Generate flashcards by entering a topic on the home page.</p>
                </>
              )}
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCards.map((card) => (
              <Flashcard
                key={card.id}
                card={card}
                onSave={currentView === 'generated' ? handleSave : undefined}
                onDelete={currentView === 'saved' ? handleDelete : undefined}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}