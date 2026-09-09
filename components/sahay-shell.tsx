'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  BellRing,
  ChevronRight,
  Globe,
  LogIn,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

const links: [string, string][] = [
  ['/overview', 'Insight Atlas'],
  ['/victim-support', 'Sahay'],
  ['/distress-score', 'Aashwas'],
  ['/safe-check', 'Raksha'],
  ['/legal-navigator', 'Nyaya'],
  ['/command-centre', 'Sankalp'],
]

export function SahayShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Build breadcrumb
  const currentLink = links.find(([href]) => href === pathname)
  const breadcrumb = currentLink && pathname !== '/overview' ? currentLink[1] : null

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-border/60 glass">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3 lg:px-10">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
              <ShieldCheck size={22} />
              <div className="absolute inset-0 rounded-xl bg-primary opacity-0 transition-opacity group-hover:animate-pulse-glow group-hover:opacity-100" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight gradient-text">SATHI</p>
              <p className="hidden text-[10px] text-muted-foreground sm:block">
                Ministry of Social Justice & Empowerment
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {links.map(([href, label]) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-[13px] left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              className="relative hidden rounded-xl border border-border bg-secondary/60 p-2.5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground sm:block"
              aria-label="Notifications"
            >
              <BellRing size={15} />
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-coral text-[8px] font-bold text-white">
                3
              </span>
            </button>

            <Link
              href="/"
              className="hidden rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 sm:flex items-center gap-1 transition-all"
              title="Return to Public Landing Page"
            >
              <Globe size={13} />
              <span>Landing</span>
            </Link>

            {/* Direct Login Link Button */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground shadow-sm hover:scale-[1.02]"
              title="Access Login Portal"
            >
              <LogIn size={15} />
              <span>Portal Login</span>
            </Link>

            <Link
              href="/login"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-lilac/30 text-primary ring-2 ring-primary/10 hover:ring-primary transition-all"
              title="User Account"
            >
              <UserRound size={16} />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="mx-auto hidden max-w-[1440px] items-center gap-1.5 px-5 pb-3 text-[11px] text-muted-foreground lg:flex lg:px-10">
            <Link href="/" className="hover:text-foreground">
              SATHI
            </Link>
            <ChevronRight size={10} />
            <span className="font-semibold text-foreground">{breadcrumb}</span>
          </div>
        )}

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <nav className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-1 border-l border-border bg-background p-5 shadow-2xl lg:hidden animate-slide-in-right">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm font-extrabold">Navigation</p>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
                >
                  <X size={18} />
                </button>
              </div>
              {links.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    pathname === href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-auto pt-6 border-t border-border">
                <p className="text-[10px] text-muted-foreground">
                  SATHI · SIH 2026 Prototype
                </p>
              </div>
            </nav>
          </>
        )}
      </header>

      {/* ── Content ── */}
      <div className="mx-auto max-w-[1440px] px-5 py-7 lg:px-10">
        {children}
      </div>
    </main>
  )
}

/* ── Shared Components ── */

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce-subtle" />
      {children}
    </p>
  )
}

export function Card({
  children,
  className = '',
  hover = false,
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card shadow-[0_18px_55px_rgba(60,37,110,0.06)] dark:shadow-[0_18px_55px_rgba(0,0,0,0.25)] ${
        hover ? 'card-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function PageFooter() {
  return (
    <footer className="mt-12 border-t border-border py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold text-foreground">
            SATHI — Listen. Protect. Empower.
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            A compassionate digital public infrastructure initiative
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-teal" />
            DPDP Act Compliant
          </span>
          <span>·</span>
          <span>Not a diagnostic tool</span>
          <span>·</span>
          <span>SIH 2026</span>
        </div>
      </div>
    </footer>
  )
}
