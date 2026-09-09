import React from 'react'
import type { User } from '../lib/types'

interface DashboardProps {
  user: User
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Olá, {user.name}! 👋</h2>
          <p className="text-sm text-slate-500 mt-1">
            Fuso horário configurado: <span className="font-semibold text-slate-700">{user.timezone}</span>
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Sessão Segura Ativa
        </div>
      </div>
    </div>
  )
}
