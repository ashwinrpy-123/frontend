import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Calendar, Settings, BookOpen, Trophy, Target } from 'lucide-react'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joinDate: '2024-01-15',
    bio: 'Passionate learner exploring the world of technology and science through interactive learning.',
    preferences: {
      theme: 'light',
      difficulty: 'intermediate',
      notifications: true
    }
  })

  const navigate = useNavigate()

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile))
    setIsEditing(false)
  }

  const stats = [
    { label: 'Quizzes Completed', value: '24', icon: Trophy, color: 'text-yellow-600' },
    { label: 'Flashcards Saved', value: '156', icon: BookOpen, color: 'text-green-600' },
    { label: 'Learning Streak', value: '12 days', icon: Target, color: 'text-blue-600' }
  ]

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
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Personal Information</h2>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="text-2xl font-bold bg-background border border-border rounded px-3 py-1"
                      />
                    ) : (
                      <h3 className="text-2xl font-bold">{profile.name}</h3>
                    )}
                    <p className="text-muted-foreground">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-muted-foreground">
                      <Mail size={16} className="mr-2" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md"
                      />
                    ) : (
                      <p>{profile.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-muted-foreground">
                      <Calendar size={16} className="mr-2" />
                      Join Date
                    </label>
                    <p>{new Date(profile.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md resize-none"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Settings size={20} className="mr-2" />
                Preferences
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Learning Difficulty</label>
                  <select
                    value={profile.preferences.difficulty}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, difficulty: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md disabled:opacity-50"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Notifications</span>
                  <button
                    onClick={() => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, notifications: !prev.preferences.notifications }
                    }))}
                    disabled={!isEditing}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                      profile.preferences.notifications ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        profile.preferences.notifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Learning Stats</h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-current/10 ${stat.color}`}>
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <div>
                      <p className="font-semibold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/progress')}
                  className="w-full text-left p-3 rounded-lg hover:bg-accent/10 transition-colors flex items-center space-x-2"
                >
                  <Trophy size={16} />
                  <span>View Progress</span>
                </button>
                
                <button 
                  onClick={() => navigate('/flashcards')}
                  className="w-full text-left p-3 rounded-lg hover:bg-accent/10 transition-colors flex items-center space-x-2"
                >
                  <BookOpen size={16} />
                  <span>My Flashcards</span>
                </button>
                
                <button 
                  onClick={() => navigate('/')}
                  className="w-full text-left p-3 rounded-lg hover:bg-accent/10 transition-colors flex items-center space-x-2"
                >
                  <Target size={16} />
                  <span>Start Learning</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Keep Learning!</h3>
              <p className="text-sm opacity-90 mb-4">
                You're doing great! Continue your learning streak and unlock new achievements.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Start New Topic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}