import React, { useState, useEffect } from 'react';
import QuizCard from '../components/QuizCard';
import { CheckCircle, XCircle, Trophy, RotateCcw, Home, Save, Trash2, Bookmark, Plus, Calendar, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTopic } from '../contexts/TopicContext';
import { generateQuiz, submitQuiz, getQuizHistory } from '../lib/api';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function QuizPage() {
  const { topic, setTopic: setGlobalTopic } = useTopic();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savedList, setSavedList] = useState<any[]>([]);
  const [tab, setTab] = useState<'take'|'saved'>('saved');
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizHistory();
    if (topic) {
      generateQuizFromAPI(topic);
    }
  }, [topic]);

  const loadQuizHistory = async () => {
    try {
      const history = await getQuizHistory();
      setSavedList(history);
    } catch (err) {
      console.error('Failed to load quiz history:', err);
    }
  };

  const generateQuizFromAPI = async (topicName: string) => {
    setLoading(true);
    setShowResults(false);
    setAnswers({});

    try {
      const data = await generateQuiz(topicName, 10);
      const formattedQuestions: Question[] = data.questions.map((q: any, index: number) => ({
        id: String(index + 1),
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));
      setQuestions(formattedQuestions);
      setTab('take');
    } catch (err) {
      console.error('Failed to generate quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const submitQuiz = async () => {
    if (questions.length === 0) return;

    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = correctAnswers;
    setScore(finalScore);
    setShowResults(true);

    try {
      await submitQuiz({
        topic: topic || 'Unknown Topic',
        totalQuestions: questions.length,
        score: finalScore
      });
      loadQuizHistory();
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }
  };

  const resetQuiz = () => {
    setShowResults(false);
    setAnswers({});
    setScore(0);
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return 'Outstanding! You have mastered this topic!';
    if (percentage >= 80) return 'Excellent work! You have a strong understanding.';
    if (percentage >= 70) return 'Good job! You have a solid grasp of the material.';
    if (percentage >= 60) return 'Not bad! Consider reviewing some concepts.';
    return 'Keep studying! You can improve with more practice.';
  };

  const deleteQuiz = async (id: string) => {
    try {
      // Add delete API call here if needed
      setSavedList(prev => prev.filter(quiz => quiz.id !== id));
    } catch (err) {
      console.error('Failed to delete quiz:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz: {topic || 'Select a Topic'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your knowledge and track your progress
          </p>
          {topic && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-primary font-medium">
                🧠 Quiz Topic: <span className="font-bold">{topic}</span>
              </p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="flex">
              <button
                onClick={() => setTab('take')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  tab === 'take'
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Brain className="inline mr-2" size={18} />
                Take Quiz
              </button>
              <button
                onClick={() => setTab('saved')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  tab === 'saved'
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Bookmark className="inline mr-2" size={18} />
                Quiz History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {tab === 'saved' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Quiz History
                  </h3>
                  <button
                    onClick={() => setTab('take')}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={18} className="mr-2" />
                    New Quiz
                  </button>
                </div>
                {savedList.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-500 dark:text-gray-400">No quiz history yet. Take your first quiz!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedList.map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <Trophy className="text-yellow-500" size={24} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{quiz.topic}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {quiz.score}/{quiz.totalQuestions} • {new Date(quiz.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                          </span>
                          <button
                            onClick={() => deleteQuiz(quiz.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'take' && (
              <>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Generating quiz...</span>
                  </div>
                ) : showResults ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 mb-8">
                    <div className="text-center mb-6">
                      <Trophy className={`mx-auto mb-4 ${getScoreColor()}`} size={64} />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Quiz Complete!
                      </h2>
                      <p className={`text-4xl font-bold ${getScoreColor()}`}>
                        {score}/{questions.length}
                      </p>
                      <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                        {Math.round((score / questions.length) * 100)}% Correct
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-md mx-auto">
                        {getScoreMessage()}
                      </p>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={resetQuiz}
                        className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <RotateCcw size={20} className="mr-2" />
                        Retake Quiz
                      </button>
                      <button
                        onClick={()=>setTab('saved')}
                        className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Bookmark size={20} className="mr-2" />
                        View Saved
                      </button>
                      <button
                        onClick={() => navigate('/')}
                        className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Home size={20} className="mr-2" />
                        Back to Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setGlobalTopic(`Generate me a quiz on ${topic}`)
                          navigate('/')
                        }}
                        className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Brain size={20} className="mr-2" />
                        Take New Quiz
                      </button>
                    </div>
                  </div>
                ) : questions.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
                        <span className="text-gray-700 dark:text-gray-300">
                          Progress: {Object.keys(answers).length}/{questions.length} answered
                        </span>
                        <div className="w-32 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 mb-8">
                      {questions.map((question, index) => (
                        <div key={question.id}>
                          <div className="flex items-center mb-3">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                              Question {index + 1}
                            </span>
                          </div>
                          <QuizCard
                            question={question}
                            onAnswer={handleAnswer}
                            selectedAnswer={answers[question.id]}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <button
                        onClick={submitQuiz}
                        className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
                        disabled={questions.length === 0}
                      >
                        <Save size={18} className="inline mr-2"/> Submit & Save Quiz
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">No quiz available. Generate a quiz to get started!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {tab === 'take' && showResults && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">
              Review Your Answers
            </h3>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                  <div className="flex items-center mb-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                      Question {index + 1}
                    </span>
                    {answers[question.id] === question.correctAnswer ? (
                      <CheckCircle className="ml-2 text-green-500" size={20} />
                    ) : (
                      <XCircle className="ml-2 text-red-500" size={20} />
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {question.question}
                  </h4>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          optionIndex === question.correctAnswer
                            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                            : optionIndex === answers[question.id] && optionIndex !== question.correctAnswer
                            ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                            : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}