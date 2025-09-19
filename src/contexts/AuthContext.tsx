import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, register as apiRegister } from '../lib/api'

interface UserProfile {
  id: string
  email: string
  educationLevel: 'school' | 'college' | 'work' | null
}

interface AuthContextValue {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  updateEducationLevel: (level: 'school' | 'college' | 'work') => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const stored = localStorage.getItem('neolearn_user')
    if (token && stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        setUser(null)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('neolearn_user')
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('neolearn_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('neolearn_user')
      localStorage.removeItem('auth_token')
    }
  }, [user])

  const login = async (email: string, password: string) => {
    try {
      const { token } = await apiLogin(email, password)
      localStorage.setItem('auth_token', token)
      setUser({ id: email, email, educationLevel: null })
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.')
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      const { token } = await apiRegister(email, password)
      localStorage.setItem('auth_token', token)
      setUser({ id: email, email, educationLevel: null })
    } catch (error) {
      throw new Error('Registration failed. Email may already be in use.')
    }
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


