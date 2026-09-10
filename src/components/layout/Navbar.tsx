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
    <header className="w-full bg-[#ffffff] border-b border-[#e5e5e5] sticky top-0 z-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center font-semibold text-sm shrink-0">
            ⏱
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-[#0a0a0a] leading-none tracking-[-0.025em]">Gestão de Ponto</h1>
            <span className="text-[11px] font-normal text-[#737373]">Controle de Jornada</span>
          </div>
        </div>

        {/* Abas Centrais */}
        <nav className="flex items-center p-1 bg-[#f5f5f5] rounded-[18px] border border-[#e5e5e5]">
          <button
            onClick={() => onTabChange('clock')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-[18px] text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'clock'
                ? 'bg-[#0a0a0a] text-[#fafafa]'
                : 'text-[#737373] hover:text-[#0a0a0a]'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Ponto Diário</span>
          </button>

          <button
            onClick={() => onTabChange('monthly')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-[18px] text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-[#0a0a0a] text-[#fafafa]'
                : 'text-[#737373] hover:text-[#0a0a0a]'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Banco de Horas</span>
          </button>
        </nav>

        {/* Ações Direitas: Usuário, Configurações e Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[18px] bg-[#f5f5f5] border border-[#e5e5e5]">
            <UserIcon className="h-3.5 w-3.5 text-[#737373]" />
            <div className="text-left">
              <p className="text-xs font-medium text-[#0a0a0a] leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#737373] leading-tight">{user.timezone}</p>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            title="Configurações de Jornada"
            aria-label="Configurações de Jornada"
            className="p-2 text-[#737373] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] rounded-[18px] transition-colors cursor-pointer border border-transparent hover:border-[#e5e5e5]"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={onLogout}
            title="Sair do sistema"
            aria-label="Sair do sistema"
            className="flex items-center gap-1 text-xs font-medium text-[#737373] hover:text-[#e7000b] hover:bg-red-50 p-2 sm:px-3 rounded-[18px] transition-colors cursor-pointer border border-transparent hover:border-red-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  )
}
