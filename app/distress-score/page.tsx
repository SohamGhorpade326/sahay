'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Brain,
  Calendar,
  ChevronDown,
  ChevronUp,
  Gauge,
  Mic,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { Card, PageFooter, SahayShell, SectionLabel } from '@/components/sahay-shell'

// ── Circular Gauge Component ──
function DDSGauge({ score, maxScore = 100 }: { score: number; maxScore?: number }) {
  const radius = 90
  const stroke = 12
  const circumference = 2 * Math.PI * radius
  const progress = (score / maxScore) * circumference
  const dashOffset = circumference - progress

  const getColor = (s: number) => {
    if (s < 30) return { stroke: 'var(--emerald)', glow: 'rgba(100, 200, 150, 0.3)', label: 'Low', labelColor: 'text-emerald bg-emerald/10' }
    if (s < 50) return { stroke: 'var(--amber)', glow: 'rgba(200, 170, 80, 0.3)', label: 'Mild', labelColor: 'text-amber bg-amber/10' }
    if (s < 70) return { stroke: 'var(--coral)', glow: 'rgba(220, 120, 80, 0.3)', label: 'Moderate', labelColor: 'text-coral bg-coral/10' }
    return { stroke: 'var(--rose)', glow: 'rgba(220, 80, 80, 0.4)', label: 'High', labelColor: 'text-rose bg-rose/10' }
  }

  const config = getColor(score)

  return (
    <div className="relative flex flex-col items-center">
      <svg width="220" height="220" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={stroke}
          className="opacity-50"
        />
        {/* Progress arc */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke={config.stroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-[1800ms] ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${config.glow})`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-6xl font-black tracking-tight" style={{ color: config.stroke }}>
          {score}
        </p>
        <p className="text-sm text-muted-foreground">/ {maxScore}</p>
        <span className={`mt-2 rounded-full px-3 py-1 text-[11px] font-bold ${config.labelColor}`}>
          {config.label} Risk
        </span>
      </div>
    </div>
  )
}

// ── Mini Sparkline ──
function Sparkline({ data, color = 'var(--primary)' }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 120
  const height = 32
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`)
    .join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── SHAP Feature Bar ──
function SHAPBar({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => setWidth((value / maxValue) * 100), 200)
    return () => clearTimeout(timer)
  }, [value, maxValue])

  return (
    <div className="flex items-center gap-3">
      <p className="w-36 text-xs text-muted-foreground text-right">{label}</p>
      <div className="flex-1 h-5 rounded bg-secondary/50 overflow-hidden">
        <div
          className="h-full rounded transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
      <p className="w-10 text-xs font-bold" style={{ color }}>+{value}</p>
    </div>
  )
}

