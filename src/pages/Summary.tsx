import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Zap, ArrowLeft, Copy, Check } from 'lucide-react'

export default function Summary() {
  const [topic, setTopic] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const currentTopic = localStorage.getItem('currentTopic') || 'Machine Learning'
    setTopic(currentTopic)
    
    setIsLoading(true)
    setTimeout(() => {
      setSummary(`
# ${currentTopic}

${currentTopic} is a fascinating and rapidly evolving field that has revolutionized how we approach problem-solving and data analysis. Here's a comprehensive overview:

## Key Concepts

**Definition**: ${currentTopic} involves the study and application of algorithms and statistical models that computer systems use to perform specific tasks without explicit instructions.

**Core Principles**:
- Pattern recognition and data analysis
- Predictive modeling and forecasting
- Automated decision-making processes
- Continuous learning and adaptation

## Main Categories

1. **Supervised Learning**: Uses labeled datasets to train algorithms
2. **Unsupervised Learning**: Finds patterns in data without labeled examples  
3. **Reinforcement Learning**: Learns through interaction with an environment

## Real-World Applications

- **Healthcare**: Medical diagnosis, drug discovery, personalized treatment
- **Finance**: Fraud detection, algorithmic trading, credit scoring
- **Technology**: Recommendation systems, natural language processing, computer vision
- **Transportation**: Autonomous vehicles, route optimization, traffic management

## Getting Started

To begin your journey in ${currentTopic}:
1. Build a strong foundation in mathematics and statistics
2. Learn programming languages like Python or R
3. Practice with real datasets and projects
4. Stay updated with the latest research and trends

This field offers incredible opportunities for innovation and problem-solving across virtually every industry.
      `)
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleQuiz = () => {
    localStorage.setItem('currentTopic', topic)
    navigate('/quiz')
  }

  const handleFlashcards = () => {
    localStorage.setItem('currentTopic', topic)
    navigate('/flashcards')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 rounded-lg hover:bg-accent/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold">Generating Summary</h1>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Analyzing "{topic}"...</span>
            </div>
            
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-accent/20 rounded-md mb-2" style={{ width: `${85 + Math.random() * 15}%` }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 rounded-lg hover:bg-accent/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold">Summary: {topic}</h1>
          </div>
          
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg mb-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>').replace(/#{1,3}\s/g, '<h3 class="text-lg font-semibold mt-6 mb-3">').replace(/<h3[^>]*>([^<]*)<\/h3>/g, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/- /g, '• ') }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleQuiz}
            className="bg-accent text-white px-6 py-4 rounded-xl font-medium hover:bg-accent/90 transition-colors flex items-center justify-center space-x-3 shadow-lg"
          >
            <Brain size={24} />
            <span>Take Quiz on this Topic</span>
          </button>
          
          <button
            onClick={handleFlashcards}
            className="bg-green-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-3 shadow-lg"
          >
            <Zap size={24} />
            <span>Make Flashcards</span>
          </button>
        </div>
      </div>
    </div>
  )
}