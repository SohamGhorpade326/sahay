'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowRight,
  Fingerprint,
  KeyRound,
  Landmark,
  ShieldCheck,
  Smartphone,
  UserRound,
  FileCheck,
  CheckCircle2,
  Loader2,
  Home,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const authMethods = [
  {
    id: 'aadhaar',
    icon: ShieldCheck,
    label: 'Aadhaar e-KYC',
    desc: 'Verify with your Aadhaar number',
    color: 'text-primary',
    bg: 'bg-primary/8 dark:bg-primary/15',
  },
  {
    id: 'otp',
    icon: Smartphone,
    label: 'Mobile OTP',
    desc: 'Login via SMS verification',
    color: 'text-teal',
    bg: 'bg-teal/8 dark:bg-teal/15',
  },
  {
    id: 'digilocker',
    icon: FileCheck,
    label: 'DigiLocker',
    desc: 'Authenticate with DigiLocker ID',
    color: 'text-emerald',
    bg: 'bg-emerald/8 dark:bg-emerald/15',
  },
  {
    id: 'biometric',
    icon: Fingerprint,
    label: 'Biometric',
    desc: 'Fingerprint or face authentication',
    color: 'text-amber',
    bg: 'bg-amber/8 dark:bg-amber/15',
  },
  {
    id: 'gov-sso',
    icon: Landmark,
    label: 'Government SSO (NIC)',
    desc: 'For government officials',
    color: 'text-lilac',
    bg: 'bg-lilac/8 dark:bg-lilac/15',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authSuccess, setAuthSuccess] = useState(false)

  const handleSelectMethod = (id: string) => {
    setSelected(id)
    setIsAuthenticating(true)
    setTimeout(() => {
      setIsAuthenticating(false)
      setAuthSuccess(true)
      setTimeout(() => {
        router.push('/overview')
      }, 1000)
    }, 1200)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Animated background */}
      <div className="gradient-animated absolute inset-0 opacity-[0.03] dark:opacity-[0.08]" />
      <div className="absolute inset-0 dot-pattern opacity-20 dark:opacity-10" />

      {/* Floating decorative elements */}
      <div className="absolute left-[15%] top-[20%] h-3 w-3 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute right-[20%] top-[30%] h-2 w-2 rounded-full bg-teal/20 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute left-[25%] bottom-[25%] h-2.5 w-2.5 rounded-full bg-lilac/20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute right-[15%] bottom-[35%] h-2 w-2 rounded-full bg-amber/20 animate-float" style={{ animationDelay: '3s' }} />

      {/* Top action buttons */}
      <div className="absolute right-5 top-5 z-10 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shadow-sm"
        >
          <Home size={14} />
          <span>Back to Landing Page</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <ShieldCheck size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight">
            Welcome to <span className="gradient-text">SATHI</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Secure access to victim support & legal assistance
          </p>
        </div>

        {/* Auth Methods Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/5 dark:shadow-black/30">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Choose authentication method
          </p>

          <div className="space-y-2.5">
            {authMethods.map((method) => {
              const isSelected = selected === method.id
              return (
                <button
                  key={method.id}
                  onClick={() => handleSelectMethod(method.id)}
                  disabled={isAuthenticating}
                  className={`group flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-md shadow-primary/10'
                      : 'border-border hover:border-primary/30 hover:bg-secondary/50'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${method.bg} ${method.color} transition-transform group-hover:scale-105`}
                  >
                    <method.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{method.label}</p>
                    <p className="text-[11px] text-muted-foreground">{method.desc}</p>
                  </div>
                  {isSelected && isAuthenticating ? (
                    <Loader2 size={16} className="animate-spin text-primary" />
                  ) : isSelected && authSuccess ? (
                    <CheckCircle2 size={16} className="text-emerald animate-bounce-subtle" />
                  ) : (
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  )}
                </button>
              )
            })}
          </div>

          {authSuccess && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald/10 border border-emerald/20 p-3 text-xs font-bold text-emerald animate-fade-in-up">
              <CheckCircle2 size={16} />
              Authentication successful! Redirecting to System Overview...
            </div>
          )}

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-semibold text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Guest Demo Button */}
          <Link
            href="/overview"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/25"
          >
            <UserRound size={16} />
            Enter Guest Demo Mode
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>

          <p className="mt-4 text-center text-[10px] text-muted-foreground">
            <KeyRound size={10} className="mr-1 inline" />
            This is a prototype. Simulated auth redirects directly to demo.
          </p>
        </div>

        {/* Bottom branding */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-muted-foreground">
            Ministry of Social Justice & Empowerment · Government of India
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground/60">
            SC/ST (Prevention of Atrocities) Act, 1989 · SIH 2026
          </p>
        </div>
      </div>
    </main>
  )
}

