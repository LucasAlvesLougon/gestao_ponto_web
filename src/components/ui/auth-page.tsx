'use client'

import React, { useState } from 'react'
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { Button } from './button'
import {
  AppleIcon,
  AtSignIcon,
  ChevronLeftIcon,
  Grid2x2PlusIcon,
  LockIcon,
  Loader2,
  X,
  UserCheck,
} from 'lucide-react'
import { Input } from './input'
import { useAuth } from '@/hooks/useAuth'

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '283172265638-2cib86k0v38qmjae78snu5ps1p4sd513.apps.googleusercontent.com'

export interface AuthPageProps {
  onProcessGoogleToken?: (credential: string) => Promise<any>
  onLoginWithGoogle?: (data: { email?: string; name?: string; google_id?: string; idToken?: string; credential?: string }) => Promise<any>
  onLoginWithEmail?: (email: string, password?: string) => Promise<any>
  onSwitchToRegister?: () => void
  error?: string | null
  isLoading?: boolean
  appName?: string
}

function AuthPageContent({
  onLoginWithGoogle,
  onLoginWithEmail,
  onSwitchToRegister,
  error: externalError,
  isLoading: externalLoading,
  appName = 'Gestão de Ponto',
}: AuthPageProps = {}) {
  const auth = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false)
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const error = externalError ?? localError ?? auth.error
  const isLoading = externalLoading ?? auth.isSubmitting

  const lastGoogleEmail = typeof window !== 'undefined' ? (localStorage.getItem('last_google_email') || undefined) : undefined

  const triggerGoogleLogin = useGoogleLogin({
    hint: lastGoogleEmail,
    prompt: lastGoogleEmail ? '' : undefined,
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true)
      setLocalError(null)
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const userInfo = await userInfoRes.json()

        if (userInfo.email) {
          localStorage.setItem('last_google_email', userInfo.email)
          const payload = {
            email: userInfo.email,
            name: userInfo.name || userInfo.email.split('@')[0],
            google_id: userInfo.sub,
          }
          if (onLoginWithGoogle) {
            await onLoginWithGoogle(payload)
          } else {
            await auth.loginWithGoogle(payload)
          }
        } else {
          throw new Error('Não foi possível obter os dados da conta Google.')
        }
      } catch (err: any) {
        setLocalError(err.message || 'Falha ao autenticar com o Google.')
      } finally {
        setIsGoogleLoading(false)
      }
    },
    onError: (errorResponse) => {
      console.warn('Google login cancelado ou erro:', errorResponse)
    },
  })

  const handleGoogleButtonClick = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      triggerGoogleLogin()
    } else {
      setIsGoogleModalOpen(true)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (!email) return

    try {
      if (onLoginWithEmail) {
        await onLoginWithEmail(email, password)
      } else {
        await auth.login(email, password || 'senha1234')
      }
    } catch (err: any) {
      setLocalError(err.message || 'Erro ao realizar login.')
    }
  }

  const handleGoogleLogin = async (selectedEmail: string, selectedName: string) => {
    setIsGoogleLoading(true)
    setLocalError(null)
    try {
      const payload = {
        email: selectedEmail,
        name: selectedName,
        google_id: `google_${Date.now()}`,
      }

      if (onLoginWithGoogle) {
        await onLoginWithGoogle(payload)
      } else {
        await auth.loginWithGoogle(payload)
      }
      setIsGoogleModalOpen(false)
    } catch (err: any) {
      setLocalError(err.message || 'Falha ao autenticar com Google.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-background text-foreground">
      {/* Coluna Esquerda: Branding e Floating Paths */}
      <div className="bg-muted/60 relative hidden h-full flex-col border-r border-border p-10 lg:flex">
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <div className="z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-foreground text-background flex items-center justify-center font-bold text-sm">
            <Grid2x2PlusIcon className="size-5" />
          </div>
          <p className="text-xl font-semibold tracking-tight">{appName}</p>
        </div>
        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl text-foreground/90 font-medium leading-relaxed">
              &ldquo;Esta plataforma otimizou nosso acompanhamento de ponto com precisão cirúrgica,
              relatórios instantâneos e zero atraso.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold text-muted-foreground">
              ~ Lucas Lougon • Gestão & Eficiência
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      {/* Coluna Direita: Formulário de Autenticação */}
      <div className="relative flex min-h-screen flex-col justify-center p-4 sm:p-8">
        <div
          aria-hidden
          className="absolute inset-0 isolate contain-strict -z-10 opacity-60 pointer-events-none"
        >
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.02)_50%,transparent_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.04)_0,transparent_80%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.04)_0,transparent_80%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full" />
        </div>

        <Button
          variant="ghost"
          className="absolute top-7 left-5 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => {
            if (onSwitchToRegister) onSwitchToRegister()
          }}
        >
          <ChevronLeftIcon className="size-4 me-2" />
          Home
        </Button>

        <div className="mx-auto w-full max-w-sm space-y-4">
          <div className="flex items-center gap-2 lg:hidden mb-2">
            <div className="w-8 h-8 rounded-[8px] bg-foreground text-background flex items-center justify-center font-bold text-sm">
              <Grid2x2PlusIcon className="size-5" />
            </div>
            <p className="text-xl font-semibold">{appName}</p>
          </div>

          <div className="flex flex-col space-y-1">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Sign In or Join Now!
            </h1>
            <p className="text-muted-foreground text-sm">
              Acesse sua conta ou faça login com Google para gerenciar seu ponto.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Botões de Login Social com Funcionalidade Google */}
          <div className="space-y-2">
            <Button
              type="button"
              size="lg"
              className="w-full cursor-pointer transition-all active:scale-[0.98] border border-border bg-card hover:bg-accent text-foreground hover:text-foreground shadow-xs flex items-center justify-center gap-2"
              onClick={handleGoogleButtonClick}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <GoogleIcon className="size-4" />
              )}
              <span>{isGoogleLoading ? 'Entrando com Google...' : 'Continue with Google'}</span>
            </Button>

            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full cursor-pointer transition-all active:scale-[0.98] border-border bg-card hover:bg-accent text-foreground shadow-xs flex items-center justify-center gap-2"
              onClick={() => handleGoogleLogin('apple.user@icloud.com', 'Apple User')}
              disabled={isLoading || isGoogleLoading}
            >
              <AppleIcon className="size-4" />
              <span>Continue with Apple</span>
            </Button>

            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full cursor-pointer transition-all active:scale-[0.98] border-border bg-card hover:bg-accent text-foreground shadow-xs flex items-center justify-center gap-2"
              onClick={() => handleGoogleLogin('github.dev@users.noreply.github.com', 'GitHub Dev')}
              disabled={isLoading || isGoogleLoading}
            >
              <GithubIcon className="size-4" />
              <span>Continue with GitHub</span>
            </Button>
          </div>

          <AuthSeparator />

          {/* Formulário com Email & Senha */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <p className="text-muted-foreground text-start text-xs">
              Informe seu e-mail e senha para entrar no sistema
            </p>
            <div className="relative">
              <Input
                placeholder="seu.email@exemplo.com"
                className="peer ps-9 bg-card border-border"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <AtSignIcon className="size-4" aria-hidden="true" />
              </div>
            </div>

            <div className="relative">
              <Input
                placeholder="Sua senha"
                className="peer ps-9 bg-card border-border"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <LockIcon className="size-4" aria-hidden="true" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer active:scale-[0.98] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Entrando...</span>
                </span>
              ) : (
                <span>Entrar no Sistema</span>
              )}
            </Button>
          </form>

          <div className="text-[11px] text-muted-foreground bg-muted/60 p-2.5 rounded-lg border border-border text-center flex flex-col gap-1">
            <div>
              <span className="font-semibold text-foreground">Ambiente de Testes:</span> admin@ponto.com • senha1234
            </div>
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
            >
              Simular contas Google / Demo
            </button>
          </div>

          <p className="text-muted-foreground mt-6 text-center text-xs">
            Ao continuar, você concorda com os nossos{' '}
            <a href="#" className="hover:text-primary underline underline-offset-4">
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a href="#" className="hover:text-primary underline underline-offset-4">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>

      {/* MODAL DE LOGIN COM GOOGLE */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-sm rounded-[24px] border border-border card-shadow p-6 relative">
            <button
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-accent transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <GoogleIcon className="size-6" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Fazer login com o Google</h3>
                <p className="text-xs text-muted-foreground">Escolha uma conta para continuar em {appName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleLogin('lucas@gmail.com', 'Lucas Lougon')}
                disabled={isGoogleLoading}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-accent/60 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-semibold flex items-center justify-center text-xs">
                  L
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">Lucas Lougon</div>
                  <div className="text-[11px] text-muted-foreground truncate">lucas@gmail.com</div>
                </div>
                <UserCheck className="size-4 text-muted-foreground group-hover:text-foreground" />
              </button>

              <button
                type="button"
                onClick={() => handleGoogleLogin('admin@ponto.com', 'Administrador')}
                disabled={isGoogleLoading}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-accent/60 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 font-semibold flex items-center justify-center text-xs">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">Administrador</div>
                  <div className="text-[11px] text-muted-foreground truncate">admin@ponto.com</div>
                </div>
                <UserCheck className="size-4 text-muted-foreground group-hover:text-foreground" />
              </button>
            </div>

            <div className="my-4 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-2">Ou use outro e-mail Google:</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="outro@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={!customGoogleEmail || isGoogleLoading}
                  onClick={() =>
                    handleGoogleLogin(
                      customGoogleEmail,
                      customGoogleEmail.split('@')[0]
                    )
                  }
                  className="cursor-pointer"
                >
                  Entrar
                </Button>
              </div>
            </div>

            {isGoogleLoading && (
              <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Conectando com o Google...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.06 + path.id * 0.015}
          />
        ))}
      </svg>
    </div>
  )
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <g>
      <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
    </g>
  </svg>
)

const GithubIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const AuthSeparator = () => {
  return (
    <div className="flex w-full items-center justify-center my-2">
      <div className="bg-border h-px w-full" />
      <span className="text-muted-foreground px-2 text-xs font-mono">OR</span>
      <div className="bg-border h-px w-full" />
    </div>
  )
}

export function AuthPage(props: AuthPageProps = {}) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthPageContent {...props} />
    </GoogleOAuthProvider>
  )
}