// ── 72h Prediction Chart ──
function PredictionChart({ data, threshold = 70 }: { data: number[]; threshold?: number }) {
  const max = 100
  const width = 100
  const height = 60
  const thresholdY = height - (threshold / max) * height

  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24" preserveAspectRatio="none">
      {/* Danger zone fill */}
      <rect x="0" y="0" width={width} height={thresholdY} fill="var(--rose)" opacity="0.05" />
      {/* Threshold line */}
      <line
        x1="0" y1={thresholdY} x2={width} y2={thresholdY}
        stroke="var(--rose)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5"
      />
      {/* Area fill */}
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill="var(--coral)" opacity="0.1"
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none" stroke="var(--coral)" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Predicted section (dashed) */}
      {data.length > 4 && (
        <polyline
          points={data.slice(3).map((v, i) => `${((i + 3) / (data.length - 1)) * width},${height - (v / max) * height}`).join(' ')}
          fill="none" stroke="var(--rose)" strokeWidth="1.5"
          strokeDasharray="4,3" strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export default function DistressScore() {
  const [score, setScore] = useState(42)
  const [isEscalating, setIsEscalating] = useState(false)
  const [shapExpanded, setShapExpanded] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const triggerEscalation = () => {
    if (isEscalating) return
    setIsEscalating(true)
    setScore(42)

    let current = 42
    intervalRef.current = setInterval(() => {
      current += 1
      setScore(current)
      if (current >= 76) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsEscalating(false)
      }
    }, 60)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const scoreBreakdown = [
    {
      label: 'Acoustic Score',
      icon: Mic,
      value: score >= 70 ? 28 : score >= 50 ? 20 : 12,
      max: 30,
      detail: score >= 70 ? 'High jitter, reduced pitch variability' : 'Moderate voice stress markers',
      color: 'text-coral',
      bg: 'bg-coral/8',
      sparkData: [8, 10, 9, 14, 16, 20, 24, 28],
    },
    {
      label: 'Textual / NLP Score',
      icon: Brain,
      value: score >= 70 ? 22 : score >= 50 ? 14 : 8,
      max: 25,
      detail: score >= 70 ? 'Negative sentiment: legal delays, fear keywords' : 'Mild negative sentiment detected',
      color: 'text-amber',
      bg: 'bg-amber/8',
      sparkData: [5, 7, 8, 10, 12, 16, 18, 22],
    },
    {
      label: 'Behavioral Score',
      icon: Activity,
      value: score >= 70 ? 18 : score >= 50 ? 10 : 6,
      max: 25,
      detail: score >= 70 ? '7-day non-response, 340% delay increase' : 'Slight engagement decline',
      color: 'text-rose',
      bg: 'bg-rose/8',
      sparkData: [4, 5, 6, 8, 10, 13, 15, 18],
    },
    {
      label: 'Environmental / Legal',
      icon: Calendar,
      value: score >= 70 ? 8 : score >= 50 ? 5 : 3,
      max: 20,
      detail: score >= 70 ? 'Court date in 6 days, compensation delayed 90 days' : 'No imminent legal events',
      color: 'text-primary',
      bg: 'bg-primary/8',
      sparkData: [2, 3, 3, 4, 4, 5, 6, 8],
    },
  ]

  const shapFeatures = [
    { label: 'Voice jitter (high)', value: 18, color: 'var(--coral)' },
    { label: 'Negative legal sentiment', value: 9, color: 'var(--amber)' },
    { label: '7-day non-response', value: 7, color: 'var(--rose)' },
    { label: 'Court date proximity', value: 5, color: 'var(--primary)' },
    { label: 'Response delay ↑340%', value: 4, color: 'var(--coral)' },
    { label: 'Fear keywords detected', value: 3, color: 'var(--amber)' },
  ]

  const predictionData = [38, 42, 45, 52, 60, 68, 76, 82]

  return (
    <SahayShell>
      {/* ── Header ── */}
      <div className="mb-8 max-w-3xl animate-fade-in-up">
        <SectionLabel>Feature 02 · Dynamic Distress Score</SectionLabel>
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          See the signal before the{' '}
          <span className="gradient-text">crisis.</span>
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          A live, multi-modal distress score combining voice stress analytics, NLP sentiment,
          behavioral patterns, and legal context — powered by Explainable AI.
        </p>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* ── Left: The Gauge ── */}
        <div className="space-y-5">
          <Card className="p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' } as React.CSSProperties}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground">CASE MH-2026-0814</p>
                <h2 className="mt-1 text-lg font-extrabold">Ananya · Dynamic Score</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Gauge size={20} />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <DDSGauge score={score} />
            </div>

            {/* Formula display */}
            <div className="mt-6 rounded-xl bg-secondary/50 dark:bg-secondary/30 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                DDS Formula
              </p>
              <p className="text-xs font-mono text-foreground/80">
                DDS = w₁·Acoustic + w₂·Text + w₃·Behavioral + w₄·Legal
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Weights: 0.30 · 0.25 · 0.25 · 0.20
              </p>
            </div>

            {/* Trigger button */}
            <button
              onClick={triggerEscalation}
              disabled={isEscalating}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                isEscalating
                  ? 'bg-coral/15 text-coral cursor-wait'
                  : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.01]'
              }`}
            >
              {isEscalating ? (
                <>
                  <Zap size={16} className="animate-pulse" />
                  Simulating escalation... {score}/76
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Simulate Score Escalation (42 → 76)
                </>
              )}
            </button>
          </Card>

          {/* 72h Prediction */}
          <Card className="p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' } as React.CSSProperties}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-muted-foreground">72-HOUR PREDICTION</p>
                <p className="mt-0.5 text-sm font-extrabold">Risk trajectory</p>
              </div>
              <TrendingUp size={16} className="text-coral" />
            </div>
            <PredictionChart data={predictionData} />
            <div className="mt-3 flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Now</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span className="inline-block h-0.5 w-4 rounded bg-coral" />Actual
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span className="inline-block h-0.5 w-4 rounded bg-rose border-dashed border-b" />Predicted
                </span>
              </div>
              <span className="text-muted-foreground">+72h</span>
            </div>
            {score >= 60 && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose/8 border border-rose/15 px-3 py-2 text-[11px] font-bold text-rose animate-fade-in-up">
                <AlertTriangle size={13} />
                Predicted to reach critical in ~48 hours
              </div>
            )}
          </Card>
        </div>

        {/* ── Right: Breakdown + SHAP ── */}
        <div className="space-y-5">
          {/* Score Breakdown */}
          <Card className="p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' } as React.CSSProperties}>
            <SectionLabel>Score breakdown</SectionLabel>
            <h2 className="text-xl font-extrabold">What&apos;s driving the score</h2>

            <div className="mt-5 space-y-4">
              {scoreBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border p-4 transition-all hover:border-primary/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg} ${item.color}`}>
                        <item.icon size={17} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.label}</p>
                        <p className="text-[11px] text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black">{item.value}<span className="text-xs text-muted-foreground">/{item.max}</span></p>
                      <Sparkline data={item.sparkData} color={`var(--${item.color.replace('text-', '')})`} />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.bg.replace('/8', '')} transition-all duration-1000`}
                      style={{ width: `${(item.value / item.max) * 100}%`, background: `var(--${item.color.replace('text-', '')})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* SHAP Explainability */}
          <Card className="overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.25s' } as React.CSSProperties}>
            <button
              onClick={() => setShapExpanded(!shapExpanded)}
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary">EXPLAINABLE AI (SHAP)</p>
                  <h2 className="mt-0.5 text-lg font-extrabold">Why did the score change?</h2>
                </div>
              </div>
              {shapExpanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
            </button>

            {shapExpanded && (
              <div className="border-t border-border px-6 pb-6 pt-4 animate-slide-down">
                {/* Human-readable explanation */}
                <div className="rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 p-4 mb-5">
                  <p className="text-sm leading-6">
                    <BarChart3 size={14} className="mr-1.5 inline text-primary" />
                    <strong>Distress score increased by +34</strong> due to: <span className="text-coral font-semibold">high voice jitter (+18)</span>, <span className="text-amber font-semibold">negative sentiment regarding legal delays (+9)</span>, and <span className="text-rose font-semibold">non-responsiveness for 7 days (+7)</span>.
                  </p>
                </div>

                {/* SHAP bars */}
                <p className="mb-3 text-xs font-bold text-muted-foreground">FEATURE CONTRIBUTIONS</p>
                <div className="space-y-2.5">
                  {shapFeatures.map((feat) => (
                    <SHAPBar
                      key={feat.label}
                      label={feat.label}
                      value={feat.value}
                      maxValue={20}
                      color={feat.color}
                    />
                  ))}
                </div>

                {/* Action recommendation */}
                {score >= 60 && (
                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-coral/8 border border-coral/15 p-4 text-xs font-semibold text-coral animate-fade-in-up">
                    <AlertTriangle size={14} />
                    Recommended: Immediate safe-check protocol + counsellor assignment
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      <PageFooter />
    </SahayShell>
  )
}
