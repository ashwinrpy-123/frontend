import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trophy, Target } from 'lucide-react'
import QuizCard from '../components/QuizCard'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export default function Quiz() {
  const [topic, setTopic] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{[key: string]: number}>({})
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const currentTopic = localStorage.getItem('currentTopic') || 'Machine Learning'
    setTopic(currentTopic)
    
    setIsLoading(true)
    setTimeout(() => {
      const mockQuestions: Question[] = [
        {
          id: '1',
          question: `What is the primary goal of ${currentTopic}?`,
          options: [
            'To replace human intelligence completely',
            'To enable computers to learn and make decisions from data',
            'To create robots that look like humans',
            'To eliminate the need for programming'
          ],
          correctAnswer: 1
        },
        {
          id: '2',
          question: `Which type of learning uses labeled training data?`,
          options: [
            'Unsupervised Learning',
            'Reinforcement Learning', 
            'Supervised Learning',
            'Deep Learning'
          ],
          correctAnswer: 2
        },
        {
          id: '3',
          question: `What is a common application of ${currentTopic} in healthcare?`,
          options: [
            'Building hospital infrastructure',
            'Medical diagnosis and imaging analysis',
            'Managing hospital staff schedules',
            'Cleaning medical equipment'
          ],
          correctAnswer: 1
        },
        {
          id: '4',
          question: `Which programming language is most commonly used in ${currentTopic}?`,
          options: [
            'Assembly',
            'COBOL',
            'Python',
            'Pascal'
          ],
          correctAnswer: 2
        },
        {
          id: '5',
          question: `What does overfitting mean in ${currentTopic}?`,
          options: [
            'When a model has too few parameters',
            'When a model performs well on training data but poorly on new data',
            'When a model takes too long to train',
            'When a model uses too much memory'
          ],
          correctAnswer: 1
        }
      ]
      setQuestions(mockQuestions)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleAnswer = (questionId: string, answer: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const resetQuiz = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setShowResults(false)
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
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
            <h1 className="text-3xl font-bold">Loading Quiz</h1>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Preparing questions about "{topic}"...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / questions.length) * 100)
    
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
            <h1 className="text-3xl font-bold">Quiz Results</h1>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg mb-8 text-center">
            <div className="mb-6">
              <Trophy size={48} className={`mx-auto mb-4 ${getScoreColor(score, questions.length)}`} />
              <h2 className="text-4xl font-bold mb-2">
                <span className={getScoreColor(score, questions.length)}>{score}</span>
                <span className="text-muted-foreground">/{questions.length}</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                You scored {percentage}% on {topic}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(score, questions.length)}`}>
                  {score}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {questions.length - score}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {percentage}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>Retake Quiz</span>
              </button>
              
              <button
                onClick={() => navigate('/progress')}
                className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center space-x-2"
              >
                <Target size={20} />
                <span>View Progress</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-4">Review Answers</h3>
            {questions.map((question, index) => (
              <QuizCard
                key={question.id}
                question={question}
                onAnswer={() => {}}
                showResult={true}
                selectedAnswer={answers[question.id]}
              />
            ))}
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
            <h1 className="text-3xl font-bold">Quiz: {topic}</h1>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <div className="mb-6">
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <QuizCard
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!answers[questions[currentQuestion]?.id]}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  )
}