import React, { useState } from 'react'
import { Lock, Mail, User as UserIcon, Globe, Loader2, ArrowRight } from 'lucide-react'

interface RegisterFormProps {
  onRegister: (name: string, email: string, pass: string, tz: string) => Promise<void>
  onSwitchToLogin: () => void
  error: string | null
  isLoading: boolean
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onSwitchToLogin,
  error,
  isLoading,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return
    await onRegister(name, email, password, timezone)
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-[#121214] rounded-[24px] card-shadow border border-[#27272a] transition-colors">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[18px] bg-[#1c1c20] border border-[#27272a] text-[#fafafa] mb-3 font-semibold text-lg">
          GP
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#fafafa]">Criar Nova Conta</h2>
        <p className="text-[#a1a1aa] text-sm mt-1">Controle suas horas e jornadas com precisão cirúrgica</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-[18px] bg-[#1c1c20] border border-[#ef4444]/30 text-[#ef4444] text-sm flex items-start gap-2">
          <span className="font-bold">!</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] mb-1.5">
            Nome Completo
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#a1a1aa]" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Lucas Silva"
              className="w-full pl-10 pr-4 py-2.5 rounded-[18px] border border-[#27272a] bg-[#1c1c20] focus:bg-[#27272a] text-[#fafafa] placeholder-[#71717a] text-sm focus:outline-none focus:border-[#fafafa] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#a1a1aa]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-[18px] border border-[#27272a] bg-[#1c1c20] focus:bg-[#27272a] text-[#fafafa] placeholder-[#71717a] text-sm focus:outline-none focus:border-[#fafafa] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] mb-1.5">
            Senha (mínimo 8 caracteres)
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#a1a1aa]" />
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-[18px] border border-[#27272a] bg-[#1c1c20] focus:bg-[#27272a] text-[#fafafa] placeholder-[#71717a] text-sm focus:outline-none focus:border-[#fafafa] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] mb-1.5">
            Fuso Horário
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-[#a1a1aa]" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-[18px] border border-[#27272a] bg-[#1c1c20] focus:bg-[#27272a] text-[#fafafa] text-sm focus:outline-none focus:border-[#fafafa] transition-all cursor-pointer"
            >
              <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
              <option value="America/Manaus">Manaus (GMT-4)</option>
              <option value="America/Belem">Belém (GMT-3)</option>
              <option value="America/Fortaleza">Fortaleza (GMT-3)</option>
              <option value="America/Recife">Recife (GMT-3)</option>
              <option value="America/Cuiaba">Cuiabá (GMT-4)</option>
              <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-[#fafafa] hover:bg-[#e4e4e7] active:bg-[#ffffff] text-[#09090b] rounded-[18px] font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#09090b]" />
              <span>Criando conta...</span>
            </>
          ) : (
            <>
              <span>Concluir Cadastro</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#27272a] text-center">
        <p className="text-sm text-[#a1a1aa]">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#fafafa] font-semibold hover:underline cursor-pointer"
          >
            Fazer login
          </button>
        </p>
      </div>
    </div>
  )
}
