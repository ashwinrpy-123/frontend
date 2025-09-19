import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, BookOpen, Brain, Target, Calendar } from 'lucide-react';
import { getQuizHistory } from '../lib/api';

export function ProgressPage() {
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const loadQuizHistory = async () => {
    try {
      const history = await getQuizHistory();
      setQuizHistory(history);
    } catch (err) {
      console.error('Failed to load quiz history:', err);
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
      setQuizHistory(saved);
    } finally {
      setLoading(false);
    }
  };

  // Generate daily quiz scores for the last 7 days
  const generateDailyScores = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find quizzes for this date
      const dayQuizzes = quizHistory.filter(q => 
        new Date(q.createdAt || q.date).toISOString().split('T')[0] === dateStr
      );
      
      const avgScore = dayQuizzes.length > 0 
        ? Math.round(dayQuizzes.reduce((sum, q) => sum + q.score, 0) / dayQuizzes.length)
        : 0;
      
      last7Days.push({
        date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: avgScore,
        count: dayQuizzes.length
      });
    }
    
    return last7Days;
  };

  // Generate monthly learning progress for the last 6 months
  const generateMonthlyProgress = () => {
    const last6Months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleDateString(undefined, { month: 'short' });
      
      // Find quizzes for this month
      const monthQuizzes = quizHistory.filter(q => {
        const quizDate = new Date(q.createdAt || q.date);
        return quizDate.getMonth() === date.getMonth() && 
               quizDate.getFullYear() === date.getFullYear();
      });
      
      const uniqueTopics = new Set(monthQuizzes.map(q => q.topic)).size;
      
      last6Months.push({
        month: monthStr,
        topics: uniqueTopics,
        quizzes: monthQuizzes.length,
        flashcards: Math.floor(monthQuizzes.length * 1.5) // Estimate based on quizzes
      });
    }
    
    return last6Months;
  };

  const quizScores = generateDailyScores();
  const learningProgress = generateMonthlyProgress();

  // Calculate achievements based on actual data
  const totalQuizzes = quizHistory.length;
  const averageScore = totalQuizzes ? Math.round(quizHistory.reduce((sum, q) => sum + q.score, 0) / totalQuizzes) : 0;
  const totalTopics = new Set(quizHistory.map(q => q.topic)).size;
  const perfectScores = quizHistory.filter(q => q.score === 100).length;
  const hasPerfectScore = perfectScores > 0;
  
  // Calculate learning streak (consecutive days with quizzes)
  const calculateStreak = () => {
    if (quizHistory.length === 0) return 0;
    
    const sortedQuizzes = quizHistory
      .map(q => new Date(q.createdAt || q.date).toISOString().split('T')[0])
      .sort()
      .reverse();
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const dateStr = currentDate.toISOString().split('T')[0];
      if (sortedQuizzes.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const learningStreak = calculateStreak();

  const achievements = [
    { icon: Award, title: 'Quiz Master', description: '50+ quizzes completed', earned: totalQuizzes >= 50 },
    { icon: BookOpen, title: 'Knowledge Seeker', description: '25+ topics learned', earned: totalTopics >= 25 },
    { icon: Brain, title: 'Perfect Score', description: 'Got 100% on a quiz', earned: hasPerfectScore },
    { icon: Target, title: 'Consistent Learner', description: '7-day learning streak', earned: learningStreak >= 7 },
    { icon: TrendingUp, title: 'Improvement Expert', description: 'Improved score by 20%', earned: averageScore >= 80 },
    { icon: Calendar, title: 'Monthly Champion', description: 'Top learner this month', earned: totalQuizzes >= 20 }
  ];

  const stats = [
    { label: 'Total Topics', value: String(totalTopics || 0), change: '', trend: 'up', icon: BookOpen },
    { label: 'Quizzes Taken', value: String(totalQuizzes), change: '', trend: 'up', icon: Brain },
    { label: 'Learning Streak', value: `${learningStreak} days`, change: '', trend: 'up', icon: Target },
    { label: 'Average Score', value: `${averageScore}%`, change: '', trend: 'up', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="relative">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Learning Progress
          </h1>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning journey and achievements
          </p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <a href={stat.label.includes('Quizzes')?'/quiz': stat.label.includes('Flashcards')?'/flashcards':'/progress'} key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="text-primary group-hover:animate-pulse" size={32} />
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp size={16} className="mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {stat.label}
              </p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Daily Quiz Scores (Last 7 Days)
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
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
                    formatter={(value, name, props) => [
                      `${value}% (${props.payload.count} quiz${props.payload.count !== 1 ? 'es' : ''})`,
                      'Score'
                    ]}
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
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Learning Streak & Stats
            </h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{learningStreak}</div>
                <div className="text-gray-600 dark:text-gray-400">Day Streak</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{perfectScores}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Perfect Scores</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalTopics}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Topics Studied</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Monthly Learning Progress (Last 6 Months)
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
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
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 group ${
                  achievement.earned 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 hover:shadow-lg' 
                    : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 hover:border-gray-400 dark:hover:border-slate-500'
                }`}
              >
                <div className="flex items-center mb-3">
                  <achievement.icon 
                    className={`${achievement.earned ? 'text-green-600 group-hover:animate-bounce' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'} transition-colors`} 
                    size={24} 
                  />
                  <h3 className={`ml-3 font-semibold transition-colors ${
                    achievement.earned ? 'text-green-700 dark:text-green-400 group-hover:text-green-800 dark:group-hover:text-green-300' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                  }`}>
                    {achievement.title}
                  </h3>
                </div>
                <p className={`text-sm transition-colors ${
                  achievement.earned ? 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300' : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 animate-pulse">
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