'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Filter,
  Gauge,
  Headphones,
  Layers,
  LayoutDashboard,
  Lock,
  MessageSquare,
  PieChart,
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
  Zap,
} from 'lucide-react'
import { Card, PageFooter, SahayShell, SectionLabel } from '@/components/sahay-shell'
import AnimatedCounter from '@/components/animated-counter'

// ── Mock Activity Data ──
const weeklyData = [
  { day: 'Mon', total: 1420, critical: 12 },
  { day: 'Tue', total: 1650, critical: 18 },
  { day: 'Wed', total: 1580, critical: 15 },
  { day: 'Thu', total: 1890, critical: 24 },
  { day: 'Fri', total: 2100, critical: 28 },
  { day: 'Sat', total: 1750, critical: 19 },
  { day: 'Sun', total: 1480, critical: 14 },
]

// ── Ultra-Professional SVG Spline Area Chart ──
function WeeklyActivitySplineChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(4) // Default to Friday

  // Chart dimensions & scaling
  const width = 600
  const height = 220
  const paddingX = 40
  const paddingY = 25
  const chartW = width - paddingX * 2
  const chartH = height - paddingY * 2

  const maxTotal = 2400
  const maxCritical = 35

  // Calculate coordinates
  const pointsTotal = weeklyData.map((d, i) => {
    const x = paddingX + (i / (weeklyData.length - 1)) * chartW
    const y = paddingY + chartH - (d.total / maxTotal) * chartH
    return { x, y, data: d }
  })

  const pointsCritical = weeklyData.map((d, i) => {
    const x = paddingX + (i / (weeklyData.length - 1)) * chartW
    const y = paddingY + chartH - (d.critical / maxCritical) * chartH
    return { x, y, data: d }
  })

  // Helper for smooth Bezier curve path
  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`
      const prev = arr[i - 1]
      const cx1 = prev.x + (pt.x - prev.x) / 2
      const cy1 = prev.y
      const cx2 = prev.x + (pt.x - prev.x) / 2
      const cy2 = pt.y
      return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`
    }, '')
  }

  const pathTotal = makeSmoothPath(pointsTotal)
  const pathCritical = makeSmoothPath(pointsCritical)

  const areaTotal = `${pathTotal} L ${pointsTotal[pointsTotal.length - 1].x},${paddingY + chartH} L ${pointsTotal[0].x},${paddingY + chartH} Z`
  const areaCritical = `${pathCritical} L ${pointsCritical[pointsCritical.length - 1].x},${paddingY + chartH} L ${pointsCritical[0].x},${paddingY + chartH} Z`

  // Grid lines
  const gridYValues = [0, 600, 1200, 1800, 2400]

  return (
    <div className="relative w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          {/* Gradient for Total Volume Area */}
          <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
          </linearGradient>

          {/* Gradient for Critical Escalations Area */}
          <linearGradient id="gradientCritical" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--rose)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--rose)" stopOpacity="0.0" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="glowPrimary" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glowRose" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Gridlines */}
        {gridYValues.map((val) => {
          const y = paddingY + chartH - (val / maxTotal) * chartH
          return (
            <g key={val}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="var(--border)"
                strokeDasharray="4,4"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                fill="var(--muted-foreground)"
                fontSize="9"
                textAnchor="end"
                fontWeight="500"
              >
                {val >= 1000 ? `${val / 1000}k` : val}
              </text>
            </g>
          );
        })}

        {/* Area Fills */}
        <path d={areaTotal} fill="url(#gradientTotal)" />
        <path d={areaCritical} fill="url(#gradientCritical)" />

        {/* Smooth Lines */}
        <path
          d={pathTotal}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glowPrimary)"
        />
        <path
          d={pathCritical}
          fill="none"
          stroke="var(--rose)"
          strokeWidth="2.5"
          strokeDasharray="5,3"
          strokeLinecap="round"
          filter="url(#glowRose)"
        />

        {/* Interactive Data Points & Hover Targets */}
        {pointsTotal.map((pt, i) => {
          const critPt = pointsCritical[i]
          const isHovered = hoveredIdx === i

          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)}>
              {/* Vertical Guide Line on Hover */}
              {isHovered && (
                <line
                  x1={pt.x}
                  y1={paddingY}
                  x2={pt.x}
                  y2={paddingY + chartH}
                  stroke="var(--primary)"
                  strokeDasharray="2,2"
                  strokeWidth="1"
                  opacity="0.6"
                />
              )}

              {/* Day Label on X Axis */}
              <text
                x={pt.x}
                y={height - 6}
                fill={isHovered ? 'var(--foreground)' : 'var(--muted-foreground)'}
                fontSize="10"
                fontWeight={isHovered ? 'bold' : '500'}
                textAnchor="middle"
              >
                {pt.data.day}
              </text>

              {/* Total Point Circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : 4}
                fill="var(--background)"
                stroke="var(--primary)"
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-200"
              />

              {/* Critical Point Circle */}
              <circle
                cx={critPt.x}
                cy={critPt.y}
                r={isHovered ? 5 : 3.5}
                fill="var(--background)"
                stroke="var(--rose)"
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-200"
              />
            </g>
          )
        })}
      </svg>

      {/* Floating Active Hover Tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute top-2 right-4 flex items-center gap-4 rounded-xl border border-border bg-card/90 backdrop-blur-md px-3.5 py-2 text-xs shadow-lg animate-fade-in-up"
        >
          <span className="font-extrabold text-foreground">{weeklyData[hoveredIdx].day} Overview</span>
          <span className="flex items-center gap-1.5 font-bold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {weeklyData[hoveredIdx].total.toLocaleString()} Calls
          </span>
          <span className="flex items-center gap-1.5 font-bold text-rose">
            <span className="h-2 w-2 rounded-full bg-rose" />
            {weeklyData[hoveredIdx].critical} Critical Escalations
          </span>
        </div>
      )}
    </div>
  )
}

const channelBreakdown = [
  { name: 'IVRS 14566 Helpline', percent: 42, count: '5,240 calls', color: 'var(--primary)', bg: 'bg-primary/10' },
  { name: 'WhatsApp & SMS Bot', percent: 28, count: '3,494 chats', color: 'var(--teal)', bg: 'bg-teal/10' },
  { name: 'Mobile App Check-in', percent: 18, count: '2,246 updates', color: 'var(--amber)', bg: 'bg-amber/10' },
  { name: 'Web Portal Portal', percent: 12, count: '1,500 filings', color: 'var(--rose)', bg: 'bg-rose/10' },
]

const districtHeat = [
  { district: 'Hathras (UP)', risk: 88, status: 'Critical', cases: 142, sla: '99.1%' },
  { district: 'Muzaffarnagar (UP)', risk: 74, status: 'High', cases: 98, sla: '97.4%' },
  { district: 'Belagavi (KA)', risk: 68, status: 'Moderate', cases: 76, sla: '98.8%' },
  { district: 'Madurai (TN)', risk: 62, status: 'Moderate', cases: 64, sla: '99.5%' },
  { district: 'Gaya (BR)', risk: 54, status: 'Stable', cases: 52, sla: '96.8%' },
]

const recentOfficerLogs = [
  {
    time: '22:14',
    action: 'Assigned Case #MH-2841 to NALSA Legal Aid',
    detail: 'Statutory compensation claim filing initiated under Sec 15A',
    category: 'Legal Aid',
    icon: Scale,
    color: 'text-amber',
    bg: 'bg-amber/10',
  },
  {
    time: '21:45',
    action: 'Triggered Proactive Safe-Check Protocol',
    detail: 'Victim #MH-1092 missed 5 consecutive daily check-ins in Hathras',
    category: 'Silent Distress',
    icon: ShieldAlert,
    color: 'text-rose',
    bg: 'bg-rose/10',
  },
  {
    time: '20:30',
    action: 'Reviewed SHAP Explainability Diagnostic',
    detail: 'Confirmed +18 voice jitter score spike during IVRS 14566 call',
    category: 'DDS Analysis',
    icon: Brain,
    color: 'text-coral',
    bg: 'bg-coral/10',
  },
  {
    time: '19:15',
    action: 'Tele-MANAS Counsellor Referral Dispatched',
    detail: 'Assigned Senior Psychologist for trauma counseling session',
    category: 'Mental Care',
    icon: Headphones,
    color: 'text-teal',
    bg: 'bg-teal/10',
  },
  {
    time: '18:00',
    action: 'System Automated Triage Sync',
    detail: '142 incoming voice calls processed across 22 official Indian languages',
    category: 'AI Pipeline',
    icon: Zap,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
]

const agencySLA = [
  { agency: 'Tele-MANAS Mental Health', avgTime: '3.1m', target: '10m', rate: 99.8, status: 'Optimal' },
  { agency: 'Police Authorities (PCR)', avgTime: '8.4m', target: '15m', rate: 96.4, status: 'Optimal' },
  { agency: 'District Magistrate Office', avgTime: '24m', target: '45m', rate: 96.4, status: 'Normal' },
  { agency: 'NALSA Statutory Legal Aid', avgTime: '42m', target: '120m', rate: 97.5, status: 'Optimal' },
]

export default function OverviewPage() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <SahayShell>
      {/* ── Logged-in User Profile Header Bar ── */}
      <div className="mb-8 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-lilac/10 p-6 lg:p-7 shadow-lg animate-fade-in-up">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <UserCheck size={28} />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald ring-2 ring-background">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  Active Monitoring Session
                </span>
                <span className="text-[10px] text-muted-foreground">• ID: OFF-2026-8814</span>
              </div>
              <h1 className="mt-1 text-2xl font-black tracking-tight lg:text-3xl">
                Welcome, <span className="gradient-text">Dr. Rajesh Varma</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Senior Nodal Triage Officer · Ministry of Social Justice & Empowerment (Zone 4)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">System Status</span>
              <span className="text-xs font-bold text-emerald flex items-center justify-end gap-1">
                <CheckCircle2 size={13} /> All AI Engines Operational
              </span>
            </div>

            <Link
              href="/distress-score"
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:scale-[1.02] transition-all"
            >
              <Gauge size={15} />
              <span>Launch DDS Live Demo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Key Operational Metrics Row ── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Active Victims Monitored</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-primary">
            <AnimatedCounter end={12480} duration={1500} />+
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald font-semibold">
            <ArrowUpRight size={13} />
            <span>+8.4% increase in coverage</span>
          </div>
        </Card>

        <Card className="p-5 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Critical Escalations Today</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose/10 text-rose">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-rose">
            <AnimatedCounter end={14} duration={1000} />
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose animate-ping" />
            <span>Requires immediate dispatch</span>
          </div>
        </Card>

        <Card className="p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Avg Triage Response Time</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal/10 text-teal">
              <Clock size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-teal">
            <AnimatedCounter end={4.2} duration={1200} />m
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald font-semibold">
            <ArrowDownRight size={13} />
            <span>1.8m faster than target SLA</span>
          </div>
        </Card>

        <Card className="p-5 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Multi-Agency Dispatch SLA</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
              <ShieldCheck size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-emerald">
            <AnimatedCounter end={99.4} duration={1500} />%
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald font-semibold">
            <CheckCircle2 size={13} />
            <span>Optimal inter-agency sync</span>
          </div>
        </Card>
      </div>

      {/* ── Main Dashboard Analytics Grid (Charts & Activity) ── */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] mb-8">
        
        {/* ── Left Column: Activity & Incident Volume Spline Chart ── */}
        <div className="space-y-6">
          {/* Chart 1: Ultra-Sleek SVG Spline & Gradient Area Graph */}
          <Card className="p-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4 mb-5">
              <div>
                <SectionLabel>Victim Activity Analytics</SectionLabel>
                <h2 className="text-lg font-extrabold">Weekly Check-in & Escalation Trajectory</h2>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center gap-2">
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${timeRange === '7d' ? 'bg-primary text-white shadow-md' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${timeRange === '30d' ? 'bg-primary text-white shadow-md' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                >
                  30 Days
                </button>
              </div>
            </div>

            {/* SVG Spline Chart Component */}
            <WeeklyActivitySplineChart />

            {/* Chart Legend */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs border-t border-border/60 pt-4">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 font-bold text-foreground">
                  <span className="h-2.5 w-6 rounded-full bg-primary" />
                  Total Check-in Volume (Left Axis)
                </span>
                <span className="flex items-center gap-2 font-bold text-rose">
                  <span className="h-2.5 w-6 rounded-full bg-rose border border-dashed" />
                  Critical Escalations (Right Axis)
                </span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                Peak check-in activity: Friday (2,100 calls)
              </span>
            </div>
          </Card>

          {/* Chart 2: District Risk & Incident Velocity */}
          <Card className="p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
              <div>
                <SectionLabel>Geographic Intelligence</SectionLabel>
                <h2 className="text-lg font-extrabold">Top Priority Districts & Risk Index</h2>
              </div>
              <BarChart3 size={18} className="text-primary" />
            </div>

            <div className="space-y-4">
              {districtHeat.map((d) => (
                <div key={d.district} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-foreground">{d.district}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{d.cases} Active Cases</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'Critical' ? 'bg-rose/15 text-rose border border-rose/30' :
                        d.status === 'High' ? 'bg-coral/15 text-coral border border-coral/30' :
                        d.status === 'Moderate' ? 'bg-amber/15 text-amber border border-amber/30' : 'bg-emerald/15 text-emerald border border-emerald/30'
                      }`}>
                        {d.status} ({d.risk}/100)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        d.status === 'Critical' ? 'bg-rose' :
                        d.status === 'High' ? 'bg-coral' :
                        d.status === 'Moderate' ? 'bg-amber' : 'bg-emerald'
                      }`}
                      style={{ width: `${d.risk}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Right Column: Channel Breakdown & User Activity Audit Log ── */}
        <div className="space-y-6">
          {/* Chart 3: Omnichannel Ingestion Breakdown */}
          <Card className="p-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
              <div>
                <SectionLabel>Channel Dynamics</SectionLabel>
                <h2 className="text-lg font-extrabold">Ingestion Source Breakdown</h2>
              </div>
              <PieChart size={18} className="text-teal" />
            </div>

            <div className="space-y-3.5">
              {channelBreakdown.map((ch) => (
                <div key={ch.name} className="rounded-xl border border-border/60 p-3.5 bg-secondary/30">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-extrabold flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${ch.bg}`} style={{ background: ch.color }} />
                      {ch.name}
                    </span>
                    <span className="font-bold font-mono">{ch.percent}% ({ch.count})</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${ch.percent}%`, background: ch.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* User Activity Audit Log */}
          <Card className="p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
              <div>
                <SectionLabel>Session Audit Trail</SectionLabel>
                <h2 className="text-lg font-extrabold">Your Officer Activity Log</h2>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald">
                <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
                Live Sync
              </div>
            </div>

            <div className="relative space-y-4 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {recentOfficerLogs.map((log, idx) => (
                <div key={idx} className="relative flex items-start gap-3.5 pl-1 group">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${log.bg} ${log.color} ring-4 ring-background relative z-10 shrink-0`}>
                    <log.icon size={14} />
                  </div>
                  <div className="flex-1 rounded-xl border border-border/60 p-3 bg-card hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-foreground">{log.action}</span>
                      <span className="font-mono text-muted-foreground">{log.time}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{log.detail}</p>
                    <span className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[9px] font-extrabold ${log.bg} ${log.color}`}>
                      {log.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Multi-Agency Response SLA Matrix ── */}
      <Card className="mb-10 p-6 lg:p-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4 mb-6">
          <div>
            <SectionLabel>Inter-Agency Operations Matrix</SectionLabel>
            <h2 className="text-xl font-extrabold">Multi-Agency Dispatch SLA Performance</h2>
          </div>
          <span className="mt-2 text-xs font-semibold text-muted-foreground sm:mt-0 flex items-center gap-1.5">
            <Lock size={12} className="text-emerald" />
            MoSJE Escalation Standard Compliant
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agencySLA.map((ag) => (
            <div key={ag.agency} className="rounded-2xl border border-border/70 bg-secondary/30 p-5 hover:border-primary/30 transition-all">
              <p className="text-xs font-extrabold text-foreground">{ag.agency}</p>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <p className="text-2xl font-black text-primary">{ag.avgTime}</p>
                  <p className="text-[10px] text-muted-foreground">Target SLA: {ag.target}</p>
                </div>
                <span className="rounded-full bg-emerald/15 px-2.5 py-1 text-[10px] font-bold text-emerald border border-emerald/20">
                  {ag.rate}% On Time
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-emerald" style={{ width: `${ag.rate}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <PageFooter />
    </SahayShell>
  )
}
