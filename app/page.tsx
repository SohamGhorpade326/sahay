'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Database,
  FileCheck,
  Gauge,
  Globe,
  Headphones,
  HeartHandshake,
  KeyRound,
  Landmark,
  Layers,
  LayoutDashboard,
  Lock,
  LogIn,
  MessageSquare,
  Mic,
  Phone,
  Radio,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
  Users,
  Zap,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import AnimatedCounter from '@/components/animated-counter'

// ── Sponsor & Partner Companies with Custom Brand Logos & Vibrant Hover Styles ──
const sponsorCompanies = [
  {
    name: 'Ministry of Social Justice & Empowerment',
    shortName: 'MoSJE, Govt. of India',
    role: 'Nodal Apex Ministry',
    accentColor: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'group-hover:border-amber-500/50',
    glowColor: 'group-hover:shadow-[0_12px_35px_rgba(245,158,11,0.25)]',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" fillOpacity="0.15" />
        <path d="M12 6v12M8 10h8M9 14h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Digital India Initiative',
    shortName: 'Digital India',
    role: 'Digital Infra Partner',
    accentColor: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'group-hover:border-cyan-500/50',
    glowColor: 'group-hover:shadow-[0_12px_35px_rgba(6,182,212,0.25)]',
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-500/10',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 3a9 9 0 0 1 9 9M12 7a5 5 0 0 1 5 5M12 11a1 1 0 0 1 1 1" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'National Informatics Centre',
    shortName: 'NIC India',
    role: 'Government Cloud & SSO',
    accentColor: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'group-hover:border-emerald-500/50',
    glowColor: 'group-hover:shadow-[0_12px_35px_rgba(16,185,129,0.25)]',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" fillOpacity="0.1" />
        <path d="M7 8h10M7 12h7M7 16h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'National Legal Services Authority',
    shortName: 'NALSA',
    role: 'Statutory Legal Relief',
    accentColor: 'from-purple-500/20 to-indigo-500/20',
    borderColor: 'group-hover:border-purple-500/50',
    glowColor: 'group-hover:shadow-[0_12px_35px_rgba(168,85,247,0.25)]',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 3v18M5 8l7-5 7 5M3 13l4 6h-8l4-6zm14 0l4 6h-8l4-6z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Tele-MANAS (NIMHANS)',
    shortName: 'Tele-MANAS',
    role: 'Apex Mental Health Network',
    accentColor: 'from-rose-500/20 to-pink-500/20',
    borderColor: 'group-hover:border-rose-500/50',
    glowColor: 'group-hover:shadow-[0_12px_35px_rgba(244,63,94,0.25)]',
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-500/10',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44L2.04 14.5A2.5 2.5 0 0 1 4.5 12H7V4.5A2.5 2.5 0 0 1 9.5 2z" fill="currentColor" fillOpacity="0.15" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44l5-5.44A2.5 2.5 0 0 0 19.5 12H17V4.5A2.5 2.5 0 0 0 14.5 2z" />
      </svg>
    ),
  },
  {
    name: 'National Human Rights Commission',
    shortName: 'NHRC India',
    role: 'Rights Protection Oversight',
    accentColor: 'from-blue-600/20 to-indigo-600/20',
    borderColor: 'group-hover:border-blue-600/50',
    glowColor: 'group-hover:shadow-[0_12px_35px_rgba(37,99,235,0.25)]',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-600/10',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.15" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'NITI Aayog (DPI)',
    shortName: 'NITI Aayog',
    role: 'Policy & Public Infrastructure',
    accentColor: 'from-violet-500/20 to-purple-600/20',
    borderColor: 'group-hover:border-violet-500/50',
    glowColor: 'group-hover:shadow-[0_12px_35px_rgba(139,92,246,0.25)]',
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-500/10',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'C-DAC India',
    shortName: 'C-DAC',
    role: 'AI & Speech Technologies',
    accentColor: 'from-teal-500/20 to-emerald-600/20',
    borderColor: 'group-hover:border-teal-500/50',
    glowColor: 'group-hover:shadow-[0_12px_35px_rgba(20,184,166,0.25)]',
    iconColor: 'text-teal-500',
    iconBg: 'bg-teal-500/10',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" fillOpacity="0.1" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" strokeLinecap="round" />
      </svg>
    ),
  },
]

