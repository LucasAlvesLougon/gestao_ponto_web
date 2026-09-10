import React from 'react'
import { LogOut, User as UserIcon, Clock, CalendarDays, Settings } from 'lucide-react'
import type { User } from '../../lib/types'
import { formatUserName } from '../../lib/formatters'

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
  const formattedName = formatUserName(user.name)
  const initialLetter = formattedName.charAt(0).toUpperCase()

  return (
    <header className="w-full bg-[#09090b]/80 backdrop-blur-md border-b border-[#27272a] sticky top-0 z-30 transition-colors">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-[#fafafa] text-[#09090b] flex items-center justify-center font-semibold text-sm shrink-0 shadow-xs">
            ⏱
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-semibold text-[#fafafa] leading-none tracking-[-0.025em]">Gestão de Ponto</h1>
            <span className="text-[11px] font-normal text-[#a1a1aa]">Controle de Jornada</span>
          </div>
        </div>

        {/* Abas Centrais */}
        <nav className="flex items-center p-1 bg-[#18181b] rounded-[18px] border border-[#27272a]">
          <button
            onClick={() => onTabChange('clock')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-[18px] text-xs font-medium transition-all active:scale-[0.98] cursor-pointer ${
              activeTab === 'clock'
                ? 'bg-[#fafafa] text-[#09090b] shadow-xs'
                : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]/40'
            }`}
          >
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Ponto Diário</span>
            <span className="sm:hidden">Ponto</span>
          </button>

          <button
            onClick={() => onTabChange('monthly')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-[18px] text-xs font-medium transition-all active:scale-[0.98] cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-[#fafafa] text-[#09090b] shadow-xs'
                : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]/40'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Banco de Horas</span>
            <span className="sm:hidden">Banco</span>
          </button>
        </nav>

        {/* Ações Direitas: Usuário, Configurações e Logout */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Badge de Usuário Lapidada (Sem região e com inicial em caixa alta) */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-[18px] bg-[#18181b] border border-[#27272a]">
            <div className="w-5 h-5 rounded-full bg-[#27272a] border border-[#3f3f46] text-[#fafafa] flex items-center justify-center text-[10px] font-semibold shrink-0 select-none">
              {initialLetter || <UserIcon className="h-3 w-3 text-[#a1a1aa]" />}
            </div>
            <span className="text-xs font-medium text-[#fafafa] tracking-[-0.01em] max-w-[150px] truncate">
              {formattedName}
            </span>
          </div>

          <button
            onClick={onOpenSettings}
            title="Configurações de Jornada"
            aria-label="Configurações de Jornada"
            className="p-2 text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] active:scale-[0.96] rounded-[18px] transition-all cursor-pointer border border-transparent hover:border-[#27272a]"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={onLogout}
            title="Sair do sistema"
            aria-label="Sair do sistema"
            className="flex items-center gap-1.5 text-xs font-medium text-[#a1a1aa] hover:text-[#ef4444] hover:bg-[#ef4444]/10 active:scale-[0.96] p-2 sm:px-3 rounded-[18px] transition-all cursor-pointer border border-transparent hover:border-[#ef4444]/20"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  )
}
