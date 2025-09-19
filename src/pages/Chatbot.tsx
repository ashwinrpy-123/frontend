import React, { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, BookOpen, Brain, Upload, FileText, Image, X } from 'lucide-react'
import { sendChatMessage } from '../lib/api'
import { useTopic } from '../contexts/TopicContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  files?: UploadedFile[]
}

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  preview?: string
}

export function Chatbot() {
  const { topic, setTopic } = useTopic()
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Hi, I am StudyBuddy. Ask me to summarize a topic, generate flashcards, or create a quiz. You can also upload images or PDFs for me to analyze!' }
  ])
  const [input, setInput] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) })

  // Auto-send topic when page loads
  useEffect(() => {
    if (topic && messages.length === 1) {
      // Only send if we have the welcome message and a topic
      handleSend(topic)
    }
  }, [topic])

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/\n\n/g, '</p><p>') // Paragraph breaks
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/^/, '<p>') // Start with paragraph
      .replace(/$/, '</p>') // End with paragraph
  }

  const addAssistant = (text: string) => setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', text }])
  const addUser = (text: string, files?: UploadedFile[]) => setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', text, files }])

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true)
    const newFiles: UploadedFile[] = []
    
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const fileId = crypto.randomUUID()
        const fileUrl = URL.createObjectURL(file)
        
        let preview: string | undefined
        if (file.type.startsWith('image/')) {
          preview = fileUrl
        }
        
        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          url: fileUrl,
          preview
        }
        
        newFiles.push(uploadedFile)
      }
    }
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    setIsUploading(false)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file) {
        URL.revokeObjectURL(file.url)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const simulateFileProcessing = async (files: UploadedFile[]) => {
    // Simulate API call to process files
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const fileTypes = files.map(f => f.type.startsWith('image/') ? 'image' : 'PDF')
    return `I've analyzed your ${fileTypes.join(' and ')} file(s). I can help you understand the content, create summaries, or generate questions based on what I see. What would you like me to do with this material?`
  }

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content && uploadedFiles.length === 0) return
    
    const filesToSend = [...uploadedFiles]
    addUser(content || 'Uploaded files', filesToSend)
    setInput('')
    setUploadedFiles([])
    if (content) setTopic(content)
    try {
      if (filesToSend.length > 0) {
        const response = await simulateFileProcessing(filesToSend)
        addAssistant(response)
        return
      }

      const data = await sendChatMessage(content)
      addAssistant(data.reply)
    } catch (err: any) {
      const message = err?.message || 'Could not reach the AI service.'
      addAssistant(`Error: ${message}`)
      console.error('Chat send error:', err)
    }
  }

  const quick = [
    { label: 'Summarize', icon: Sparkles, text: 'Summarize the topic: ' },
    { label: 'Flashcards', icon: BookOpen, text: 'Generate flashcards for: ' },
    { label: 'Quiz', icon: Brain, text: 'Create a 10-question quiz on: ' },
  ]

  const handleQuickAction = (action: string, text: string) => {
    if (action === 'Quiz') {
      // Navigate to quiz page with the topic
      window.location.href = '/quiz';
    } else if (action === 'Flashcards') {
      // Navigate to flashcards page with the topic
      window.location.href = '/flashcards';
    } else {
      // Handle other actions normally
      handleSend(text);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">StudyBuddy</h1>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="h-[70vh] overflow-y-auto p-8 space-y-6">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                <div className={`max-w-[85%] px-6 py-4 rounded-2xl ${m.role==='user'?'bg-primary text-primary-foreground':'bg-secondary text-secondary-foreground'}`}>
                  {m.role === 'assistant' ? (
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  )}
                  {m.files && m.files.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {m.files.map(file => (
                        <div key={file.id} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
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
            ))}
            <div ref={endRef} />
          </div>
          <div className="border-t border-border p-6">
            {uploadedFiles.length > 0 && (
              <div className="mb-3 p-2 bg-secondary/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Files to upload:</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center gap-2 p-2 bg-background rounded-lg border">
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} className="w-8 h-8 object-cover rounded" />
                      ) : file.type.startsWith('image/') ? (
                        <Image size={16} className="text-blue-500" />
                      ) : (
                        <FileText size={16} className="text-red-500" />
                      )}
                      <span className="text-sm truncate max-w-32">{file.name}</span>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="hover:bg-destructive/10 rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {quick.map(q => (
                <button key={q.label} onClick={() => handleQuickAction(q.label, q.text)} className="text-sm px-4 py-2 rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors flex items-center gap-2">
                  <q.icon size={16} /> {q.label}
                </button>
              ))}
            </div>
            
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
                className="px-4 py-3 rounded-lg border border-border hover:bg-accent/10 transition-colors flex items-center gap-2"
              >
                <Upload size={18} />
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              
              <input 
                value={input} 
                onChange={(e)=>setInput(e.target.value)} 
                placeholder="Type your message..." 
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-base" 
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={()=>handleSend()} 
                disabled={!input.trim() && uploadedFiles.length === 0}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
              >
                <Send size={18} className="group-hover:animate-bounce" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


