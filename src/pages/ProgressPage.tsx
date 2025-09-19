import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, BookOpen, Brain, Target, Calendar } from 'lucide-react';

export function ProgressPage() {
  const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]') as any[]
  const savedFlashcards = JSON.parse(localStorage.getItem('savedFlashcards') || '[]') as any[]

  const quizScores = savedQuizzes.length > 0
    ? savedQuizzes.slice(0, 7).map((q) => ({
        date: new Date(q.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: Math.round((q.score / q.total) * 100),
      }))
    : [
        { date: 'Mon', score: 85 },
        { date: 'Tue', score: 92 },
        { date: 'Wed', score: 78 },
        { date: 'Thu', score: 96 },
        { date: 'Fri', score: 88 },
        { date: 'Sat', score: 94 },
        { date: 'Sun', score: 87 },
      ];

  const learningProgress = [
    { month: 'Jan', topics: 3, quizzes: 12, flashcards: 45 },
    { month: 'Feb', topics: 5, quizzes: 18, flashcards: 67 },
    { month: 'Mar', topics: 4, quizzes: 15, flashcards: 52 },
    { month: 'Apr', topics: 6, quizzes: 24, flashcards: 89 },
    { month: 'May', topics: 8, quizzes: 31, flashcards: 112 },
    { month: 'Jun', topics: 7, quizzes: 28, flashcards: 98 }
  ];

  const topicDistribution = [
    { name: 'Machine Learning', value: 35, color: '#6366F1' },
    { name: 'Web Development', value: 25, color: '#8B5CF6' },
    { name: 'Data Science', value: 20, color: '#06B6D4' },
    { name: 'AI Ethics', value: 12, color: '#10B981' },
    { name: 'Others', value: 8, color: '#F59E0B' }
  ];

  const achievements = [
    { icon: Award, title: 'Quiz Master', description: '50+ quizzes completed', earned: true },
    { icon: BookOpen, title: 'Knowledge Seeker', description: '25+ topics learned', earned: true },
    { icon: Brain, title: 'Perfect Score', description: 'Got 100% on a quiz', earned: true },
    { icon: Target, title: 'Consistent Learner', description: '7-day learning streak', earned: false },
    { icon: TrendingUp, title: 'Improvement Expert', description: 'Improved score by 20%', earned: true },
    { icon: Calendar, title: 'Monthly Champion', description: 'Top learner this month', earned: false }
  ];

  const totalQuizzes = savedQuizzes.length
  const averageScore = totalQuizzes ? Math.round(savedQuizzes.reduce((a,c)=> a + (c.score / c.total) * 100, 0) / totalQuizzes) : 0
  const totalFlashcards = savedFlashcards.length
  const totalTopics = new Set([ ...savedQuizzes.map(q=>q.topic), ...savedFlashcards.map((f:any)=>f.topic) ]).size

  const stats = [
    { label: 'Total Topics', value: String(totalTopics || 0), change: '', trend: 'up', icon: BookOpen },
    { label: 'Quizzes Taken', value: String(totalQuizzes), change: '', trend: 'up', icon: Brain },
    { label: 'Flashcards Created', value: String(totalFlashcards), change: '', trend: 'up', icon: Target },
    { label: 'Average Score', value: `${averageScore}%`, change: '', trend: 'up', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Learning Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning journey and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <a href={stat.label.includes('Quizzes')?'/quiz': stat.label.includes('Flashcards')?'/flashcards':'/progress'} key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="text-primary" size={32} />
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp size={16} className="mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.label}
              </p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Daily Quiz Scores
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={quizScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366F1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Topic Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topicDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {topicDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Monthly Learning Progress
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={learningProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar dataKey="topics" fill="#6366F1" name="Topics Learned" />
              <Bar dataKey="quizzes" fill="#8B5CF6" name="Quizzes Taken" />
              <Bar dataKey="flashcards" fill="#06B6D4" name="Flashcards Created" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center mb-3">
                  <achievement.icon 
                    className={achievement.earned ? 'text-green-600' : 'text-gray-400'} 
                    size={24} 
                  />
                  <h3 className={`ml-3 font-semibold ${
                    achievement.earned ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </h3>
                </div>
                <p className={`text-sm ${
                  achievement.earned ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
                      ✓ Earned
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}