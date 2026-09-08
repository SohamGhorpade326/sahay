'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BellRing,
  BookOpen,
  Brain,
  Building,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Gauge,
  Gavel,
  Headphones,
  Heart,
  HeartHandshake,
  Landmark,
  Layers,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageCircle,
  MessageSquare,
  Mic,
  Phone,
  PhoneCall,
  Play,
  Radio,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserRound,
  Users,
  Video,
  Volume2,
  Zap,
} from 'lucide-react'
import { Card, PageFooter, SahayShell, SectionLabel } from '@/components/sahay-shell'
import AnimatedCounter from '@/components/animated-counter'

const aiSafetySuggestions = [
  {
    category: 'Physical Security & Threat Protection',
    badge: 'High Priority',
    badgeColor: 'bg-rose/15 text-rose border-rose/30',
    icon: ShieldAlert,
    iconColor: 'text-rose',
    iconBg: 'bg-rose/10',
    suggestion: 'Automated threat alert dispatched to Hathras PCR Police Unit. Recommend activating 24/7 Geofenced Safe Check-in protocol for victim residence.',
    action: 'Activate Police Escort Protocol (Sec 15A(10))',
  },
  {
    category: 'Mental Health & Trauma Stabilization',
    badge: 'Urgent Psychological Care',
    badgeColor: 'bg-coral/15 text-coral border-coral/30',
    icon: Brain,
    iconColor: 'text-coral',
    iconBg: 'bg-coral/10',
    suggestion: 'Acoustic pitch jitter (+18) indicates high anxiety. Recommend 4-7-8 breathing exercises, trauma grounding, and assigned Tele-MANAS psychologist call.',
    action: 'Launch 4-7-8 Guided Breathing & Audio Grounding',
  },
  {
    category: 'Legal Safeguard & Compensation Claim',
    badge: 'Statutory Action Required',
    badgeColor: 'bg-amber/15 text-amber border-amber/30',
    icon: Scale,
    iconColor: 'text-amber',
    iconBg: 'bg-amber/10',
    suggestion: 'Case inquiry delay (+9) detected. File Witness Protection application under Section 15A(10) before Special Court Judge and claim Rule 12(4) 50% initial relief.',
    action: 'Submit Rule 12(4) Emergency Relief Claim',
  },
]

const assignedCounselors = [
  {
    name: 'Dr. Sunita Deshmukh',
    title: 'Senior Clinical Psychologist · Tele-MANAS (NIMHANS)',
    experience: '14 Years Experience in SC/ST Trauma De-escalation',
    languages: 'Marathi, Hindi, English',
    matchScore: '98% AI Match',
    availability: 'Online & Available for Instant Call',
    phone: '+91 98201 14566',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Dr. Arisudan Singh',
    title: 'Crisis Counseling Specialist · District Mental Health Unit',
    experience: '11 Years Experience in Atrocity Crisis Intervention',
    languages: 'Hindi, English',
    matchScore: '94% AI Match',
    availability: 'Available on Chat & Scheduled Video Meet',
    phone: '+91 94150 99201',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  },
]

const videoActivities = [
  {
    id: 1,
    title: 'Trauma Grounding & 4-7-8 Anxiety Relief',
    author: 'NIMHANS Tele-MANAS Psychological Unit',
    duration: '5:30 Min',
    category: 'Mental Stabilization',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    views: '12,480 Victims Guided',
    desc: 'Guided breathing and sensory grounding exercises designed specifically for survivors experiencing acute anxiety and pitch jitter.',
  },
  {
    id: 2,
    title: 'Asserting Statutory Rights under SC/ST Act',
    author: 'National Legal Services Authority (NALSA)',
    duration: '8:15 Min',
    category: 'Legal Empowerment',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    views: '18,920 Views',
    desc: 'Plain-language guide explaining victim entitlements: free legal aid counsel, FIR rights, witness protection, and Rule 12(4) compensation.',
  },
  {
    id: 3,
    title: 'Coping with Case Delays & Trial Resilience',
    author: 'Apex Human Rights & Counseling Cell',
    duration: '6:45 Min',
    category: 'Emotional Resilience',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    views: '9,340 Views',
    desc: 'Practical strategies for maintaining mental well-being and emotional strength during extended judicial proceedings.',
  },
  {
    id: 4,
    title: 'Witness Protection & Police Escort Guidelines',
    author: 'Bureau of Police Research & Development (BPRD)',
    duration: '4:20 Min',
    category: 'Physical Safety',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    views: '15,100 Views',
    desc: 'Step-by-step walkthrough of Section 15A(10) witness protection rights, safe house relocation, and police escort applications.',
  },
]

