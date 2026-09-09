'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  AudioLines,
  Brain,
  CheckCircle2,
  Eye,
  FileText,
  HeartPulse,
  MessageSquare,
  Move,
  Timer,
  ShieldCheck,
  Sparkles,
  UserRound,
  Video,
  Waves,
} from 'lucide-react'
import { Card, PageFooter, SahayShell, SectionLabel } from '@/components/sahay-shell'

const questions = [
  { id: 'Q1', short: 'What happened?', signal: 'High distress', score: 82, sentiment: 'Fear / uncertainty', answer: 'It happened in Mumbai.' },
  { id: 'Q2', short: 'Is the place safe?', signal: 'Elevated', score: 68, sentiment: 'Cautious', answer: 'Thane is not fully safe right now.' },
  { id: 'Q3', short: 'Who was involved?', signal: 'Guarded', score: 61, sentiment: 'Protective language', answer: 'Someone known to the family.' },
  { id: 'Q4', short: 'Was it reported?', signal: 'Moderate', score: 54, sentiment: 'Resolve emerging', answer: 'Yes, a report was made.' },
  { id: 'Q5', short: 'Immediate danger?', signal: 'Low', score: 34, sentiment: 'Calmer response', answer: 'No immediate medical help needed.' },
]

const expressionData = [68, 74, 82, 77, 62, 54, 48, 42, 36, 40, 32]
const movementData = [22, 26, 31, 38, 34, 29, 24, 21, 18, 20, 16]
const emotionMix = [
  { label: 'Fear', value: 38, color: 'var(--coral)' },
  { label: 'Caution', value: 27, color: 'var(--amber)' },
  { label: 'Resolve', value: 21, color: 'var(--teal)' },
  { label: 'Calm', value: 14, color: 'var(--primary)' },
]
const responseLatency = [42, 58, 71, 39, 24, 31, 47, 36, 28, 22]
const speechMetrics = [78, 64, 52, 69, 44]

