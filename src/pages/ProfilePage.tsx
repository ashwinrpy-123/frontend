import React, { useState } from 'react';
import { User, Mail, Calendar, MapPin, Edit3, Save, X, Camera, Award, BookOpen, Target } from 'lucide-react';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    bio: 'Passionate learner exploring the frontiers of AI and machine learning. Love to combine theory with practical applications.',
    location: 'San Francisco, CA',
    joinDate: 'March 2024',
    avatar: '/api/placeholder/120/120'
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const stats = [
    { icon: BookOpen, label: 'Topics Completed', value: 24, color: 'text-blue-600' },
    { icon: Target, label: 'Quiz Average', value: '87%', color: 'text-green-600' },
    { icon: Award, label: 'Achievements', value: 8, color: 'text-purple-600' },
  ];

  const recentActivity = [
    { type: 'quiz', topic: 'Machine Learning Basics', score: '94%', date: '2 hours ago' },
    { type: 'summary', topic: 'Neural Networks', date: '1 day ago' },
    { type: 'flashcards', topic: 'Data Structures', count: 12, date: '2 days ago' },
    { type: 'quiz', topic: 'Web Development', score: '88%', date: '3 days ago' },
    { type: 'summary', topic: 'React Hooks', date: '5 days ago' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '🧠';
      case 'summary': return '📄';
      case 'flashcards': return '⚡';
      default: return '📚';
    }
  };

  const getActivityDescription = (activity: any) => {
    switch (activity.type) {
      case 'quiz':
        return `Completed quiz on ${activity.topic} with ${activity.score} score`;
      case 'summary':
        return `Generated summary for ${activity.topic}`;
      case 'flashcards':
        return `Created ${activity.count} flashcards for ${activity.topic}`;
      default:
        return `Activity on ${activity.topic}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary to-accent p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <User size={64} className="text-gray-400" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <Camera size={16} className="text-gray-600" />
                </button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="text-2xl font-bold bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 w-full"
                    />
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 w-full resize-none"
                      rows={3}
                    />
                    <input
                      type="text"
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 w-full"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                    <p className="text-white/90 mb-4 text-lg">{profile.bio}</p>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-white/80">
                      <div className="flex items-center">
                        <Mail size={16} className="mr-2" />
                        {profile.email}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        {profile.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        Joined {profile.joinDate}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Save size={16} className="mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Edit3 size={16} className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.label}
                  </p>
                </div>
                <stat.icon className={`${stat.color}`} size={32} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start">
                  <div className="text-2xl mr-4">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {getActivityDescription(activity)}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {activity.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}