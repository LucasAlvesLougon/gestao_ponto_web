import { useState } from 'react'
import { LoginForm } from './components/auth/LoginForm'
import { RegisterForm } from './components/auth/RegisterForm'
import { Navbar, type TabType } from './components/layout/Navbar'
import { Dashboard } from './pages/Dashboard'
import { MonthlyDashboard } from './components/dashboard/MonthlyDashboard'
import { SettingsModal } from './components/dashboard/SettingsModal'
import { useAuth } from './hooks/useAuth'
import { Loader2 } from 'lucide-react'

export default function App() {
  const { user, isAuthenticated, isLoading, error, login, register, logout, updateProfile, clearError } = useAuth()
  const [authView, setAuthView] = useState<'login' | 'register'>('login')
  const [activeTab, setActiveTab] = useState<TabType>('clock')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleSwitchAuth = (view: 'login' | 'register') => {
    clearError()
    setAuthView(view)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b]">
        <Loader2 className="h-8 w-8 animate-spin text-[#fafafa] mb-2" />
        <p className="text-sm font-medium text-[#a1a1aa]">Carregando Gestão de Ponto...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col">
      {isAuthenticated && user ? (
        <>
          <Navbar
            user={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onLogout={logout}
          />

          <main className="flex-1">
            {activeTab === 'clock' ? (
              <Dashboard user={user} />
            ) : (
              <div className="py-8 px-4 sm:px-6 max-w-[1280px] mx-auto">
                <MonthlyDashboard />
              </div>
            )}
          </main>

          {isSettingsOpen && (
            <SettingsModal
              user={user}
              onClose={() => setIsSettingsOpen(false)}
              onUpdateUser={updateProfile}
            />
          )}
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