const dispatchActions = [
  { id: 'police', label: 'Dispatch Police PCR Van', sub: 'Hathras SHO Command', icon: ShieldAlert, color: 'text-rose', bg: 'bg-rose/10' },
  { id: 'dm', label: 'Notify District Magistrate (DM)', sub: 'Rule 12(4) Relief Disbursement', icon: Landmark, color: 'text-amber', bg: 'bg-amber/10' },
  { id: 'nalsa', label: 'Assign NALSA/DLSA Advocate', sub: 'Free Legal Representation', icon: Scale, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'telemanas', label: 'Trigger Tele-MANAS Unit', sub: '24/7 Crisis Psychologist Call', icon: Headphones, color: 'text-teal', bg: 'bg-teal/10' },
]

export default function CommandCentre() {
  const [dispatchedItems, setDispatchedItems] = useState<string[]>(['nalsa'])
  const [activeVideoModal, setActiveVideoModal] = useState<typeof videoActivities[0] | null>(null)
  const [activeCallModal, setActiveCallModal] = useState<typeof assignedCounselors[0] | null>(null)

  const toggleDispatch = (id: string) => {
    setDispatchedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <SahayShell>
      {/* ── Page Header Banner ── */}
      <div className="mb-8 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-lilac/10 p-6 lg:p-8 shadow-xl animate-fade-in-up">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <SectionLabel>Feature 05 · Command & Multi-Agency AI Intervention</SectionLabel>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Turn distress signals into <span className="gradient-text">automated action.</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed sm:text-base max-w-2xl">
              Centralized AI triage synthesizing data from all 4 channels (WhatsApp, SMS, App, IVRS 14566) and Dynamic Distress Score (DDS) to generate instant victim safety plans, assign psychologists, and trigger inter-agency dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs font-bold text-foreground hover:border-primary/40 transition-all shadow-sm">
              <FileText size={15} />
              <span>Export Case Report PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Active Case Context Bar ── */}
      <Card className="mb-8 p-5 border-coral/30 bg-gradient-to-r from-coral/5 via-card to-primary/5 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/15 text-coral font-black text-lg shadow-md">
              76
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose/15 text-rose border border-rose/30 px-2.5 py-0.5 text-[10px] font-extrabold">
                  CRITICAL RISK TRIAGE TRIGGERED
                </span>
                <span className="text-[10px] text-muted-foreground">• Case #MH-2026-0814</span>
              </div>
              <h2 className="mt-1 text-lg font-extrabold">Ananya · District Hathras (UP)</h2>
              <p className="text-xs text-muted-foreground">
                Data Fusion Ingested from: <strong className="text-foreground">WhatsApp Voice Stream + IVRS 14566 Call Recorder</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-coral bg-card border border-coral/20 px-3.5 py-2.5 rounded-xl">
            <AlertTriangle size={16} className="animate-bounce-subtle" />
            <span>AI Signal: Pitch Jitter (+18), Legal Delay (+9), 7-Day Non-Response (+7)</span>
          </div>
        </div>
      </Card>

      {/* ── SECTION 1: AI Safety & Health Recommendations ── */}
      <div className="mb-10">
        <SectionLabel>Section 1 · AI Safety & Health Recommendations</SectionLabel>
        <h2 className="text-2xl font-black mb-4">Tailored AI Guidance & Action Plan</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {aiSafetySuggestions.map((item) => (
            <Card key={item.category} hover className="p-6 flex flex-col justify-between border-primary/20">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.iconBg} ${item.iconColor}`}>
                    <item.icon size={22} />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold">{item.category}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.suggestion}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <button className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${item.iconBg} ${item.iconColor} hover:scale-[1.01]`}>
                  <Zap size={14} />
                  <span>{item.action}</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: AI-Assigned Senior Counselor Panel (Call / Chat) ── */}
      <div className="mb-10">
        <SectionLabel>Section 2 · AI Counselor Assignment</SectionLabel>
        <h2 className="text-2xl font-black mb-4">Assigned Senior Psychologists (Call or Chat)</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {assignedCounselors.map((c) => (
            <Card key={c.name} hover className="p-6 border-teal/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={c.photo}
                    alt={c.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-primary/20 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald/15 text-emerald border border-emerald/30 px-2.5 py-0.5 text-[10px] font-extrabold">
                        {c.matchScore}
                      </span>
                      <span className="text-[10px] text-emerald font-bold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
                        {c.availability}
                      </span>
                    </div>
                    <h3 className="mt-1 text-lg font-extrabold">{c.name}</h3>
                    <p className="text-xs font-bold text-primary">{c.title}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {c.experience} • Languages: <strong>{c.languages}</strong>
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <button
                  onClick={() => setActiveCallModal(c)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:scale-[1.01] transition-all"
                >
                  <PhoneCall size={14} />
                  <span>Start Live Voice Call</span>
                </button>
                <button
                  onClick={() => setActiveCallModal(c)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 py-2.5 text-xs font-bold text-foreground hover:bg-secondary transition-all"
                >
                  <MessageSquare size={14} />
                  <span>Open Encrypted Chat</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── SECTION 3: AI-Recommended Curated Activity Video Library (WITH REAL PHOTOS) ── */}
      <div className="mb-10">
        <SectionLabel>Section 3 · Curated Psycho-Education & Activities</SectionLabel>
        <h2 className="text-2xl font-black mb-4">AI-Recommended Wellness & Guidance Videos</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videoActivities.map((v) => (
            <Card key={v.id} hover className="overflow-hidden flex flex-col justify-between border-border/80 group">
              <div>
                {/* Video Real Photo Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={v.imageUrl}
                    alt={v.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white border border-white/20">
                      {v.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-black/60 text-white px-2 py-0.5 rounded border border-white/20">
                      {v.duration}
                    </span>
                  </div>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button
                      onClick={() => setActiveVideoModal(v)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-white shadow-2xl group-hover:scale-115 group-hover:bg-primary transition-all duration-300 ring-4 ring-white/20"
                    >
                      <Play size={20} className="ml-0.5" />
                    </button>
                  </div>

                  {/* Views Count */}
                  <div className="absolute bottom-2 left-3 z-10">
                    <p className="text-[10px] font-bold text-white/90 drop-shadow">{v.views}</p>
                  </div>
                </div>

                {/* Video Info Content */}
                <div className="p-4">
                  <h3 className="text-sm font-extrabold group-hover:text-primary transition-colors leading-snug">
                    {v.title}
                  </h3>
                  <p className="mt-1 text-[10px] font-bold text-muted-foreground">{v.author}</p>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => setActiveVideoModal(v)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 py-2.5 text-xs font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                >
                  <Play size={13} />
                  <span>Watch Activity Video</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: 1-Click Multi-Agency Automated Dispatch Console (Jury Showstopper) ── */}
      <Card className="mb-10 p-6 lg:p-8 border-primary/30 shadow-2xl bg-gradient-to-br from-primary/5 via-card to-background">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4 mb-6">
          <div>
            <SectionLabel>Section 4 · Jury Showstopper</SectionLabel>
            <h2 className="text-xl font-extrabold lg:text-2xl">1-Click Multi-Agency Automated Dispatch Console</h2>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-2">
            <span className="text-xs font-extrabold text-primary">
              Dispatch Completion: {Math.round((dispatchedItems.length / dispatchActions.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000"
            style={{ width: `${(dispatchedItems.length / dispatchActions.length) * 100}%` }}
          />
        </div>

        {/* Dispatch Action Buttons */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dispatchActions.map((act) => {
            const isDispatched = dispatchedItems.includes(act.id)
            return (
              <div
                key={act.id}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  isDispatched ? 'border-emerald/40 bg-emerald/5' : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${act.bg} ${act.color}`}>
                      <act.icon size={20} />
                    </div>
                    {isDispatched && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald bg-emerald/15 px-2 py-0.5 rounded-full border border-emerald/30">
                        <Check size={12} /> Dispatched
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold">{act.label}</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">{act.sub}</p>
                </div>

                <button
                  onClick={() => toggleDispatch(act.id)}
                  className={`mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    isDispatched
                      ? 'bg-emerald text-white shadow-md'
                      : 'bg-primary text-primary-foreground shadow-md hover:scale-[1.01]'
                  }`}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Action Logged</span>
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      <span>Trigger Dispatch</span>
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </Card>

      {/* ── SECTION 5: Real-time System Event Audit Ticker ── */}
      <Card className="p-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
          <div>
            <SectionLabel>Section 5 · Real-Time System Feed</SectionLabel>
            <h2 className="text-lg font-extrabold">Multi-Agency Dispatch Audit Log</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald">
            <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
            Live National Feed
          </div>
        </div>

        <div className="space-y-3">
          {[
            { time: '22:42:10', msg: 'Police PCR Unit Hathras acknowledged dispatch ticket #PCR-9921', status: 'Dispatched', color: 'text-emerald' },
            { time: '22:40:05', msg: 'Tele-MANAS Psychologist Dr. Sunita Deshmukh assigned to Case #MH-2026-0814', status: 'Assigned', color: 'text-teal' },
            { time: '22:38:15', msg: 'DDS Score calculated at 76 (High Risk) from WhatsApp ASR voice stream', status: 'Triage High', color: 'text-rose' },
            { time: '22:35:00', msg: 'NALSA DLSA Advocate Advocates Panel notified for Section 15A support', status: 'Notified', color: 'text-amber' },
          ].map((log, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-xl border border-border/60 p-3 text-xs bg-secondary/20">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <span className="font-mono text-muted-foreground text-[11px]">{log.time}</span>
                {log.msg}
              </span>
              <span className={`font-bold text-[10px] px-2.5 py-0.5 rounded-md bg-card border border-border ${log.color}`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Video Player Modal ── */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4 bg-secondary/50">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <Play size={16} className="text-primary" />
                {activeVideoModal.title}
              </h3>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="rounded-full bg-secondary p-1.5 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Video Player Stream Frame */}
            <div className="relative h-80 w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
              <img
                src={activeVideoModal.imageUrl}
                alt={activeVideoModal.title}
                className="h-full w-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl animate-pulse mb-3">
                  <Play size={32} className="ml-1" />
                </div>
                <p className="text-base font-black">{activeVideoModal.title}</p>
                <p className="text-xs text-slate-300 mt-1 max-w-md">{activeVideoModal.desc}</p>
                <span className="mt-4 rounded-full bg-primary/30 text-primary-foreground border border-primary/40 px-3 py-1 text-[11px] font-bold">
                  Streaming Live: {activeVideoModal.author} ({activeVideoModal.duration})
                </span>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between text-xs text-muted-foreground bg-card">
              <span>{activeVideoModal.category}</span>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Counselor Call / Chat Modal ── */}
      {activeCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <PhoneCall size={16} className="text-primary" />
                Connecting to Counselor
              </h3>
              <button
                onClick={() => setActiveCallModal(null)}
                className="rounded-full bg-secondary p-1.5 text-muted-foreground hover:text-foreground text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-4">
              <img
                src={activeCallModal.photo}
                alt={activeCallModal.name}
                className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-primary/30 shadow-xl mb-3"
              />
              <h4 className="text-lg font-black">{activeCallModal.name}</h4>
              <p className="text-xs font-bold text-primary mt-0.5">{activeCallModal.title}</p>
              <p className="text-[11px] text-muted-foreground mt-2">{activeCallModal.phone}</p>

              <div className="mt-4 rounded-xl bg-emerald/10 border border-emerald/20 p-3 text-xs font-bold text-emerald">
                ✓ Line Connected · Encrypted Call Session Active
              </div>
            </div>

            <button
              onClick={() => setActiveCallModal(null)}
              className="mt-4 w-full rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-md hover:bg-rose-700 transition-colors"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      <PageFooter />
    </SahayShell>
  )
}
