import React, { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, BookOpen, Brain, Upload, FileText, Image, X } from 'lucide-react'

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
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Hi, I am StudyBuddy. Ask me to summarize a topic, generate flashcards, or create a quiz. You can also upload images or PDFs for me to analyze!' }
  ])
  const [input, setInput] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) })

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
    
    setTimeout(async () => {
      if (filesToSend.length > 0) {
        const response = await simulateFileProcessing(filesToSend)
        addAssistant(response)
      } else if (/flashcard/i.test(content)) {
        addAssistant('Here are 3 example flashcards. You can save from the Flashcards page.')
      } else if (/quiz/i.test(content)) {
        addAssistant('I prepared a 10-question quiz. Go to the Quiz page to take it!')
      } else if (/summar/i.test(content)) {
        addAssistant('Summary generated. You can review key points and then take a quiz or create cards.')
      } else {
        addAssistant('I can summarize topics, generate flashcards, and create quizzes. Try the quick actions below!')
      }
    }, 500)
  }

  const quick = [
    { label: 'Summarize', icon: Sparkles, text: 'Summarize the topic: ' },
    { label: 'Flashcards', icon: BookOpen, text: 'Generate flashcards for: ' },
    { label: 'Quiz', icon: Brain, text: 'Create a 10-question quiz on: ' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">StudyBuddy</h1>
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-xl ${m.role==='user'?'bg-primary text-primary-foreground':'bg-secondary text-secondary-foreground'}`}>
                  {m.text}
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
          <div className="border-t border-border p-3">
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
            
            <div className="flex gap-2 mb-2">
              {quick.map(q => (
                <button key={q.label} onClick={() => handleSend(q.text)} className="text-xs px-3 py-1 rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors flex items-center gap-1">
                  <q.icon size={14} /> {q.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
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
                className="px-3 py-2 rounded-md border border-border hover:bg-accent/10 transition-colors flex items-center gap-2"
              >
                <Upload size={16} />
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              
              <input 
                value={input} 
                onChange={(e)=>setInput(e.target.value)} 
                placeholder="Type your message..." 
                className="flex-1 px-3 py-2 rounded-md border border-border bg-background" 
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={()=>handleSend()} 
                disabled={!input.trim() && uploadedFiles.length === 0}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={16} /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