const featuresList = [
  {
    id: 'victim-support',
    title: 'Sahay',
    tag: 'Feature 01',
    desc: 'Conversational voice and chat agent supporting 22 official Indian languages across IVRS 14566, WhatsApp, and Web.',
    icon: Headphones,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    id: 'distress-score',
    title: 'Aashwas',
    tag: 'Feature 02',
    desc: 'Multi-modal risk engine combining voice stress, sentiment, engagement decay, and court delays with SHAP explainability.',
    icon: Gauge,
    color: 'text-coral',
    bg: 'bg-coral/10',
  },
  {
    id: 'safe-check',
    title: 'Raksha',
    tag: 'Feature 03',
    desc: 'Proactive detection of silent trauma and communication withdrawal triggering automated safety protocols.',
    icon: ShieldAlert,
    color: 'text-rose',
    bg: 'bg-rose/10',
  },
  {
    id: 'legal-navigator',
    title: 'Nyaya',
    tag: 'Feature 04',
    desc: 'Guided statutory rights calculator, FIR tracker, and mandatory compensation schedule under the SC/ST Atrocities Act 1989.',
    icon: Scale,
    color: 'text-amber',
    bg: 'bg-amber/10',
  },
  {
    id: 'command-centre',
    title: 'Sankalp',
    tag: 'Feature 05',
    desc: 'Unified district dispatch center for Police, District Magistrates, NALSA legal aid, and emergency responders.',
    icon: LayoutDashboard,
    color: 'text-teal',
    bg: 'bg-teal/10',
  },
]

