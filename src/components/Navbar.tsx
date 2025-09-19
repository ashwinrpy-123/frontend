import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, User, LogOut, Menu, X, LogIn } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'StudyBuddy', path: '/chatbot' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Flashcards', path: '/flashcards' },
    { name: 'Progress', path: '/progress' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NeoLearn
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-accent/10 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 rounded-md hover:bg-accent/10 transition-colors"
                >
                  <User size={20} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-lg">
                    <div className="px-4 py-2 text-xs text-muted-foreground">Signed in as</div>
                    <div className="px-4 pb-2 text-sm">{user?.name} {user?.educationLevel ? `· ${user.educationLevel}` : ''}</div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent/10 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <button onClick={() => { logout(); setIsProfileOpen(false) }} className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent/10 transition-colors">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
                <LogIn size={16} /> Login
              </Link>
            )}

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent/10 transition-colors"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}