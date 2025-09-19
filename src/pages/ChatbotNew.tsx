import React, { useEffect, useRef, useState } from 'react'
import { Send, Plus, Trash2, Edit3, MoreVertical, Upload, FileText, Image, X, MessageSquare } from 'lucide-react'
import { useTopic } from '../contexts/TopicContext'
import { 
  getConversations, 
  getConversation, 
  createConversation, 
  addMessageToConversation, 
  deleteConversation, 
  updateConversationTitle,
  uploadFile,
  type Conversation,
  type Message,
  type UploadedFile
} from '../lib/api'

export function ChatbotNew() {
  const { topic, setTopic } = useTopic()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) })

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [])

  // Auto-send topic when page loads
  useEffect(() => {
    if (topic && conversations.length === 0) {
      handleNewConversation()
    }
  }, [topic])

  const loadConversations = async () => {
    try {
      const data = await getConversations()
      setConversations(data)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const loadConversation = async (id: string) => {
    try {
      const data = await getConversation(id)
      setCurrentConversation(data)
      setMessages(data.messages)
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const handleNewConversation = async () => {
    try {
      const title = topic || 'New Conversation'
      const firstMessage = topic ? {
        role: 'user' as const,
        content: topic,
        timestamp: new Date().toISOString()
      } : undefined

      const conversation = await createConversation(title, firstMessage)
      setCurrentConversation(conversation)
      setMessages(conversation.messages)
      setConversations(prev => [conversation, ...prev])
      
      if (topic) {
        setTopic('') // Clear topic after using it
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const handleSend = async () => {
    const content = input.trim()
    if (!content && uploadedFiles.length === 0) return

    if (!currentConversation) {
      await handleNewConversation()
      return
    }

    const userMessage: Message = {
      role: 'user',
      content: content || 'Uploaded files',
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
      timestamp: new Date().toISOString()
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setUploadedFiles([])

    try {
      // Add message to conversation
      const updatedConversation = await addMessageToConversation(currentConversation._id, userMessage)
      setCurrentConversation(updatedConversation)

      // Simulate AI response (replace with actual AI call)
      const aiResponse: Message = {
        role: 'assistant',
        content: `I received your message: "${content}". This is a simulated response. In a real implementation, this would call the AI service.`,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiResponse])
      await addMessageToConversation(currentConversation._id, aiResponse)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id)
      setConversations(prev => prev.filter(conv => conv._id !== id))
      
      if (currentConversation?._id === id) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  const handleUpdateTitle = async (id: string, title: string) => {
    try {
      const updatedConversation = await updateConversationTitle(id, title)
      setConversations(prev => prev.map(conv => 
        conv._id === id ? updatedConversation : conv
      ))
      if (currentConversation?._id === id) {
        setCurrentConversation(updatedConversation)
      }
      setEditingTitle(null)
    } catch (error) {
      console.error('Failed to update title:', error)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true)
    const newFiles: UploadedFile[] = []
    
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        try {
          const uploadedFile = await uploadFile(file)
          newFiles.push(uploadedFile)
        } catch (error) {
          console.error('Failed to upload file:', error)
        }
      }
    }
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    setIsUploading(false)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileId))
  }

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                currentConversation?._id === conversation._id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => loadConversation(conversation._id)}
            >
              <MessageSquare size={16} className="text-gray-500 dark:text-gray-400" />
              <div className="flex-1 min-w-0">
                {editingTitle === conversation._id ? (
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => {
                      if (newTitle.trim()) {
                        handleUpdateTitle(conversation._id, newTitle.trim())
                      } else {
                        setEditingTitle(null)
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (newTitle.trim()) {
                          handleUpdateTitle(conversation._id, newTitle.trim())
                        }
                      }
                    }}
                    className="w-full bg-transparent border-none outline-none text-sm"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {conversation.title}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(conversation.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingTitle(conversation._id)
                    setNewTitle(conversation.title)
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteConversation(conversation._id)
                  }}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <MoreVertical size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentConversation?.title || 'StudyBuddy'}
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Start a new conversation</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-6 py-4 rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}>
                  {message.role === 'assistant' ? (
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                  
                  {message.files && message.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.files.map((file, fileIndex) => (
                        <div key={fileIndex} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                          {file.type.startsWith('image/') ? (
                            <Image size={16} />
                          ) : (
                            <FileText size={16} />
                          )}
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          {uploadedFiles.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Files to upload:</p>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-600 rounded-lg border">
                    {file.preview ? (
                      <img src={file.preview} alt={file.name} className="w-8 h-8 object-cover rounded" />
                    ) : file.type.startsWith('image/') ? (
                      <Image size={16} className="text-blue-500" />
                    ) : (
                      <FileText size={16} className="text-red-500" />
                    )}
                    <span className="text-sm truncate max-w-32">{file.name}</span>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Upload size={18} />
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type your message..." 
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-base" 
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() && uploadedFiles.length === 0}
              className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
            >
              <Send size={18} className="group-hover:animate-bounce" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

