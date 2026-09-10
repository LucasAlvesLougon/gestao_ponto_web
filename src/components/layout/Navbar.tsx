import React from 'react'
import { LogOut, User as UserIcon, Clock, CalendarDays, Settings } from 'lucide-react'
import type { User } from '../../lib/types'

export type TabType = 'clock' | 'monthly'

interface NavbarProps {
  user: User
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onOpenSettings: () => void
  onLogout: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onTabChange,
  onOpenSettings,
  onLogout,
}) => {

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            ⏱️
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-none">Gestão de Ponto</h1>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Controle de Jornada</span>
          </div>
        </div>

        {/* Abas Centrais */}
        <nav className="flex items-center p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <button
            onClick={() => onTabChange('clock')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'clock'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Ponto Diário</span>
          </button>

          <button
            onClick={() => onTabChange('monthly')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Banco de Horas</span>
          </button>
        </nav>

        {/* Ações Direitas: Usuário, Tema, Configurações e Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
            <UserIcon className="h-3.5 w-3.5 text-slate-400" />
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{user.timezone}</p>
            </div>
          </div>

          {/* Configurações e Logout */}

          <button
            onClick={onOpenSettings}
            title="Configurações de Jornada"
            aria-label="Configurações de Jornada"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={onLogout}
            title="Sair do sistema"
            aria-label="Sair do sistema"
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 p-2 sm:px-3 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  )
}
