import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface TopicContextValue {
  topic: string
  setTopic: (value: string) => void
  clearTopic: () => void
}

const TopicContext = createContext<TopicContextValue | undefined>(undefined)

export function TopicProvider({ children }: { children: React.ReactNode }) {
  const [topic, setTopicState] = useState<string>('')

  useEffect(() => {
    const stored = localStorage.getItem('neolearn_current_topic')
    if (stored) setTopicState(stored)
  }, [])

  useEffect(() => {
    if (topic) localStorage.setItem('neolearn_current_topic', topic)
    else localStorage.removeItem('neolearn_current_topic')
  }, [topic])

  const setTopic = (value: string) => setTopicState(value)
  const clearTopic = () => setTopicState('')

  const value = useMemo<TopicContextValue>(() => ({ topic, setTopic, clearTopic }), [topic])

  return <TopicContext.Provider value={value}>{children}</TopicContext.Provider>
}

export function useTopic() {
  const ctx = useContext(TopicContext)
  if (!ctx) throw new Error('useTopic must be used within TopicProvider')
  return ctx
}



