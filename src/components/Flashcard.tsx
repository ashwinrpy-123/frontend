import { useState } from 'react'
import { RotateCcw, Heart, Trash2, X } from 'lucide-react'

interface FlashcardData {
  id: string
  question: string
  answer: string
  saved?: boolean
  liked?: boolean
}

interface FlashcardProps {
  card: FlashcardData
  onSave?: (cardId: string) => void
  onDelete?: (cardId: string) => void
  onLike?: (cardId: string) => void
  showActions?: boolean
}

export default function Flashcard({ card, onSave, onDelete, onLike, showActions = true }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <div className="relative group">
      <div 
        className="relative w-full h-64 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col justify-center items-center shadow-sm">
              <div className="text-sm text-muted-foreground mb-2">Question</div>
              <p className="text-center text-lg font-medium">{card.question}</p>
              <div className="absolute bottom-4 right-4">
                <RotateCcw size={16} className="text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 h-full flex flex-col justify-center items-center shadow-sm">
              <div className="text-sm text-muted-foreground mb-2">Answer</div>
              <p className="text-center text-lg font-medium">{card.answer}</p>
              <div className="absolute bottom-4 right-4">
                <RotateCcw size={16} className="text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="absolute top-2 right-2 flex space-x-2">
          {onSave && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSave(card.id)
              }}
              className={`p-2 rounded-md transition-colors shadow ${
                card.saved 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              <Heart size={16} className={card.saved ? 'fill-current' : ''} />
            </button>
          )}
          {onLike && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onLike(card.id)
              }}
              className={`p-2 rounded-md transition-colors shadow ${card.liked ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-white/80 text-muted-foreground hover:bg-pink-100 hover:text-pink-600'}`}
            >
              <Heart size={16} className={card.liked ? 'fill-current' : ''} />
            </button>
          )}
           {onDelete && (
             <button
               onClick={(e) => {
                 e.stopPropagation()
                 setShowDeleteModal(true)
               }}
               className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors shadow"
             >
               <Trash2 size={16} />
             </button>
           )}
        </div>
      )}
      
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Flashcard</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Do you want to delete this flashcard?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onDelete?.(card.id)
                  setShowDeleteModal(false)
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}