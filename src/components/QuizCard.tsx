import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface QuizCardProps {
  question: QuizQuestion
  onAnswer: (questionId: string, answer: number) => void
  showResult?: boolean
  selectedAnswer?: number
}

export default function QuizCard({ question, onAnswer, showResult = false, selectedAnswer: selectedAnswerProp }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(selectedAnswerProp ?? null)

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
    onAnswer(question.id, answerIndex)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === question.correctAnswer
          const showCorrect = showResult && isCorrect
          const showIncorrect = showResult && isSelected && !isCorrect

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-md border transition-all ${
                showCorrect
                  ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300'
                  : showIncorrect
                  ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300'
                  : isSelected
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-background border-border hover:bg-accent/10 hover:border-accent'
              } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && (
                  <div className="ml-2">
                    {showCorrect && <CheckCircle size={20} className="text-green-600" />}
                    {showIncorrect && <XCircle size={20} className="text-red-600" />}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}