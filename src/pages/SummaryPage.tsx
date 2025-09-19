import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Zap, Clock, Target, Star } from 'lucide-react';

export function SummaryPage() {
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentTopic = localStorage.getItem('currentTopic') || 'Machine Learning';
    setTopic(currentTopic);
    generateSummary(currentTopic);
  }, []);

  const generateSummary = (topicName: string) => {
    setLoading(true);
    
    setTimeout(() => {
      const mockSummary = `# ${topicName}

## Overview
${topicName} is a fascinating subject that encompasses multiple key concepts and applications. This comprehensive summary covers the fundamental principles, core components, and practical implications.

## Key Concepts

### Foundation Principles
The core foundation of ${topicName} rests on several fundamental principles that form the basis for more advanced understanding. These principles have been developed through years of research and practical application.

### Core Components
1. **Primary Elements**: The essential building blocks that define the structure
2. **Secondary Features**: Supporting elements that enhance functionality
3. **Integration Points**: How different components work together seamlessly

### Practical Applications
${topicName} has wide-ranging applications across various industries and domains:
- **Industry Applications**: Real-world implementations in business
- **Academic Research**: Theoretical developments and studies
- **Future Prospects**: Emerging trends and potential developments

## Advanced Topics

### Current Developments
Recent advances in ${topicName} have opened up new possibilities for innovation and growth. These developments are shaping the future landscape of the field.

### Best Practices
Following established best practices ensures optimal results and sustainable implementation of ${topicName} principles.

## Conclusion
Understanding ${topicName} provides valuable insights that can be applied across multiple contexts. The knowledge gained forms a solid foundation for further exploration and practical application.`;

      setSummary(mockSummary);
      setLoading(false);
    }, 1500);
  };

  const handleAction = (action: string) => {
    localStorage.setItem('currentTopic', topic);
    navigate(`/${action}`);
  };

  const formatSummary = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium text-gray-900 dark:text-white mb-3 mt-6">{line.substring(4)}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-medium text-gray-900 dark:text-white mb-2">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="text-gray-700 dark:text-gray-300 mb-1 ml-4">{line.substring(2)}</li>;
      }
      if (line.match(/^\d+\./)) {
        return <li key={index} className="text-gray-700 dark:text-gray-300 mb-1 ml-4">{line}</li>;
      }
      if (line.trim() === '') {
        return <div key={index} className="mb-4"></div>;
      }
      return <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="text-white" size={32} />
                <div>
                  <h1 className="text-2xl font-bold text-white">Topic Summary</h1>
                  <p className="text-primary-foreground/80">AI-generated comprehensive overview</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span className="text-sm">5 min read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target size={16} />
                  <span className="text-sm">Beginner</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={16} />
                  <span className="text-sm">4.8/5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Generating summary...</span>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {formatSummary(summary)}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-800/50">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Ready to test your knowledge?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleAction('quiz')}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Brain size={20} className="mr-2" />
                Take Quiz on this Topic
              </button>
              <button
                onClick={() => handleAction('flashcards')}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Zap size={20} className="mr-2" />
                Create Flashcards
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}