import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Brain, Zap, TrendingUp, X, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function Home() {
  const [topic, setTopic] = useState('')
  const [topicError, setTopicError] = useState('')
  const [selectedEducationLevels, setSelectedEducationLevels] = useState<('school' | 'college' | 'work')[]>([])
  const navigate = useNavigate()
  const { user, updateEducationLevel } = useAuth()

  const handleAction = (action: string) => {
    if (!topic.trim()) {
      setTopicError('Please enter a topic.')
      return
    }
    
    setTopicError('')
    localStorage.setItem('currentTopic', topic)
    
    switch (action) {
      case 'studybuddy':
        navigate('/chatbot')
        break
      case 'quiz':
        navigate('/quiz')
        break
      case 'flashcards':
        navigate('/flashcards')
        break
    }
  }

  const handleEducationLevelSelect = (level: 'school' | 'college' | 'work') => {
    if (!selectedEducationLevels.includes(level)) {
      setSelectedEducationLevels(prev => [...prev, level])
    }
  }

  const handleEducationLevelRemove = (level: 'school' | 'college' | 'work') => {
    setSelectedEducationLevels(prev => prev.filter(l => l !== level))
  }

  const features = [
    {
      icon: MessageCircle,
      title: 'StudyBuddy AI',
      description: 'Chat with AI to get summaries, explanations, and learning support',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Brain,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with adaptive quizzes',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Zap,
      title: 'Smart Flashcards',
      description: 'Create and practice with intelligent flashcards',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {!user?.educationLevel && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-2">Tell us about you</h2>
            <p className="text-muted-foreground mb-4">What best describes your current situation? This helps tailor your content.</p>
            
            {selectedEducationLevels.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Selected:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEducationLevels.map((level) => (
                    <div key={level} className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                      <span className="capitalize">{level}</span>
                      <button
                        onClick={() => handleEducationLevelRemove(level)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              {!selectedEducationLevels.includes('school') && (
                <button 
                  onClick={() => handleEducationLevelSelect('school')} 
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  School
                </button>
              )}
              {!selectedEducationLevels.includes('college') && (
                <button 
                  onClick={() => handleEducationLevelSelect('college')} 
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                >
                  College
                </button>
              )}
              {!selectedEducationLevels.includes('work') && (
                <button 
                  onClick={() => handleEducationLevelSelect('work')} 
                  className="px-4 py-2 rounded-md bg-accent text-white hover:bg-accent/90 transition-colors"
                >
                  Work
                </button>
              )}
            </div>
          </div>
        )}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to NeoLearn
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform any topic into an engaging learning experience with AI-powered summaries, quizzes, and flashcards
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg mb-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">Start Learning Something New</h2>
            
            <div className="mb-6">
              <label htmlFor="topic" className="block text-sm font-medium mb-2">
                What would you like to learn about?
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value)
                  if (topicError) setTopicError('')
                }}
                placeholder="e.g. Machine Learning, World History, Python Programming..."
                className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                  topicError ? 'border-red-500' : 'border-border'
                }`}
                onKeyPress={(e) => e.key === 'Enter' && handleAction('studybuddy')}
              />
              {topicError && (
                <p className="text-red-500 text-sm mt-1">{topicError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => handleAction('studybuddy')}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>StudyBuddy</span>
              </button>
              
              <button
                onClick={() => handleAction('quiz')}
                className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center space-x-2"
              >
                <Brain size={20} />
                <span>Take Quiz</span>
              </button>
              
              <button
                onClick={() => handleAction('flashcards')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Zap size={20} />
                <span>Make Flashcards</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-lg bg-current/10 flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}