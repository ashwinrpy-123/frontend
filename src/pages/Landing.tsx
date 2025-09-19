import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Brain, Zap, TrendingUp, Bot } from 'lucide-react'

export function Landing() {
  const features = [
    { icon: Bot, title: 'StudyBuddy', desc: 'Ask, learn, and get instant summaries, quizzes, and flashcards.' },
    { icon: Brain, title: 'Quiz Generator', desc: 'Create tailored quizzes to test your understanding.' },
    { icon: Zap, title: 'Smart Flashcards', desc: 'Auto-generate cards and practice effectively.' },
    { icon: TrendingUp, title: 'Progress Tracking', desc: 'See topics studied, quizzes taken, and your average score.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">NeoLearn</h1>
          <p className="text-lg text-muted-foreground">Turn any topic into a guided learning journey with AI.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {features.map((f, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <f.icon size={24} className="text-primary mr-3" />
                <h3 className="text-xl font-semibold">{f.title}</h3>
              </div>
              <p className="text-muted-foreground">{f.desc}</p>
              <div className="mt-4 text-sm bg-accent/10 border border-accent/20 rounded-lg p-3">
                {f.title.includes('StudyBuddy') && 'Example: "Explain Newton\'s Laws and give 5 MCQs"'}
                {f.title.includes('Quiz') && 'Example: "Create a 10-question quiz on Photosynthesis"'}
                {f.title.includes('Flashcards') && 'Example: "Generate 8 flashcards on World War II"'}
                {f.title.includes('Progress') && 'Example: Click to view all saved quizzes and cards.'}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-center">Get Started</Link>
          <Link to="/login" className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground text-center">I already have an account</Link>
        </div>
      </div>
    </div>
  )
}