function SignalChart({ values, color, fill }: { values: number[]; color: string; fill: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const width = 760
  const height = 220
  const points = values.map((value, index) => `${(index / (values.length - 1)) * width},${height - 24 - (value / 100) * 160}`).join(' ')
  const area = `0,${height} ${points} ${width},${height}`

  return (
    <div className="relative">
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Simulated signal timeline">
      <defs><linearGradient id={fill} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".28" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {[0, 1, 2, 3].map((line) => <line key={line} x1="0" x2={width} y1={32 + line * 48} y2={32 + line * 48} stroke="currentColor" className="text-border" strokeDasharray="4 5" />)}
      <polygon points={area} fill={`url(#${fill})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((value, index) => { const x = (index / (values.length - 1)) * width; const y = height - 24 - (value / 100) * 160; return <g key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} className="cursor-crosshair"><line x1={x} x2={x} y1="18" y2="196" stroke={color} strokeDasharray="3 5" opacity={hoveredIndex === index ? '.45' : '0'} /><circle cx={x} cy={y} r={hoveredIndex === index ? '8' : '4'} fill="var(--card)" stroke={color} strokeWidth={hoveredIndex === index ? '3' : '2'} className="transition-all duration-200" />{hoveredIndex === index && <circle cx={x} cy={y} r="13" fill="none" stroke={color} strokeOpacity=".35" className="animate-ping" />}</g> })}
      {['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'End'].map((label, index) => <text key={label} x={(index / (values.length - 1)) * width} y="214" textAnchor="middle" fontSize="11" fill="currentColor" className="text-muted-foreground">{label}</text>)}
    </svg>
    {hoveredIndex !== null && <div className="pointer-events-none absolute right-3 top-2 rounded-lg border border-border bg-card/95 px-3 py-2 text-[11px] font-bold shadow-lg animate-fade-in-up"><span className="text-primary">Q{hoveredIndex + 1}</span><span className="ml-2 text-foreground">Signal intensity {values[hoveredIndex]}%</span></div>}
    </div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 48
  return <div className="relative h-32 w-32"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90"><circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="10" className="text-secondary" /><circle cx="60" cy="60" r="48" fill="none" stroke="var(--coral)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-black">{score}</span><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">DDS score</span></div></div>
}

function EmotionDonut() {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  let offset = 0
  return <div className="flex flex-col items-center gap-5 sm:flex-row"><div className="relative h-44 w-44"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">{emotionMix.map((emotion) => { const length = circumference * emotion.value / 100; const dash = `${length} ${circumference - length}`; const circle = <circle key={emotion.label} cx="60" cy="60" r={radius} fill="none" stroke={emotion.color} strokeWidth="14" strokeDasharray={dash} strokeDashoffset={-offset} className="origin-center animate-[atlas-draw_1.2s_ease-out_both]" />; offset += length; return circle })}</svg><div className="absolute inset-0 flex flex-col items-center justify-center"><Sparkles size={18} className="text-primary" /><span className="mt-1 text-xl font-black">100%</span><span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">signal mix</span></div></div><div className="w-full space-y-3">{emotionMix.map((emotion) => <div key={emotion.label} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-bold"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: emotion.color }} />{emotion.label}</span><span className="font-black">{emotion.value}%</span></div>)}</div></div>
}

function LatencyChart() {
  return <div className="flex h-52 items-end gap-2 sm:gap-3">{responseLatency.map((value, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-bold text-muted-foreground">{value}s</span><div className="relative flex h-36 w-full items-end overflow-hidden rounded-t-lg bg-secondary"><div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-lilac animate-[atlas-rise_.9s_ease-out_both]" style={{ height: `${value / 80 * 100}%`, animationDelay: `${index * 70}ms` }} /></div><span className="text-[10px] font-bold text-muted-foreground">Q{index + 1}</span></div>)}</div>
}

function SpeechMarkerChart() {
  const labels = ['Pause length', 'Pitch stress', 'Speech pace', 'Voice tremor', 'Turn-taking']
  return <div className="grid gap-4 sm:grid-cols-[190px_1fr] sm:items-center"><div className="relative mx-auto h-52 w-52"><svg viewBox="0 0 220 220" className="h-full w-full"><polygon points="110,16 202,82 167,190 53,190 18,82" fill="none" stroke="currentColor" className="text-border" /><polygon points="110,48 170,91 148,155 72,155 50,91" fill="none" stroke="currentColor" className="text-border" /><polygon points="110,68 151,98 138,140 82,140 69,98" fill="rgba(111,88,220,.25)" stroke="var(--primary)" strokeWidth="3" className="animate-[atlas-breathe_2.5s_ease-in-out_infinite]" />{[[110,16], [202,82], [167,190], [53,190], [18,82]].map(([x, y], index) => <line key={index} x1="110" y1="110" x2={x} y2={y} stroke="currentColor" className="text-border" />)}</svg></div><div className="space-y-3">{labels.map((label, index) => <div key={label}><div className="mb-1 flex justify-between text-[11px] font-bold"><span>{label}</span><span className="text-primary">{speechMetrics[index]}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary animate-[atlas-width_.9s_ease-out_both]" style={{ width: `${speechMetrics[index]}%`, animationDelay: `${index * 100}ms` }} /></div></div>)}</div></div>
}

function ConfidenceChart() {
  const values = [86, 79, 73, 88, 92, 84, 76, 81, 90, 94]
  return <div className="space-y-3">{values.map((value, index) => <div key={index} className="grid grid-cols-[30px_1fr_38px] items-center gap-3 text-[11px]"><span className="font-black text-primary">Q{index + 1}</span><div className="h-2.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-gradient-to-r from-teal to-primary animate-[atlas-width_.9s_ease-out_both]" style={{ width: `${value}%`, animationDelay: `${index * 75}ms` }} /></div><span className="text-right font-bold text-muted-foreground">{value}%</span></div>)}</div>
}

function EventTimeline() {
  const events = [
    { minute: '00:18', label: 'Tension rise', detail: 'Q1 incident description', color: 'var(--coral)' },
    { minute: '02:42', label: 'Gaze shift', detail: 'Q2 safety context', color: 'var(--amber)' },
    { minute: '05:16', label: 'Long pause', detail: 'Q3 relationship detail', color: 'var(--coral)' },
    { minute: '08:05', label: 'Voice steadies', detail: 'Q4 report confirmation', color: 'var(--teal)' },
    { minute: '11:33', label: 'Affect softens', detail: 'Q5 immediate danger', color: 'var(--primary)' },
  ]
  return <div className="relative ml-2 border-l border-border pl-6">{events.map((event, index) => <div key={event.minute} className="relative mb-5 last:mb-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}><span className="absolute -left-[31px] top-0.5 h-3 w-3 rounded-full border-2 border-card shadow-[0_0_0_3px_var(--background)]" style={{ backgroundColor: event.color }} /><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-extrabold">{event.label}</p><p className="mt-1 text-[11px] text-muted-foreground">{event.detail}</p></div><span className="rounded-md bg-secondary px-2 py-1 font-mono text-[10px] font-bold text-muted-foreground">{event.minute}</span></div></div>)}</div>
}

export default function OverviewPage() {
  return (
    <SahayShell>
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between animate-fade-in-up">
        <div><SectionLabel>Case intelligence · simulated review data</SectionLabel><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Sahay <span className="gradient-text">Insight Atlas</span></h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">A compassionate evidence view of the completed video conversation, combining what was said with visible behavioural signals. All analytics below are illustrative until connected to the live analysis engine.</p></div>
        <Link href="/victim-support" className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground transition hover:border-primary/40 hover:text-primary lg:self-auto"><ArrowLeft size={15} /> Back to Sahay meet</Link>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.35fr_.65fr]"><Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-teal/10 p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"><UserRound size={27} /></div><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-emerald/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald">Review ready</span><span className="text-[11px] text-muted-foreground">Session SAHAY-337AB7</span></div><h2 className="mt-1 text-xl font-extrabold">Anonymous survivor session</h2><p className="text-xs text-muted-foreground">Video meet · 10 questions · Marathi voice interface · 09 Sep 2026</p></div></div><div className="flex items-center gap-2 text-xs font-bold text-emerald"><CheckCircle2 size={16} /> Responses stored</div></div></Card><Card className="flex items-center gap-5 p-6"><ScoreRing score={72} /><div><p className="text-xs font-bold text-muted-foreground">Overall signal</p><p className="mt-1 text-lg font-black text-coral">Elevated distress</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Prioritise human follow-up within 15 minutes.</p></div></Card></div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[{ label: 'Q&A distress', value: '72 / 100', detail: 'Content + sentiment', icon: MessageSquare, color: 'text-coral', bg: 'bg-coral/10' }, { label: 'Facial affect', value: '64 / 100', detail: 'Tension reduced', icon: Eye, color: 'text-primary', bg: 'bg-primary/10' }, { label: 'Movement variance', value: '31 / 100', detail: 'Low-to-moderate', icon: Move, color: 'text-amber', bg: 'bg-amber/10' }, { label: 'Analysis confidence', value: '86%', detail: 'Session quality: good', icon: Brain, color: 'text-teal', bg: 'bg-teal/10' }].map(({ label, value, detail, icon: Icon, color, bg }) => <Card key={label} className="p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold text-muted-foreground">{label}</span><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${color}`}><Icon size={17} /></span></div><p className={`mt-4 text-2xl font-black ${color}`}>{value}</p><p className="mt-1 text-[11px] text-muted-foreground">{detail}</p></Card>)}</div>

      <div className="mb-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><Card className="p-6"><div className="mb-5 flex items-start justify-between"><div><SectionLabel>Multimodal timeline</SectionLabel><h2 className="text-lg font-extrabold">Facial expression and movement</h2><p className="mt-1 text-xs text-muted-foreground">Illustrative signal strength aligned to each question.</p></div><div className="flex gap-3 text-[10px] font-bold"><span className="flex items-center gap-1.5 text-primary"><span className="h-2 w-2 rounded-full bg-primary" />Affect</span><span className="flex items-center gap-1.5 text-amber"><span className="h-2 w-2 rounded-full bg-amber" />Movement</span></div></div><SignalChart values={expressionData} color="var(--primary)" fill="atlasAffect" /><div className="mt-4 border-t border-border pt-4"><SignalChart values={movementData} color="var(--amber)" fill="atlasMovement" /></div></Card><Card className="p-6"><SectionLabel>Visual analysis</SectionLabel><h2 className="text-lg font-extrabold">Observed patterns</h2><div className="mt-5 space-y-4">{[{ icon: Eye, title: 'Gaze aversion', text: 'Increased around Q1–Q3 when describing the incident.', color: 'text-coral', bg: 'bg-coral/10' }, { icon: Waves, title: 'Facial tension', text: 'High at opening; gradually softened after Q4.', color: 'text-primary', bg: 'bg-primary/10' }, { icon: Move, title: 'Reduced movement', text: 'Still posture detected during sensitive answers.', color: 'text-amber', bg: 'bg-amber/10' }].map(({ icon: Icon, title, text, color, bg }) => <div key={title} className="flex gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}><Icon size={16} /></span><div><p className="text-xs font-extrabold">{title}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{text}</p></div></div>)}</div><div className="mt-6 rounded-xl border border-amber/30 bg-amber/10 p-3 text-[11px] leading-relaxed text-foreground"><AlertTriangle size={14} className="mr-1 inline text-amber" /> Facial and movement signals are supportive indicators, not proof of emotion or truthfulness.</div></Card></div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3"><Card className="p-6"><div className="mb-5 flex items-center gap-2"><Sparkles size={17} className="text-primary" /><div><SectionLabel>Language signal</SectionLabel><h2 className="text-lg font-extrabold">Emotion composition</h2></div></div><EmotionDonut /><p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">Fear is the strongest detected language signal, while resolve rises after the survivor confirms that a report exists.</p></Card><Card className="p-6"><div className="mb-5 flex items-center gap-2"><Timer size={17} className="text-amber" /><div><SectionLabel>Conversation rhythm</SectionLabel><h2 className="text-lg font-extrabold">Response latency</h2></div></div><LatencyChart /><p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">Longer pauses around Q2–Q3 may indicate caution or memory effort; they should prompt patience, not assumption.</p></Card><Card className="p-6"><div className="mb-5 flex items-center gap-2"><AudioLines size={17} className="text-teal" /><div><SectionLabel>Voice markers</SectionLabel><h2 className="text-lg font-extrabold">Speech stress profile</h2></div></div><SpeechMarkerChart /><p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">Voice markers are illustrative and can be affected by language, device quality, and environment.</p></Card></div>

      <div className="mb-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><Card className="overflow-hidden p-0"><div className="border-b border-border/60 p-6"><div className="flex items-center justify-between"><div><SectionLabel>Question-level analysis</SectionLabel><h2 className="text-lg font-extrabold">What the conversation is telling us</h2></div><span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">10 captured responses</span></div></div><div className="divide-y divide-border/60">{questions.map((question) => <div key={question.id} className="grid gap-3 p-5 sm:grid-cols-[52px_1fr_150px] sm:items-center"><span className="text-xs font-black text-primary">{question.id}</span><div><p className="text-xs font-extrabold">{question.short}</p><p className="mt-1 text-[11px] text-muted-foreground">“{question.answer}”</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-coral animate-[atlas-width_.9s_ease-out_both]" style={{ width: `${question.score}%` }} /></div></div><div className="sm:text-right"><p className="text-[11px] font-extrabold text-coral">{question.signal}</p><p className="mt-1 text-[10px] text-muted-foreground">{question.sentiment}</p></div></div>)}</div></Card><div className="space-y-6"><Card className="p-6"><SectionLabel>AI synthesis</SectionLabel><h2 className="text-lg font-extrabold">Support interpretation</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">The session begins with elevated fear and guarded language. Distress decreases after the survivor confirms that a report has been made, but the safety context remains unresolved.</p><div className="mt-5 space-y-2 text-xs font-bold"><div className="flex items-center gap-2 text-coral"><span className="h-2 w-2 rounded-full bg-coral" />Immediate safety check recommended</div><div className="flex items-center gap-2 text-teal"><span className="h-2 w-2 rounded-full bg-teal" />Legal aid referral likely relevant</div><div className="flex items-center gap-2 text-primary"><span className="h-2 w-2 rounded-full bg-primary" />Continue low-pressure contact</div></div></Card><Card className="border-coral/30 bg-coral/5 p-6"><div className="flex items-center gap-2 text-coral"><HeartPulse size={18} /><span className="text-xs font-extrabold uppercase tracking-wider">Recommended next action</span></div><h3 className="mt-3 text-lg font-black">Assign a trained support officer</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Offer a safe callback, confirm current location privately, and avoid asking the survivor to repeat the account.</p><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-4 py-2.5 text-xs font-extrabold text-white"><ShieldCheck size={15} />Create protected follow-up</button></Card></div></div>

      <Card className="mb-8 p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><SectionLabel>Evidence layers</SectionLabel><h2 className="text-lg font-extrabold">Keep the human story at the centre</h2><p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">This view brings together the saved transcript, question-level language signals, and optional visual cues. Every automated signal should guide care, never replace professional judgement or survivor consent.</p></div><div className="flex shrink-0 gap-2"><span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-[10px] font-bold"><FileText size={13} className="text-primary" />Transcript</span><span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-[10px] font-bold"><Video size={13} className="text-teal" />Video cues</span></div></div></Card>
      <style jsx>{`@keyframes atlas-draw { from { stroke-dashoffset: 290px; opacity: .2; } to { opacity: 1; } } @keyframes atlas-rise { from { transform: scaleY(0); transform-origin: bottom; } to { transform: scaleY(1); transform-origin: bottom; } } @keyframes atlas-width { from { width: 0; } } @keyframes atlas-breathe { 0%, 100% { opacity: .65; } 50% { opacity: 1; } }`}</style>
      <div className="mb-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><Card className="p-6"><div className="mb-5 flex items-center gap-2"><Brain size={17} className="text-teal" /><div><SectionLabel>Model quality</SectionLabel><h2 className="text-lg font-extrabold">Question confidence</h2></div></div><ConfidenceChart /><p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">Confidence combines audio quality, transcript clarity, response completeness, and signal agreement for each question.</p></Card><Card className="p-6"><div className="mb-5 flex items-center gap-2"><Move size={17} className="text-amber" /><div><SectionLabel>Session markers</SectionLabel><h2 className="text-lg font-extrabold">Behavioural event timeline</h2></div></div><EventTimeline /></Card></div>

      <PageFooter />
    </SahayShell>
  )
}
