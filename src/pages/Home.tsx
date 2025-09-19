import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Brain, Zap, TrendingUp, X, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTopic } from '../contexts/TopicContext'

export function Home() {
  const [topic, setTopic] = useState('')
  const [topicError, setTopicError] = useState('')
  const [topicSubmitted, setTopicSubmitted] = useState(false)
  const navigate = useNavigate()
  const { topic: currentTopic, setTopic: setGlobalTopic } = useTopic()
  const { user } = useAuth()

  const handleAction = (action: string) => {
    if (!topic.trim()) {
      setTopicError('Please enter a topic.')
      return
    }
    
    setTopicError('')
    setGlobalTopic(topic)
    setTopicSubmitted(true) // Lock the input after submission
    
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

  const resetTopic = () => {
    setTopic('')
    setTopicSubmitted(false)
    setTopicError('')
    setGlobalTopic('')
  }

  // Auto-fill topic from context if available (only on first load)
  useEffect(() => {
    if (currentTopic && !topic && !topicSubmitted) {
      setTopic(currentTopic)
    }
  }, [currentTopic, topic, topicSubmitted])


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
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
              Welcome to NeoLearn
            </h1>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform any topic into an engaging learning experience with AI-powered summaries, quizzes, and flashcards
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg mb-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">Start Learning Something New</h2>
            
            <div className="mb-6">
              <label htmlFor="topic" className="block text-sm font-medium mb-2">
                What would you like to learn about?
              </label>
              <div className="relative">
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value)
                    if (topicError) setTopicError('')
                    if (topicSubmitted) setTopicSubmitted(false)
                  }}
                  placeholder="e.g. Machine Learning, World History, Python Programming..."
                  className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                    topicError ? 'border-red-500' : 'border-border'
                  }`}
                  onKeyPress={(e) => e.key === 'Enter' && handleAction('studybuddy')}
                />
                {topic && (
                  <button
                    onClick={resetTopic}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Clear topic"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              {topicError && (
                <p className="text-red-500 text-sm mt-1">{topicError}</p>
              )}
              {topicSubmitted && (
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Topic ready! Use the buttons below to start learning, or edit above to change topic.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => handleAction('studybuddy')}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
              >
                <MessageCircle size={20} className="group-hover:animate-bounce" />
                <span>StudyBuddy</span>
              </button>
              
              <button
                onClick={() => handleAction('quiz')}
                className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
              >
                <Brain size={20} className="group-hover:animate-pulse" />
                <span>Take Quiz</span>
              </button>
              
              <button
                onClick={() => handleAction('flashcards')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
              >
                <Zap size={20} className="group-hover:animate-pulse" />
                <span>Make Flashcards</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
              <div className={`w-12 h-12 rounded-lg bg-current/10 flex items-center justify-center mb-4 ${feature.color} group-hover:animate-pulse`}>
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}