import React, { useState } from 'react'
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react'

interface LoginFormProps {
  onLogin: (email: string, pass: string) => Promise<void>
  onSwitchToRegister: () => void
  error: string | null
  isLoading: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSwitchToRegister,
  error,
  isLoading,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    await onLogin(email, password)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-[#ffffff] rounded-[24px] card-shadow border border-[#e5e5e5] text-[#0a0a0a]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-[10px] bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5] mb-3 font-semibold text-base">
          ⏱
        </div>
        <h2 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Gestão de Ponto</h2>
        <p className="text-[#737373] text-xs mt-1">Acesse sua conta para bater ponto e acompanhar seu saldo</p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-[18px] bg-red-50 border border-red-200 text-[#e7000b] text-xs flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#737373] mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#737373]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-[18px] border border-[#e5e5e5] bg-[#f5f5f5] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] text-sm text-[#0a0a0a] placeholder-[#737373] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-[0.05em] text-[#737373] mb-1.5">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#737373]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-[18px] border border-[#e5e5e5] bg-[#f5f5f5] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] text-sm text-[#0a0a0a] placeholder-[#737373] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-[#0a0a0a] hover:bg-[#171717] text-[#fafafa] rounded-[18px] font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#fafafa]" />
              <span>Entrando...</span>
            </>
          ) : (
            <>
              <span>Entrar no Sistema</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#e5e5e5] text-center space-y-3">
        <p className="text-xs text-[#737373]">
          Ainda não tem conta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#0a0a0a] font-medium underline underline-offset-4 cursor-pointer"
          >
            Cadastre-se gratuitamente
          </button>
        </p>

        <div className="text-[11px] text-[#737373] bg-[#fafafa] p-2.5 rounded-[18px] border border-[#e5e5e5]">
          <span className="font-semibold text-[#0a0a0a]">Ambiente de Testes:</span> admin@ponto.com • senha1234
        </div>
      </div>
    </div>
  )
}
