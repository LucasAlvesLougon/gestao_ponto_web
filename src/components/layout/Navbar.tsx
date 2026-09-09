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
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            ⏱️
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-slate-900 leading-none">Gestão de Ponto</h1>
            <span className="text-[11px] font-medium text-slate-400">Controle de Jornada</span>
          </div>
        </div>

        {/* Abas Centrais */}
        <nav className="flex items-center p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => onTabChange('clock')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'clock'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Ponto Diário</span>
          </button>

          <button
            onClick={() => onTabChange('monthly')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Banco de Horas</span>
          </button>
        </nav>

        {/* Ações Direitas: Usuário, Configurações e Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <UserIcon className="h-3.5 w-3.5 text-slate-400" />
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{user.timezone}</p>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            title="Configurações de Jornada"
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={onLogout}
            title="Sair do sistema"
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 sm:px-3 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  )
}
