import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface UserProfile {
  id: string
  name: string
  email: string
  educationLevel: 'school' | 'college' | 'work' | null
}

interface AuthContextValue {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, educationLevel: 'school' | 'college' | 'work') => Promise<void>
  logout: () => void
  updateEducationLevel: (level: 'school' | 'college' | 'work') => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('neolearn_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        setUser(null)
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('neolearn_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('neolearn_user')
    }
  }, [user])

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 400))
    const existing = localStorage.getItem('neolearn_user')
    if (existing) {
      setUser(JSON.parse(existing))
      return
    }
    setUser({ id: crypto.randomUUID(), name: email.split('@')[0], email, educationLevel: null })
  }

  const signup = async (name: string, email: string, _password: string, educationLevel: 'school' | 'college' | 'work') => {
    await new Promise((r) => setTimeout(r, 400))
    setUser({ id: crypto.randomUUID(), name, email, educationLevel })
  }

  const logout = () => {
    setUser(null)
  }

  const updateEducationLevel = (level: 'school' | 'college' | 'work') => {
    setUser((prev) => (prev ? { ...prev, educationLevel: level } : prev))
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateEducationLevel,
  }), [user])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


