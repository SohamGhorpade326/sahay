'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  Brain,
  Check,
  CheckCheck,
  Clock,
  Database,
  Globe,
  Headphones,
  Languages,
  LockKeyhole,
  MessageCircle,
  MessageSquare,
  Mic,
  MicOff,
  Pause,
  Phone,
  PhoneCall,
  PhoneOff,
  Play,
  Radio,
  Scale,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserRound,
  Video,
  VideoOff,
  Volume2,
  Zap,
} from 'lucide-react'
import { Card, PageFooter, SahayShell, SectionLabel } from '@/components/sahay-shell'
import {
  createVideoSession,
  getVideoSession,
  getNextVideoQuestion,
  saveTypedAnswer,
  startVideoInterview,
  submitVideoSession,
  uploadVideoAnswer,
  type VideoQuestion,
} from '@/lib/video-onboarding-api'

const languages = [
  { code: 'mr', label: 'मराठी', name: 'Marathi' },
  { code: 'hi', label: 'हिन्दी', name: 'Hindi' },
  { code: 'en', label: 'English', name: 'English' },
  { code: 'ta', label: 'தமிழ்', name: 'Tamil' },
  { code: 'te', label: 'తెలుగు', name: 'Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ', name: 'Kannada' },
]

export default function VictimSupport() {
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'sms' | 'app' | 'ivrs'>('whatsapp')
  const [appMode, setAppMode] = useState<'chat' | 'meet'>('chat')
  const [selectedLang, setSelectedLang] = useState('mr')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  
  // App Mode State (Only App mode is interactive)
  const [inputMsg, setInputMsg] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { sender: 'user', text: 'मला आज बाहेर पडायला भीती वाटते. केसची पुढची तारीख कधी आहे हेही कळत नाही.', time: '10:42 AM' },
    { sender: 'ai', text: 'SAHAY तुमच्या पाठीशी आहे. तुमची भीती स्वाभाविक आहे. SC/ST कायद्यानुसार तुम्हाला कायदेशीर मदत मिळण्याचा पूर्ण अधिकार आहे.', time: '10:43 AM' },
  ])
  const [isMeetMuted, setIsMeetMuted] = useState(false)
  const [isMeetVideoOff, setIsMeetVideoOff] = useState(false)
  const [meetStage, setMeetStage] = useState<'ready' | 'interview' | 'complete'>('ready')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<VideoQuestion | null>(null)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [answerCount, setAnswerCount] = useState(0)
  const [savedAnswers, setSavedAnswers] = useState<Array<{ question_text: string; audio_transcript?: string }>>([])
  const [transcript, setTranscript] = useState('')
  const [meetError, setMeetError] = useState('')
  const [isStartingMeet, setIsStartingMeet] = useState(false)
  const [isRecordingAnswer, setIsRecordingAnswer] = useState(false)
  const [isUploadingAnswer, setIsUploadingAnswer] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [typedAnswer, setTypedAnswer] = useState('')
  const cameraRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recordingStartedRef = useRef(0)

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  useEffect(() => {
    if (!currentQuestion || meetStage !== 'interview') return
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question_text)
    utterance.rate = 0.9
    utterance.lang = selectedLang === 'mr' ? 'mr-IN' : selectedLang === 'hi' ? 'hi-IN' : 'en-IN'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [currentQuestion, meetStage, selectedLang])

  useEffect(() => {
    if (meetStage !== 'interview' || !streamRef.current || !cameraRef.current) return
    const video = cameraRef.current
    video.srcObject = streamRef.current
    video.play().catch(() => setMeetError('Camera preview is blocked. Allow camera access and refresh the meet.'))
  }, [meetStage])

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera and microphone access is unavailable in this browser.')
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    streamRef.current = stream
    if (cameraRef.current) {
      cameraRef.current.srcObject = stream
      await cameraRef.current.play()
    }
  }

  const beginMeet = async () => {
    try {
      setMeetError('')
      setIsStartingMeet(true)
      await startCamera()
      const created = await createVideoSession()
      const started = await startVideoInterview(created.session_id)
      setSessionId(created.session_id)
      setCurrentQuestion(started.first_question)
      setQuestionNumber(1)
      setMeetStage('interview')
    } catch (error) {
      setMeetError(error instanceof Error ? error.message : 'Unable to start the secure meet.')
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    } finally {
      setIsStartingMeet(false)
    }
  }

  const finishInterview = async () => {
    if (!sessionId) return
    await submitVideoSession(sessionId)
    const completedSession = await getVideoSession(sessionId)
    setSavedAnswers(completedSession.answers.map((answer) => ({ question_text: answer.question_text, audio_transcript: answer.audio_transcript || answer.answer_text })))
    setMeetStage('complete')
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }

  const stopAndUploadAnswer = () => {
    if (!recorderRef.current || recorderRef.current.state === 'inactive' || !currentQuestion || !sessionId) return
    recorderRef.current.stop()
    setIsRecordingAnswer(false)
  }

  const startAnswerRecording = () => {
    if (!streamRef.current || !currentQuestion || !sessionId || isRecordingAnswer) return
    const audioTracks = streamRef.current.getAudioTracks()
    if (audioTracks.length === 0) {
      setMeetError('Microphone access is required to record an answer.')
      return
    }
    chunksRef.current = []
    const recorder = MediaRecorder.isTypeSupported('audio/webm')
      ? new MediaRecorder(new MediaStream(audioTracks), { mimeType: 'audio/webm' })
      : new MediaRecorder(new MediaStream(audioTracks))
    recorder.ondataavailable = (event) => event.data.size > 0 && chunksRef.current.push(event.data)
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const duration = Math.max(1, Math.round((Date.now() - recordingStartedRef.current) / 1000))
      try {
        setIsUploadingAnswer(true)
        setMeetError('')
        const result = await uploadVideoAnswer(sessionId, currentQuestion.question_id, blob, duration)
        const next = await getNextVideoQuestion(sessionId)
        setTranscript(result.audio_transcript || 'Answer stored securely. Transcription is processing.')
        setAnswerCount((count) => count + 1)
        if (!next.completed && next.next_question) {
          setCurrentQuestion(next.next_question)
          setQuestionNumber(next.next_question.order)
        } else {
          await finishInterview()
        }
      } catch (error) {
        setMeetError(error instanceof Error ? error.message : 'Unable to save this answer.')
      } finally {
        setIsUploadingAnswer(false)
      }
    }
    recorderRef.current = recorder
    recordingStartedRef.current = Date.now()
    recorder.start()
    setIsRecordingAnswer(true)
  }

  const submitTypedAnswer = async () => {
    if (!sessionId || !currentQuestion || !typedAnswer.trim() || isUploadingAnswer) return
    try {
      setIsUploadingAnswer(true)
      setMeetError('')
      await saveTypedAnswer(sessionId, currentQuestion.question_id, typedAnswer.trim())
      const next = await getNextVideoQuestion(sessionId)
      setTranscript(typedAnswer.trim())
      setTypedAnswer('')
      setIsChatOpen(false)
      setAnswerCount((count) => count + 1)
      if (!next.completed && next.next_question) {
        setCurrentQuestion(next.next_question)
        setQuestionNumber(next.next_question.order)
      } else {
        await finishInterview()
      }
    } catch (error) {
      setMeetError(error instanceof Error ? error.message : 'Unable to save your typed answer.')
    } finally {
      setIsUploadingAnswer(false)
    }
  }

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return
    const newMsg = { sender: 'user', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setChatHistory((prev) => [...prev, newMsg])
    setInputMsg('')

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'SAHAY: Your message has been logged securely. AI has identified emotional distress. A counselor is assigned.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 1200)
  }

  return (
    <SahayShell>
      {/* ── Page Header ── */}
      <div className="mb-6 max-w-3xl animate-fade-in-up">
        <SectionLabel>Feature 01 · Omnichannel Multilingual AI Check-in</SectionLabel>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          4 Channel <span className="gradient-text">Telemetry & Response Logs</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed sm:text-base">
          Victims interact on WhatsApp, SMS, App, or IVRS 14566. Channels 1, 2 & 4 display recorded backend data logs from the victim&apos;s device, while Channel 3 provides live in-app interaction.
        </p>
      </div>

      {/* ── 4 Channel Sub-Page Navigation Tabs ── */}
      <div className="mb-8 flex flex-wrap gap-2.5 border-b border-border/60 pb-4">
        {[
          { id: 'whatsapp', label: '1. WhatsApp Log Data', icon: MessageCircle, color: 'border-emerald text-emerald bg-emerald/10' },
          { id: 'sms', label: '2. SMS/USSD Gateway Log', icon: Radio, color: 'border-teal text-teal bg-teal/10' },
          { id: 'app', label: '3. Mobile App (Interactive Chat & Meet)', icon: Headphones, color: 'border-primary text-primary bg-primary/10' },
          { id: 'ivrs', label: '4. IVRS 14566 Call Recording', icon: PhoneCall, color: 'border-coral text-coral bg-coral/10' },
        ].map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch.id as any)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-black transition-all ${
              activeChannel === ch.id
                ? `${ch.color} border shadow-md scale-[1.02]`
                : 'border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <ch.icon size={16} />
            <span>{ch.label}</span>
          </button>
        ))}
      </div>

      {/* ── Sub-Page 1: WhatsApp Data Record Log ── */}
      {activeChannel === 'whatsapp' && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] animate-fade-in-up">
          <Card className="overflow-hidden p-0 border-emerald/30 shadow-xl">
            {/* WhatsApp Record Header */}
            <div className="flex items-center justify-between bg-emerald-800 dark:bg-emerald-950 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold text-white">
                  WA
                </div>
                <div>
                  <p className="text-sm font-extrabold flex items-center gap-1.5">
                    WhatsApp Business Webhook Data Log
                    <ShieldCheck size={14} className="text-emerald-300" />
                  </p>
                  <p className="text-[10px] opacity-80">Recorded from Victim&apos;s WhatsApp (+91 98*** ****14)</p>
                </div>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold">
                Backend Sync Active
              </span>
            </div>

            {/* Recorded Conversation Log Display */}
            <div className="p-5 space-y-4 bg-emerald-950/10 dark:bg-black/30 min-h-[340px]">
              <div className="text-center">
                <span className="rounded-md bg-secondary/80 px-3 py-1 text-[10px] font-semibold text-muted-foreground">
                  📅 Recording Date: Sept 8, 2026 · Session #WA-8814
                </span>
              </div>

              {/* Bot Message Log */}
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-xs bg-card border border-border p-3.5 text-xs space-y-1 shadow-sm">
                  <p className="font-bold text-emerald">SAHAY WhatsApp Bot (Auto-Sent)</p>
                  <p>नमस्कार! SAHAY मध्ये आपले स्वागत आहे. मी तुमची कशी मदत करू शकतो?</p>
                  <div className="text-[9px] text-muted-foreground text-right">10:41 AM</div>
                </div>
              </div>

              {/* Victim Recorded Voice Note */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-emerald-700 text-white p-3.5 text-xs shadow-md space-y-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-800 hover:scale-105 transition-transform"
                    >
                      {isPlayingAudio ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <div className="flex-1">
                      <div className="h-1.5 w-32 rounded-full bg-white/30 overflow-hidden">
                        <div className={`h-full bg-white ${isPlayingAudio ? 'w-[65%] transition-all duration-1000' : 'w-0'}`} />
                      </div>
                      <p className="mt-1 text-[10px] opacity-90">Recorded Voice Note · 14s (Marathi)</p>
                    </div>
                  </div>
                  <p className="text-[11px] italic opacity-95">
                    &quot;मला केसच्या पुढील तारखेबद्दल भीती वाटत आहे...&quot;
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[9px] opacity-80">
                    <span>10:42 AM</span>
                    <CheckCheck size={12} />
                  </div>
                </div>
              </div>

              {/* Bot AI Response Log */}
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-card border border-border p-3.5 text-xs space-y-2 shadow-sm">
                  <p className="font-bold text-emerald">SAHAY AI Response Log</p>
                  <p>आम्ही तुमची भीती समजून घेतली आहे. NALSA कायदेशीर सहाय्यक अधिकारी तुमच्याशी जोडले जात आहेत.</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="rounded-lg bg-emerald/15 text-emerald border border-emerald/30 px-2.5 py-1 text-[10px] font-bold">
                      ✓ NALSA Legal Aid Assigned
                    </span>
                    <span className="rounded-lg bg-emerald/15 text-emerald border border-emerald/30 px-2.5 py-1 text-[10px] font-bold">
                      ✓ Case #MH-2841 Logged
                    </span>
                  </div>
                  <div className="text-[9px] text-muted-foreground text-right">10:43 AM</div>
                </div>
              </div>
            </div>

            {/* Read-Only Status Bar */}
            <div className="border-t border-border p-3 bg-card flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <LockKeyhole size={13} className="text-emerald" />
                Read-only telemetry record from victim&apos;s WhatsApp
              </span>
              <span className="font-mono text-[10px]">SYNC_STATUS: 200 OK</span>
            </div>
          </Card>

          {/* WhatsApp Telemetry Panel */}
          <div className="space-y-5">
            <Card className="p-6">
              <SectionLabel>WhatsApp Telemetry & Signal Extraction</SectionLabel>
              <h2 className="text-xl font-extrabold">Recorded Signal Insights</h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Extracted data signals captured automatically from the victim&apos;s WhatsApp interaction on their mobile device.
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                  <span className="font-bold">Detected Language</span>
                  <span className="text-emerald font-bold">Marathi (मराठी ASR Model)</span>
                </div>
                <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                  <span className="font-bold">Extracted Emotion</span>
                  <span className="text-rose font-bold">Fear (72%), Case Delay Anxiety (65%)</span>
                </div>
                <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                  <span className="font-bold">DDS Distress Impact</span>
                  <span className="text-coral font-bold">+14 points added to DDS Score</span>
                </div>
                <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                  <span className="font-bold">Intervention Trigger</span>
                  <span className="text-emerald font-bold">Auto-referred to NALSA Advocate</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Sub-Page 2: SMS & USSD Gateway Data Record Log ── */}
      {activeChannel === 'sms' && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] animate-fade-in-up">
          <Card className="overflow-hidden p-0 border-teal/30 shadow-xl">
            {/* Telecom Gateway Record Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 text-white">
                  <Radio size={18} />
                </div>
                <div>
                  <p className="text-sm font-extrabold">Telecom SMS/USSD Gateway Log</p>
                  <p className="text-[10px] text-slate-300">Recorded from Victim&apos;s 2G Feature Phone (Shortcode 56161)</p>
                </div>
              </div>
              <span className="rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2.5 py-1 text-[10px] font-bold">
                Offline SMS Capture
              </span>
            </div>

            {/* Recorded SMS Thread Display */}
            <div className="p-5 space-y-3 bg-slate-950/20 min-h-[340px]">
              <div className="text-center">
                <span className="rounded-md bg-secondary/80 px-3 py-1 text-[10px] font-semibold text-muted-foreground">
                  📡 Telecom Carrier: BSNL India · Hathras Cell Tower Zone 4
                </span>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl bg-slate-800 text-slate-100 p-3 text-xs space-y-1">
                  <p className="font-bold text-teal-400">SAHAY Automated SMS</p>
                  <p>Send HELP to 56161 for emergency distress check-in or dial *145# for USSD menu.</p>
                  <p className="text-[9px] text-slate-400">10:00 AM</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-xl bg-teal-700 text-white p-3 text-xs space-y-1">
                  <p className="font-bold">Victim Incoming SMS</p>
                  <p>HELP MARATHI - मला पोलिसांची मदत हवी आहे.</p>
                  <p className="text-[9px] text-teal-200">10:02 AM</p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl bg-slate-800 text-slate-100 p-3 text-xs space-y-1">
                  <p className="font-bold text-teal-400">SAHAY Auto-Reply</p>
                  <p>तुमचा संदेश मिळाला आहे. केस क्र #MH-2841 तयार झाला आहे. सहाय्यक अधिकारी संपर्क साधत आहेत.</p>
                  <p className="text-[9px] text-slate-400">10:03 AM</p>
                </div>
              </div>
            </div>

            {/* Read-Only Status Bar */}
            <div className="border-t border-border p-3 bg-card flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <LockKeyhole size={13} className="text-teal" />
                Read-only telecom log captured from BSNL SMS Gateway
              </span>
              <span className="font-mono text-[10px]">GATEWAY: ACTIVE</span>
            </div>
          </Card>

          <Card className="p-6">
            <SectionLabel>SMS Telemetry Insights</SectionLabel>
            <h2 className="text-xl font-extrabold">Feature Phone Text Telemetry</h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              SMS logs captured from rural 2G feature phones without internet requirements.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                <span className="font-bold">Cellular Network</span>
                <span className="text-teal font-bold">BSNL 2G Hathras Circle</span>
              </div>
              <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                <span className="font-bold">Keywords Parsed</span>
                <span className="text-teal font-bold">HELP, MARATHI, POLICE</span>
              </div>
              <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                <span className="font-bold">USSD Session Code</span>
                <span className="text-teal font-bold">*145#</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Sub-Page 3: Native App Support (INTERACTIVE CHAT & MEET) ── */}
      {activeChannel === 'app' && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Dual Sub-Toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAppMode('chat')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  appMode === 'chat' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <MessageSquare size={14} />
                <span>Option 3A: Interactive App Chatbox</span>
              </button>
              <button
                onClick={() => setAppMode('meet')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  appMode === 'meet' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Video size={14} />
                <span>Option 3B: Live 1-on-1 AI Video/Voice Meet Room</span>
              </button>
            </div>
            <span className="text-[11px] font-bold text-primary">In-App Live Portal</span>
          </div>

          {/* Option 3A: Interactive App Chatbox */}
          {appMode === 'chat' && (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="p-5 flex flex-col justify-between min-h-[420px]">
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Headphones size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold">SAHAY App Chatbox</p>
                        <p className="text-[10px] text-muted-foreground">Live In-App Interactive Support</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => setSelectedLang(l.code)}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${selectedLang === l.code ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chat History List */}
                  <div className="space-y-3.5 mb-4 max-h-[260px] overflow-y-auto pr-1">
                    {chatHistory.map((c, i) => (
                      <div key={i} className={`flex ${c.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[82%] rounded-2xl p-3.5 text-xs shadow-sm ${
                          c.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-xs' : 'bg-secondary border border-border text-foreground rounded-tl-xs'
                        }`}>
                          <p>{c.text}</p>
                          <p className="mt-1 text-[9px] opacity-70 text-right">{c.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Controls */}
                <div className="pt-3 border-t border-border flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type in your language..."
                    className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white hover:scale-105 transition-transform"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </Card>

              <Card className="p-6">
                <SectionLabel>App Chat Capabilities</SectionLabel>
                <h2 className="text-xl font-extrabold">Interactive In-App Experience</h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Allows victims to type, send voice notes, and receive instant empathetic responses in 22 languages with automated emotion classification.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                    <span className="font-bold">Emotion Radar</span>
                    <span className="text-primary font-bold">Active (Fear 72%, Distress 44%)</span>
                  </div>
                  <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                    <span className="font-bold">Offline Storage</span>
                    <span className="text-emerald font-bold">Encrypted Local Vault</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Option 3B: Live 1-on-1 AI Video/Voice Meet Room */}
          {appMode === 'meet' && (
            <Card className="p-6 bg-slate-950 text-white border-primary/40 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white animate-pulse">
                    <Video size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold flex items-center gap-2">
                      SAHAY 1-on-1 Virtual Meet Room
                      <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    </p>
                    <p className="text-[10px] text-slate-400">Live AI Counselor Session · Encrypted Call #MT-994</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 text-[11px] font-bold">
                    Connected · 04:12 Min
                  </span>
                </div>
              </div>

              {meetError && <p className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">{meetError}</p>}

              {meetStage === 'ready' && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary"><Video size={34} /></div>
                  <h3 className="mt-5 text-xl font-extrabold">Start your private AI meet</h3>
                  <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-400">SAHAY will ask ten questions in the live video session. Your recorded answers and transcripts are stored securely for support review.</p>
                  <button onClick={beginMeet} disabled={isStartingMeet} className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground disabled:opacity-50"><Video size={17} />{isStartingMeet ? 'Opening secure meet...' : 'Start private AI meet'}</button>
                </div>
              )}

              {meetStage === 'interview' && (
                <>
                  <div className="mb-4 flex items-center justify-between text-xs"><span className="font-bold text-slate-300">Question {questionNumber} of 10</span><span className="text-emerald-400">{answerCount} answers saved</span></div>
                  <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(answerCount / 10) * 100}%` }} /></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-indigo-700/50 bg-gradient-to-br from-indigo-900 to-slate-900 p-6 text-center">
                      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary"><Sparkles size={38} /><div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-40" /></div>
                      <h3 className="mt-4 text-base font-extrabold">SAHAY AI Counselor</h3><p className="text-xs text-indigo-300">Listening in {languages.find((language) => language.code === selectedLang)?.name || 'English'}</p>
                      <p className="mt-5 rounded-xl border border-primary/30 bg-slate-950/40 p-3 text-left text-sm leading-relaxed text-white">{currentQuestion?.question_text}</p>
                    </div>
                    <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                      {!isMeetVideoOff ? <video ref={cameraRef} muted playsInline className="h-full min-h-[260px] w-full object-cover" /> : <div className="flex min-h-[260px] flex-col items-center justify-center text-slate-400"><UserRound size={48} /><p className="mt-2 text-xs">Camera paused</p></div>}
                      <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] text-slate-200">Live victim video</span>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-xs text-slate-200"><span className="font-bold text-primary">Saved caption:</span> {transcript || 'Your recorded answer will appear here after upload.'}</div>
                  {isChatOpen && (
                    <div className="mt-4 rounded-2xl border border-primary/40 bg-slate-900 p-4">
                      <div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-extrabold">Type your answer</p><p className="text-[11px] text-slate-400">Your response will be saved to this question.</p></div><button onClick={() => setIsChatOpen(false)} className="text-xs text-slate-400 hover:text-white">Close</button></div>
                      <textarea value={typedAnswer} onChange={(event) => setTypedAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) submitTypedAnswer() }} rows={3} autoFocus placeholder="Write your response here..." className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-primary" />
                      <button onClick={submitTypedAnswer} disabled={!typedAnswer.trim() || isUploadingAnswer} className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground disabled:opacity-50">{isUploadingAnswer ? 'Saving response...' : 'Save typed response'}</button>
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3 border-t border-slate-800 pt-4">
                    <button onClick={() => setIsChatOpen((open) => !open)} disabled={isUploadingAnswer} className={`flex h-12 w-12 items-center justify-center rounded-full ${isChatOpen ? 'bg-primary text-primary-foreground' : 'bg-slate-800 text-slate-200'}`} title="Type answer instead"><MessageCircle size={20} /></button>
                    <button onClick={() => { setIsMeetMuted((muted) => !muted); streamRef.current?.getAudioTracks().forEach((track) => { track.enabled = isMeetMuted }) }} className={`flex h-12 w-12 items-center justify-center rounded-full ${isMeetMuted ? 'bg-rose-600' : 'bg-slate-800'}`} title={isMeetMuted ? 'Unmute microphone' : 'Mute microphone'}>{isMeetMuted ? <MicOff size={20} /> : <Mic size={20} />}</button>
                    <button onClick={() => { setIsMeetVideoOff((off) => !off); streamRef.current?.getVideoTracks().forEach((track) => { track.enabled = isMeetVideoOff }) }} className={`flex h-12 w-12 items-center justify-center rounded-full ${isMeetVideoOff ? 'bg-rose-600' : 'bg-slate-800'}`} title={isMeetVideoOff ? 'Turn video on' : 'Turn video off'}>{isMeetVideoOff ? <VideoOff size={20} /> : <Video size={20} />}</button>
                    <button onClick={isRecordingAnswer ? stopAndUploadAnswer : startAnswerRecording} disabled={isUploadingAnswer} className={`flex items-center gap-2 rounded-full px-5 py-3 text-xs font-extrabold ${isRecordingAnswer ? 'bg-rose-600' : 'bg-primary text-primary-foreground'} disabled:opacity-50`}>{isUploadingAnswer ? 'Saving answer...' : isRecordingAnswer ? <><Pause size={16} />Finish answer</> : <><Mic size={16} />Record answer</>}</button>
                  </div>
                </>
              )}

              {meetStage === 'complete' && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6"><Check size={42} className="mx-auto text-emerald-400" /><h3 className="mt-4 text-center text-xl font-extrabold">Your story has been securely recorded</h3><p className="mt-2 text-center text-sm text-slate-300">All ten responses are stored in the SAHAY support queue. A support officer can now review them and follow up through your safe contact.</p><div className="mt-6 space-y-2">{savedAnswers.map((answer, index) => <div key={`${answer.question_text}-${index}`} className="rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-left"><p className="text-xs font-bold text-primary">{index + 1}. {answer.question_text}</p><p className="mt-1 text-xs text-slate-300">{answer.audio_transcript || 'Audio answer stored; transcription is pending.'}</p></div>)}</div><div className="mt-5 flex flex-col gap-2 sm:flex-row"><Link href="/overview" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-extrabold text-primary-foreground"><Sparkles size={15} />Open Sahay Insight Atlas</Link><button onClick={() => setAppMode('chat')} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-xs font-bold text-slate-200"><MessageCircle size={15} />Return to support chat</button></div><p className="mt-4 text-center font-mono text-xs text-emerald-300">Session {sessionId}</p></div>
              )}

            </Card>
          )}
        </div>
      )}

      {/* ── Sub-Page 4: IVRS 14566 Call Recorder Data Log ── */}
      {activeChannel === 'ivrs' && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] animate-fade-in-up">
          <Card className="p-6 border-coral/30">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">NATIONAL HELPLINE 14566</p>
                  <h2 className="text-lg font-extrabold">IVRS Telephonic Call Recording & ASR Log</h2>
                </div>
              </div>
              <span className="rounded-full bg-coral/15 text-coral border border-coral/30 px-3 py-1 text-[10px] font-bold">
                Recorded Voice Stream
              </span>
            </div>

            {/* Audio Call Player */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-5 mb-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white shadow-lg shadow-coral/25 hover:scale-105 transition-transform"
                  >
                    {isPlayingAudio ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <div>
                    <p className="text-xs font-extrabold">Recorded Audio Call #CALL-2026-991</p>
                    <p className="text-[10px] text-muted-foreground">Incoming Phone Call to 14566 · Marathi Audio</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-coral">02:14 / 04:30</span>
              </div>

              {/* Waveform Visual Bar */}
              <div className="h-10 w-full flex items-center justify-between gap-1 px-2">
                {[12, 28, 16, 34, 40, 22, 18, 30, 44, 26, 14, 38, 20, 32, 16, 28, 42, 18, 12, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-coral transition-all"
                    style={{ height: `${h}px`, opacity: isPlayingAudio ? (i % 2 === 0 ? '1' : '0.6') : '0.4' }}
                  />
                ))}
              </div>
            </div>

            {/* Recorded ASR Speech-to-Text Transcript */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recorded ASR Speech-to-Text Log</p>
              <div className="rounded-xl border border-border bg-card p-4 text-xs leading-relaxed space-y-2">
                <p>
                  <strong className="text-coral">[00:12 Victim Phone Call]:</strong> मला आज बाहेर पडायला भीती वाटते. केसची पुढची तारीख कधी आहे हेही कळत नाही.
                </p>
                <p>
                  <strong className="text-primary">[00:24 IVRS AI Bot]:</strong> SAHAY प्रणालीमध्ये तुमचे स्वागत आहे. आम्ही तुमचा निरोप नोंदवला आहे. घाबरू नका.
                </p>
              </div>
            </div>

            {/* Read-Only Status Bar */}
            <div className="border-t border-border pt-4 mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <LockKeyhole size={13} className="text-coral" />
                Read-only telephonic recording captured from IVRS 14566 Gateway
              </span>
              <span className="font-mono text-[10px]">RECORDING_ID: #REC-991</span>
            </div>
          </Card>

          <Card className="p-6">
            <SectionLabel>Channel 4 Insights</SectionLabel>
            <h2 className="text-xl font-extrabold">Voice Stress Telemetry</h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Analyzes raw voice stress markers (pitch jitter, shimmer, speaking rate) from recorded 14566 phone calls.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                <span className="font-bold">Pitch Jitter Stress</span>
                <span className="text-rose font-bold">High (3.4%)</span>
              </div>
              <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                <span className="font-bold">Speaking Speed</span>
                <span className="text-amber font-bold">Slow (84 words/min)</span>
              </div>
              <div className="rounded-xl border border-border p-3.5 text-xs flex items-center justify-between">
                <span className="font-bold">Shimmer Amplitude</span>
                <span className="text-rose font-bold">Elevated (8.1 dB)</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <PageFooter />
    </SahayShell>
  )
}
