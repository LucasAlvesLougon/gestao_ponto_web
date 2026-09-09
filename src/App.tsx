import { useState } from 'react'
import { LoginForm } from './components/auth/LoginForm'
import { RegisterForm } from './components/auth/RegisterForm'
import { Navbar } from './components/layout/Navbar'
import { Dashboard } from './pages/Dashboard'
import { useAuth } from './hooks/useAuth'
import { Loader2 } from 'lucide-react'

export default function App() {
  const { user, isAuthenticated, isLoading, error, login, register, logout, clearError } = useAuth()
  const [authView, setAuthView] = useState<'login' | 'register'>('login')

  const handleSwitchAuth = (view: 'login' | 'register') => {
    clearError()
    setAuthView(view)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm font-medium text-slate-500">Carregando Gestão de Ponto...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {isAuthenticated && user ? (
        <>
          <Navbar user={user} onLogout={logout} />
          <main className="flex-1">
            <Dashboard user={user} />
          </main>
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          {authView === 'login' ? (
            <LoginForm
              onLogin={async (email, pass) => {
                await login(email, pass)
              }}
              onSwitchToRegister={() => handleSwitchAuth('register')}
              error={error}
              isLoading={isLoading}
            />
          ) : (
            <RegisterForm
              onRegister={async (name, email, pass, tz) => {
                await register(name, email, pass, tz)
              }}
              onSwitchToLogin={() => handleSwitchAuth('login')}
              error={error}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
    </div>
  )
}
