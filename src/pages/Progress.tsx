import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, BookOpen, Brain, Calendar, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function Progress() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalFlashcards: 0,
    averageScore: 0,
    streak: 0
  })
  const navigate = useNavigate()

  const quizData = [
    { topic: 'Machine Learning', score: 85 },
    { topic: 'Python Programming', score: 92 },
    { topic: 'Data Structures', score: 78 },
    { topic: 'Web Development', score: 88 },
    { topic: 'Database Design', score: 95 }
  ]

  const progressData = [
    { week: 'Week 1', quizzes: 3, flashcards: 15 },
    { week: 'Week 2', quizzes: 5, flashcards: 22 },
    { week: 'Week 3', quizzes: 4, flashcards: 18 },
    { week: 'Week 4', quizzes: 7, flashcards: 28 }
  ]

  const categoryData = [
    { name: 'Technology', value: 45, color: '#6366F1' },
    { name: 'Science', value: 30, color: '#8B5CF6' },
    { name: 'Mathematics', value: 15, color: '#10B981' },
    { name: 'Languages', value: 10, color: '#F59E0B' }
  ]

  useEffect(() => {
    const savedFlashcards = JSON.parse(localStorage.getItem('savedFlashcards') || '[]')
    setStats({
      totalQuizzes: 12,
      totalFlashcards: savedFlashcards.length,
      averageScore: 87,
      streak: 5
    })
  }, [])

  const achievements = [
    { title: 'Quiz Master', description: 'Completed 10+ quizzes', earned: stats.totalQuizzes >= 10, icon: Brain },
    { title: 'Card Collector', description: 'Saved 20+ flashcards', earned: stats.totalFlashcards >= 20, icon: BookOpen },
    { title: 'High Achiever', description: 'Average score above 85%', earned: stats.averageScore >= 85, icon: Trophy },
    { title: 'Consistent Learner', description: '5-day learning streak', earned: stats.streak >= 5, icon: Calendar }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold">Learning Progress</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Quizzes</p>
                <p className="text-3xl font-bold text-primary">{stats.totalQuizzes}</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saved Cards</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalFlashcards}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.averageScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Learning Streak</p>
                <p className="text-3xl font-bold text-orange-600">{stats.streak} days</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quiz Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quizData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="topic" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="quizzes" stroke="#6366F1" strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="flashcards" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Achievements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.earned
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'bg-muted/50 border-border text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <achievement.icon size={20} className="mr-2" />
                    <h4 className="font-medium">{achievement.title}</h4>
                  </div>
                  <p className="text-sm opacity-80">{achievement.description}</p>
                  {achievement.earned && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                        Earned
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Topics Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}