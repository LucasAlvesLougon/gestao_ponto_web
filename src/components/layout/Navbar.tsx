import React from 'react'
import { LogOut, User as UserIcon } from 'lucide-react'
import type { User } from '../../lib/types'

interface NavbarProps {
  user: User
  onLogout: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            ⏱️
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">Gestão de Ponto</h1>
            <span className="text-[11px] font-medium text-slate-400">Controle de Jornada</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <UserIcon className="h-4 w-4 text-slate-400" />
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{user.timezone}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sair do sistema"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  )
}