export default function LandingPage() {
  const [heroGaugeScore, setHeroGaugeScore] = useState(42)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroGaugeScore((prev) => (prev === 42 ? 76 : 42))
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* ── Landing Navigation Bar ── */}
      <header className="sticky top-0 z-50 border-b border-border/60 glass">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3.5 lg:px-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight gradient-text">SATHI</p>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Ministry of Social Justice & Empowerment · GoI
              </p>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">About SATHI</a>
            <a href="#features" className="hover:text-foreground transition-colors">5 Core Features</a>
            <a href="#partners" className="hover:text-foreground transition-colors">Sponsors & Partners</a>
            <a href="#impact" className="hover:text-foreground transition-colors">National Impact</a>
            <Link href="/overview" className="text-primary hover:underline">System Overview</Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary/60 px-3.5 py-2 text-xs font-bold text-foreground hover:border-primary/40 hover:bg-secondary transition-all"
            >
              <LogIn size={14} />
              <span>Log In</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] hover:shadow-primary/30 transition-all"
            >
              <UserPlus size={14} />
              <span>Sign Up / Access</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="gradient-animated absolute inset-0 opacity-[0.04] dark:opacity-[0.09]" />
        <div className="absolute inset-0 dot-pattern opacity-25 dark:opacity-10" />

        <div className="mx-auto max-w-[1440px] px-5 lg:px-10 relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Hero Left Content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-6">
                <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                Ministry of Social Justice & Empowerment · Smart India Hackathon 2026
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                AI-Powered <span className="gradient-text">Mental Health Monitoring</span> & Distress Prediction
              </h1>

              <p className="mt-6 text-base text-muted-foreground sm:text-lg leading-relaxed max-w-2xl">
                Continuous omnichannel psychological support, explainable AI risk scoring, and automated multi-agency crisis intervention for victims under the <strong>SC/ST (Prevention of Atrocities) Act, 1989</strong>.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/25 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/35 transition-all"
                >
                  <LogIn size={18} />
                  <span>Log In to Access Portal</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-secondary/50 px-6 py-4 text-sm font-extrabold text-foreground hover:border-primary hover:bg-secondary transition-all"
                >
                  <UserPlus size={18} className="text-primary" />
                  <span>Register / Sign Up</span>
                </Link>

                <Link
                  href="/overview"
                  className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  <span>Explore System Overview</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-t border-border/60 pt-6">
                <span className="flex items-center gap-2 font-semibold">
                  <ShieldCheck size={16} className="text-emerald" />
                  DPDP Act 2023 Compliant
                </span>
                <span className="flex items-center gap-2 font-semibold">
                  <Lock size={16} className="text-teal" />
                  Zero-Trust Architecture
                </span>
                <span className="flex items-center gap-2 font-semibold">
                  <Phone size={16} className="text-primary" />
                  NHAA 14566 IVRS Ready
                </span>
              </div>
            </div>

            {/* Hero Right Visual Box: Mental Health & Victim Care Showcase */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-background to-primary/10 p-6 lg:p-7 shadow-2xl shadow-primary/15 dark:shadow-black/60 group">
                
                {/* Visual Header / Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-purple-600/20 to-teal-500/20 p-5 mb-5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
                        <HeartHandshake size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Victim Care Hub</p>
                        <h3 className="text-base font-black">Empathetic Mental Support</h3>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald/15 px-3 py-1 text-[11px] font-bold text-emerald border border-emerald/20">
                      <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
                      24/7 Live Support
                    </span>
                  </div>

                  {/* Mental Health Graphic / Illustration Card */}
                  <div className="mt-4 flex items-center justify-center py-4 bg-background/60 backdrop-blur-md rounded-xl border border-border/50">
                    <div className="flex items-center gap-4 text-center px-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary ring-4 ring-primary/10">
                        <Headphones size={28} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-muted-foreground">Voice Stress & Sentiment Analysis</p>
                        <p className="text-sm font-black text-foreground">Continuous Multi-Lingual Support</p>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald font-bold">
                          <CheckCircle2 size={12} />
                          <span>22 Indian Languages Supported</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Live DDS Risk Gauge Widget inside Victim Box */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm mb-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral/10 text-coral">
                        <Gauge size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground">CASE MH-2026-0814</p>
                        <p className="text-xs font-extrabold">Dynamic Distress Score (DDS)</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${heroGaugeScore === 76 ? 'bg-rose/15 text-rose border border-rose/30' : 'bg-amber/15 text-amber border border-amber/30'}`}>
                      {heroGaugeScore === 76 ? 'High Risk (76/100)' : 'Mild Distress (42/100)'}
                    </span>
                  </div>

                  {/* Score Meter Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted-foreground">Distress Index</span>
                      <span className={`font-black font-mono ${heroGaugeScore === 76 ? 'text-rose' : 'text-amber'}`}>
                        {heroGaugeScore} / 100
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${heroGaugeScore === 76 ? 'bg-rose w-[76%]' : 'bg-amber w-[42%]'}`}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center pt-1">
                      SHAP: Voice jitter (+18) · Legal delay (+9) · Missed check-ins (+7)
                    </p>
                  </div>
                </div>

                {/* Floating Action CTA */}
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-extrabold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.01] hover:shadow-xl transition-all"
                >
                  <LogIn size={15} />
                  <span>Log in to Access Full Mental Health Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sponsored & Partner Institutions (WITH VIBRANT LOGOS & HOVER EFFECTS) ── */}
      <section id="partners" className="border-y border-border/60 bg-secondary/30 py-14">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
              <Sparkles size={12} />
              Institutional Ecosystem & Governance
            </span>
            <h2 className="text-2xl font-black sm:text-3xl">Supported & Sponsored by Apex Organizations</h2>
            <p className="mt-2 text-xs text-muted-foreground max-w-xl mx-auto">
              Hover over logos to explore inter-agency governance roles under the MoSJE SC/ST Atrocities Act framework.
            </p>
          </div>

          {/* Responsive 8-Card Logo Grid with Rich Hover Effects */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {sponsorCompanies.map((comp) => (
              <div
                key={comp.name}
                className={`group relative flex flex-col items-center justify-between text-center p-4 rounded-2xl border border-border/70 bg-card transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] ${comp.borderColor} ${comp.glowColor} cursor-pointer shadow-sm`}
              >
                {/* Background Gradient Shift on Hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${comp.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                {/* Top Badge Indicator */}
                <div className="relative z-10 w-full flex justify-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 group-hover:bg-primary group-hover:scale-125 transition-all" />
                </div>

                {/* Custom Brand SVG Logo */}
                <div className="relative z-10 my-3 flex flex-col items-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${comp.iconBg} ${comp.iconColor} ring-1 ring-border group-hover:ring-2 group-hover:ring-primary/40 group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                    {comp.svgIcon}
                  </div>
                  <p className="mt-3 text-xs font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {comp.shortName}
                  </p>
                </div>

                {/* Role Description */}
                <div className="relative z-10 w-full border-t border-border/50 pt-2 mt-2">
                  <p className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                    {comp.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is Sathi? (3 Pillars) ── */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <div className="max-w-3xl text-center mx-auto mb-16">
            <span className="rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary">
              What is Sathi?
            </span>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              An Apex Digital Public Infrastructure for <span className="gradient-text">Victim Distress Monitoring</span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Sathi addresses the critical gap in psychological care, statutory legal assistance, and multi-agency emergency response for Scheduled Castes and Scheduled Tribes under the Atrocities Act framework.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-border bg-card p-8 hover:border-primary/30 hover:shadow-xl transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                <Radio size={28} />
              </div>
              <h3 className="text-xl font-extrabold">Omnichannel Reach</h3>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Connects seamlessly via National Helpline 14566, IVRS, WhatsApp/SMS bot, Mobile Application, and Web Portals with 22 official Indian language processing.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 hover:border-primary/30 hover:shadow-xl transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/10 text-coral mb-6">
                <Brain size={28} />
              </div>
              <h3 className="text-xl font-extrabold">Explainable AI (SHAP)</h3>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Calculates composite Dynamic Distress Scores (0-100) using acoustic voice stress, NLP legal sentiment, behavioral decay, and presents SHAP feature breakdowns.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 hover:border-primary/30 hover:shadow-xl transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 text-teal mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-extrabold">Automated Intervention</h3>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Triggers synchronized multi-agency action matrices connecting Police Authorities, District Magistrates, NALSA Legal Aid, and Tele-MANAS Counsellors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 Core Feature Grid ── */}
      <section id="features" className="py-16 bg-secondary/20 border-t border-border/60">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Core Modules</span>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">The 5 Core Solution Pillars</h2>
            </div>
            <Link
              href="/login"
              className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-extrabold text-primary hover:underline"
            >
              <span>Login to launch interactive features</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((f) => (
              <div key={f.id} className="flex flex-col justify-between rounded-3xl border border-border bg-card p-7 hover:border-primary/30 hover:shadow-xl transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.bg} ${f.color}`}>
                      <f.icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold">{f.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>

                <Link
                  href="/login"
                  className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${f.bg} ${f.color} hover:opacity-90`}
                >
                  <span>Log In to Access</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}

            {/* System Overview Card */}
            <div className="flex flex-col justify-between rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-lilac/10 p-7 shadow-lg">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-extrabold">System Architecture & Overview</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  View the full system command dashboard, multi-agency dispatch matrix, real-time victim triage stats, and district heatmaps.
                </p>
              </div>

              <Link
                href="/overview"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md hover:scale-[1.01] transition-all"
              >
                <span>View System Overview</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── National Impact Stats ── */}
      <section id="impact" className="py-20 border-t border-border/60">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-black text-primary">
                <AnimatedCounter end={22} duration={1200} />+
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Official Languages</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Real-time NLP & voice models</p>
            </div>

            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-black text-coral">
                <AnimatedCounter end={700} duration={1500} />+
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Districts Covered</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Pan-India coverage matrix</p>
            </div>

            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-black text-emerald">
                &lt;<AnimatedCounter end={15} duration={1000} />m
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Agency Dispatch</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Automated multi-agency triage</p>
            </div>

            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-black text-amber">
                <AnimatedCounter end={100} duration={1000} />%
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">DPDP Act Compliant</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Zero-trust encrypted records</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-secondary/30 py-12">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-sm font-black gradient-text">SATHI Platform</p>
                <p className="text-[10px] text-muted-foreground">Ministry of Social Justice & Empowerment, Government of India</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:scale-105 transition-all">
                Access Login Portal
              </Link>
              <Link href="/overview" className="rounded-xl border border-border px-5 py-2.5 text-xs font-bold hover:bg-secondary transition-all">
                System Overview
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 Ministry of Social Justice & Empowerment. Smart India Hackathon 2026 Entry.</p>
            <p>Under SC/ST (Prevention of Atrocities) Act, 1989 Framework</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
