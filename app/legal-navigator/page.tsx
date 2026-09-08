'use client'

import { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bot,
  Briefcase,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Edit3,
  FileCheck,
  FileText,
  Gavel,
  HelpCircle,
  Info,
  Landmark,
  Layers,
  Lock,
  MapPin,
  MessageSquare,
  Phone,
  Scale,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  UsersRound,
  Zap,
} from 'lucide-react'
import { Card, PageFooter, SahayShell, SectionLabel } from '@/components/sahay-shell'

// ── Detailed Indian Legal Data: 7 Journey Stages under SC/ST POA Act 1989 & Rules 1995 ──
const detailedJourneyStages = [
  {
    id: 0,
    name: 'Incident & Reporting',
    statutoryRef: 'Section 3(1), 3(2) POA Act 1989 & Rule 5 POA Rules',
    desc: 'Atrocity occurrence, initial emergency reporting, medical evaluation & spot inspection',
    aiAdvice: 'Document all physical evidence immediately (photos, video, audio, scene details). Under Rule 7, ensure a medical examination is conducted by a Govt Medical Officer within 24 hours. Inform the District Magistrate or Special Cell if local police hesitate.',
    proceduralSteps: [
      'Record exact time, location, and names of accused/witnesses',
      'Undergo medical examination at Govt Hospital (Rule 7)',
      'Submit written information to Station House Officer (SHO) or 14566 Helpline',
      'Request immediate police protection if threatened (Sec 15A(10))',
    ],
    requiredDocs: [
      'Govt Medical Injury & Examination Report (Rule 7)',
      'Aadhaar Card / Voter ID (Victim Identification)',
      'Caste/Tribe Certificate issued by Competent Authority (Tehsildar/SDM)',
      'Written Incident Narrative / Audio-Visual Evidence Log',
    ],
    statutoryLimit: 'Mandatory immediate police response & Medical within 24h (Rule 7)',
    reliefAmount: 'Emergency Immediate Medical Relief & Travel Support',
  },
  {
    id: 1,
    name: 'FIR Registration',
    statutoryRef: 'Section 18A POA Act, Section 154 CrPC/BNSS & Rule 5 POA Rules',
    desc: 'Mandatory FIR registration without preliminary inquiry under specific POA provisions',
    aiAdvice: 'Under Section 18A (added by 2018 Amendment), no preliminary inquiry is required for registering an FIR. Ensure specific sections under Section 3(1)(r), 3(1)(s), 3(2)(va) are invoked. Demand a free certified copy of the FIR immediately as mandated by Rule 5(3).',
    proceduralSteps: [
      'Ensure SHO enters FIR in police station record without delay',
      'Verify inclusion of exact SC/ST Act sections along with IPC/BNS sections',
      'Obtain free certified copy of FIR with seal and signature (Rule 5(3))',
      'Forward FIR copy to District Social Welfare Officer (DSWO) for relief',
    ],
    requiredDocs: [
      'Certified Copy of FIR with Police Station Seal (Rule 5(3))',
      'Caste Certificate Copy of Victim & Accused Details',
      'Acknowledgement Slip of Complaint Submission',
      'Form Annexure I for Financial Compensation Claim',
    ],
    statutoryLimit: 'Zero delay FIR mandatory (Sec 4(2) penalizes delay by 6m-1yr jail)',
    reliefAmount: '50% Compensation disbursed within 7 days of FIR (Rule 12(4))',
  },
  {
    id: 2,
    name: 'Investigation & Statements',
    statutoryRef: 'Rule 7 POA Rules 1995 & Section 164 CrPC/BNSS',
    desc: 'DySP level investigation, scene panchnama & judicial magistrate statement recording',
    aiAdvice: 'Investigation MUST be conducted by an officer not below the rank of Deputy Superintendent of Police (DySP) as per Rule 7(1). Ensure the victim statement is recorded before a Judicial Magistrate under Section 164 CrPC/BNSS for evidentiary admissibility.',
    proceduralSteps: [
      'Verify DySP rank of Investigating Officer (IO) under Rule 7(1)',
      'Participate in Spot Panchnama & Scene of Crime verification',
      'Record Section 164 CrPC statement before Judicial Magistrate',
      'Submit additional witness statements & electronic evidence to IO',
    ],
    requiredDocs: [
      'Certified Copy of Sec 164 CrPC Judicial Magistrate Statement',
      'Spot Panchnama Copy & Scene Verification Report',
      'Seizure Memo of Electronic/Physical Evidence',
      'Witness Statement Transcripts under Sec 161 CrPC',
    ],
    statutoryLimit: 'Investigation to be completed within 60 days (Rule 7(2))',
    reliefAmount: 'Interim maintenance, monthly ration & police escort provided',
  },
  {
    id: 3,
    name: 'Chargesheet Filing',
    statutoryRef: 'Section 173 CrPC/BNSS & Rule 7(2) POA Rules',
    desc: 'Final investigation report and formal chargesheet submission in Special Court',
    aiAdvice: 'Review the final chargesheet with your empaneled NALSA/DLSA advocate. Ensure all accused listed in the FIR are charged and no charges under SC/ST Act were dropped without valid justification. Verify if supplementary chargesheet under 173(8) is needed.',
    proceduralSteps: [
      'Obtain copy of Chargesheet (Form 173) filed by DySP in Special Court',
      'Verify list of witnesses (CSW) and documentary evidence attached',
      'Check if sanction under Sec 197 CrPC obtained if accused is public servant',
      'File application for compensation stage 2 disbursement',
    ],
    requiredDocs: [
      'Complete Chargesheet Copy (Form 173) with all Annexures',
      'Forensic Science Laboratory (FSL) & Chemical Examiner Reports',
      'Final Medical Certificate & Disability Assessment (if applicable)',
      'List of Prosecution Witnesses (PW)',
    ],
    statutoryLimit: 'Filing mandatory within 60 days of FIR registration (Rule 7(2))',
    reliefAmount: '25% Compensation disbursed upon Chargesheet filing (Rule 12(4))',
  },
  {
    id: 4,
    name: 'Special Court Trial',
    statutoryRef: 'Section 14, 15A POA Act & Rule 11 POA Rules',
    desc: 'Day-to-day trial proceedings in Designated Special Court with witness protection',
    aiAdvice: 'Section 14 mandates day-to-day trial completion within 60 days. Under Section 15A(10), apply for Witness Protection (police escort, in-camera trial, video link testimony). Claim daily travel and diet allowance for every court attendance under Rule 11.',
    proceduralSteps: [
      'Apply for Witness Protection Order under Sec 15A(10) before Special Judge',
      'Submit Attendance Slips for Daily Travel & Diet Allowance (Rule 11)',
      'Ensure Special Public Prosecutor (SPP) coordinates witness examination',
      'Request in-camera proceedings if victim/witness safety is threatened',
    ],
    requiredDocs: [
      'Special Court Summons / Subpoena Notice',
      'Witness Protection Order Copy under Sec 15A(10)',
      'Daily Attendance Slips & Travel Expense Vouchers (Rule 11)',
      'Certified Deposition Copies of Prosecution Witnesses (PW1, PW2)',
    ],
    statutoryLimit: 'Day-to-day trial completion targeted within 60 days (Sec 14(3))',
    reliefAmount: 'Daily Travel, Maintenance & Diet Allowance per hearing (Rule 11)',
  },
  {
    id: 5,
    name: 'Judgment & Verdict',
    statutoryRef: 'Section 14, 15A(8) POA Act & Rule 14 POA Rules',
    desc: 'Special Court verdict, conviction pronouncement & certified copy issuance',
    aiAdvice: 'Under Section 15A(8), the victim has the right to free certified copies of the judgment and all court orders within 7 days. If convicted, verify statutory minimum sentence. If acquitted, consult DLSA advocate for filing State Appeal within 90 days.',
    proceduralSteps: [
      'Attend Judgment pronouncement in Special Court',
      'Apply for free certified copy of Judgment under Sec 15A(8)',
      'Submit Judgment Copy to District Social Welfare Officer for final relief',
      'Consult advocate regarding State Appeal if acquitted or sentence inadequate',
    ],
    requiredDocs: [
      'Certified Copy of Special Court Judgment & Order Sheet',
      'Conviction Certificate / Sentence Order Copy',
      'Application for Final Installment of Statutory Relief',
      'Memorandum of Appeal (if appealing against acquittal)',
    ],
    statutoryLimit: 'Free certified copy issued within 7 days of judgment (Sec 15A(8))',
    reliefAmount: 'Final 25% Compensation disbursed on conviction (Rule 12(4))',
  },
  {
    id: 6,
    name: 'Statutory Relief & Rehab',
    statutoryRef: 'Rule 12(4), Annexure I & Rule 15 POA Rules 1995',
    desc: '100% financial compensation, pension, land allotment & economic rehabilitation',
    aiAdvice: 'Verify full 100% statutory compensation credited to bank account under Rule 12(4). In addition to monetary relief, Annexure I mandates economic rehabilitation: house site allotment, monthly pension of ₹5,000 to widow/dependents, and govt job quota for serious atrocities.',
    proceduralSteps: [
      'Verify credit of 100% total statutory compensation in bank passbook',
      'Apply for Govt House Site / Agriculture Land Allotment under Annexure I',
      'Submit application for Monthly Pension (₹5,000/month) for eligible death/disability',
      'Enroll in PM-DAKSH skill training & self-employment grant scheme',
    ],
    requiredDocs: [
      'Bank Passbook Copy showing DBT Relief Credit',
      'District Social Welfare Officer (DSWO) Relief Clearance Certificate',
      'Rehabilitation Allotment Order for Land / Pension / Employment',
      'Annual Income & Dependence Certificate',
    ],
    statutoryLimit: 'Full compensation disbursement within 7 days of order',
    reliefAmount: '100% Relief (₹1.0L to ₹8.25L) + Monthly Pension + Land Allotment',
  },
]

// ── Detailed Advocates Directory ──
const empaneledLawyers = [
  {
    name: 'Adv. Meenakshi Sundaram',
    role: 'Senior DLSA Panel Advocate',
    experience: '16 Years Practice',
    specialization: 'SC/ST POA Act, Special Court Appeals & Witness Protection',
    languages: 'Marathi, Hindi, English',
    district: 'Special Court Panel, District Legal Services Authority',
    phone: '+91 98230 11420',
    barId: 'MAH/2841/2008',
    office: 'Chamber 402, District Special Court Complex, Hathras',
    status: 'Available for Consultation',
  },
  {
    name: 'Adv. Devendra Kumar Paswan',
    role: 'NALSA High Court Legal Aid Counsel',
    experience: '12 Years Practice',
    specialization: 'Statutory Compensation Recovery (Rule 12) & Bail Opposition',
    languages: 'Hindi, English',
    district: 'State High Court Legal Services Committee',
    phone: '+91 94120 55161',
    barId: 'UP/5161/2012',
    office: 'High Court Legal Aid Cell, Bench Room 12',
    status: 'In Court · Available after 4 PM',
  },
  {
    name: 'Adv. Ananya Roy',
    role: 'Special Public Prosecutor (Empaneled)',
    experience: '14 Years Practice',
    specialization: 'Sec 15A Victim Rights, Sec 164 Statements & Forensic Trial',
    languages: 'English, Marathi, Bengali',
    district: 'District Legal Services Authority (Zone 4)',
    phone: '+91 97110 88204',
    barId: 'DL/9940/2010',
    office: 'DLSA Legal Aid Front Office, Room 18',
    status: 'Available for Consultation',
  },
  {
    name: 'Adv. Rajeshwar Rao',
    role: 'Senior Human Rights Advocate',
    experience: '20 Years Practice',
    specialization: 'SC/ST Atrocities Criminal Defense, PIL & Supreme Court Appeals',
    languages: 'Hindi, English, Telugu',
    district: 'Supreme Court Legal Services Committee',
    phone: '+91 98100 44321',
    barId: 'D/1204/2004',
    office: 'Supreme Court Lawyers Chamber Block 2, New Delhi',
    status: 'Available for Consultation',
  },
]

// ── Detailed Statutory Victim Rights ──
const detailedRights = [
  {
    title: 'Right to Free Legal Aid & Private Counsel Choice (Sec 15A(1) & Rule 14)',
    desc: 'Victims are entitled to engage a private advocate of their choice, with full professional fees reimbursed by the District Legal Services Authority (DLSA). Alternatively, NALSA provides a senior empaneled advocate free of charge.',
    statute: 'SC/ST POA Act Section 15A(1) & Rule 14 POA Rules 1995',
  },
  {
    title: 'Mandatory Statutory Relief Schedule (Rule 12(4) & Annexure I)',
    desc: 'Statutory monetary compensation ranging from ₹1,00,000 (insult/intimidation under 3(1)(r)) to ₹8,25,000 (murder/rape). Disbursed 50% on FIR registration, 25% on Chargesheet, and 25% on conviction directly into bank account via DBT.',
    statute: 'SC/ST POA Amendment Rules 2016 Annexure I',
  },
  {
    title: 'Witness Protection Scheme & Escort (Sec 15A(10))',
    desc: 'State government is statutorily bound to provide full witness protection: 24/7 police escort, safe house relocation, in-camera trial proceedings, video-link testimony, and complete identity protection.',
    statute: 'SC/ST POA Act Section 15A(10) & SC Witness Protection Scheme 2018',
  },
  {
    title: 'Right to Travel, Maintenance & Daily Diet Allowance (Rule 11)',
    desc: 'Victims and accompanying witnesses receive reimbursement for first-class train/bus travel, daily maintenance, and diet allowance for attending police investigation or Special Court hearings.',
    statute: 'SC/ST POA Rules 1995 Rule 11 & Annexure IV',
  },
  {
    title: 'Fast-Track Special Court Day-to-Day Trial (Sec 14 & Sec 14A)',
    desc: 'Cases must be tried in designated Special Courts on a day-to-day basis with trial completion targeted within 60 days. Appeals against any Special Court order lie directly to High Court within 90 days.',
    statute: 'SC/ST POA Act Section 14 & Section 14A',
  },
  {
    title: 'Right to Information & Free Certified Copies (Sec 15A(8))',
    desc: 'Victims have the statutory right to be informed of all court dates, bail applications, chargesheets, and receive free certified copies of all police and court records within 7 days.',
    statute: 'SC/ST POA Act Section 15A(8)',
  },
]

// ── Government Welfare & Rehabilitation Schemes ──
const govSchemes = [
  {
    name: 'Central Sector Scheme for Implementation of POA Act',
    agency: 'Ministry of Social Justice & Empowerment (MoSJE)',
    benefit: '100% Central funding for victim monetary relief, setting up Special Courts, and operating District Legal Aid Protection Cells.',
    eligibility: 'All victims registered under SC/ST POA Act 1989',
  },
  {
    name: 'Dr. Ambedkar Foundation Medical Aid & Emergency Relief',
    agency: 'Dr. Ambedkar Foundation (Autonomous Body under MoSJE)',
    benefit: 'Up to ₹5,00,000 direct financial assistance for emergency medical treatment and surgery resulting from atrocity injuries.',
    eligibility: 'SC/ST atrocity victims with serious medical injuries',
  },
  {
    name: 'PM-DAKSH Skill Development & Rehabilitation Scheme',
    agency: 'National SC Finance & Development Corp (NSFDC)',
    benefit: 'Free short-term & long-term skill training, monthly stipend of ₹1,500 to ₹3,000, and self-employment subsidy loans up to ₹2,00,000.',
    eligibility: 'Atrocity victims & dependents seeking economic rehabilitation',
  },
  {
    name: 'National Legal Services Authority (NALSA) Legal Aid Scheme',
    agency: 'National Legal Services Authority (Supreme Court of India)',
    benefit: 'Complete legal assistance: free legal drafting, advocate fees, court fee exemption, and free bail opposition support.',
    eligibility: 'All SC/ST citizens under Section 12(a) of Legal Services Authorities Act 1987',
  },
]

export default function LegalNavigator() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'rights'>('timeline')
  const [currentStep, setCurrentStep] = useState(4) // Default: Special Court Trial stage
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Namaste! I am the SAHAY AI Legal Navigator Assistant. You can ask me any question regarding SC/ST Act rights, FIR mandatory provisions, Rule 12(4) compensation schedules, DySP investigation rules, or empaneled legal aid lawyers.' },
  ])
  const [userQuery, setUserQuery] = useState('')

  const activeStageObj = detailedJourneyStages[currentStep]

  const handleSendQuery = (textToSend?: string) => {
    const q = textToSend || userQuery
    if (!q.trim()) return

    const newChat = [...chatMessages, { sender: 'user', text: q }]
    setChatMessages(newChat)
    if (!textToSend) setUserQuery('')

    setTimeout(() => {
      let aiResp = 'According to the SC/ST (Prevention of Atrocities) Act 1989 and Rules 1995: You are entitled to free legal representation via DLSA under Section 15A. All proceedings in Special Court are fast-tracked.'
      
      const qLower = q.toLowerCase()
      if (qLower.includes('fir') || qLower.includes('refuse') || qLower.includes('police')) {
        aiResp = 'Under Rule 5(3) of SC/ST POA Rules & Sec 18A, registration of FIR is mandatory without preliminary inquiry. If police refuse, Sec 4(2) penalizes public servant neglect of duty with 6m-1yr jail. You can send complaint by RPAD to SP/Superintendent of Police under Sec 154(3) or approach Special Court under Sec 156(3) CrPC.'
      } else if (qLower.includes('compensation') || qLower.includes('money') || qLower.includes('50%')) {
        aiResp = 'Under Rule 12(4) & Annexure I (2016 Amendment), statutory compensation ranges from ₹1,00,000 to ₹8,25,000. 50% is disbursed within 7 days of FIR registration, 25% on Chargesheet filing, and 25% upon conviction directly into your bank account via DBT by District Social Welfare Officer (DSWO).'
      } else if (qLower.includes('bail') || qLower.includes('anticipatory')) {
        aiResp = 'Under Section 18 of SC/ST POA Act, Section 438 CrPC (Anticipatory Bail) does NOT apply. The Supreme Court in Prathvi Raj Chauhan (2020) held that anticipatory bail cannot be granted where prima facie offense under the SC/ST Act is disclosed. Furthermore, under Sec 15A(5), the victim has the mandatory right to be heard during any bail hearing.'
      } else if (qLower.includes('witness') || qLower.includes('protection') || qLower.includes('escort')) {
        aiResp = 'Under Section 15A(10) & Witness Protection Scheme 2018, you are entitled to 24/7 police escort, safe house relocation, identity concealment, and in-camera trial proceedings. Additionally, Rule 11 mandates reimbursement of travel expenses and daily diet allowance for attending court hearings.'
      } else if (qLower.includes('lawyer') || qLower.includes('legal aid') || qLower.includes('advocate')) {
        aiResp = 'Under Section 15A(1) & Rule 14, you can choose a private advocate of your choice and DLSA will reimburse the professional fees, OR DLSA will assign a senior empaneled advocate free of cost. Check our Advocates Directory tab for empaneled lawyer contacts.'
      } else if (qLower.includes('allowance') || qLower.includes('travel') || qLower.includes('diet')) {
        aiResp = 'Under Rule 11 of SC/ST POA Rules 1995 (Annexure IV), victims and accompanying witnesses receive first-class train/bus travel reimbursement, daily maintenance allowance, and diet allowance for every date of attending police investigation or Special Court proceedings.'
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: aiResp }])
    }, 1000)
  }

  return (
    <SahayShell>
      {/* ── Page Header ── */}
      <div className="mb-6 max-w-3xl animate-fade-in-up">
        <SectionLabel>Feature 04 · AI Legal Navigator & Statutory Guidance</SectionLabel>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          Know your statutory stage. <span className="gradient-text">Assert your rights.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed sm:text-base">
          Production-grade legal guidance under the SC/ST (Prevention of Atrocities) Act 1989 & Amendment Rules 2016. Complete procedural steps, Rule 12(4) compensation schedules, AI legal Q&A assistant, and NALSA advocate directory.
        </p>
      </div>

      {/* ── Main Sub-Page Navigation Tabs ── */}
      <div className="mb-8 flex flex-wrap gap-2.5 border-b border-border/60 pb-4">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition-all ${
            activeTab === 'timeline'
              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
              : 'border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Landmark size={16} />
          <span>1. Interactive Legal Journey Timeline & AI Suggestions</span>
        </button>

        <button
          onClick={() => setActiveTab('rights')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition-all ${
            activeTab === 'rights'
              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
              : 'border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Scale size={16} />
          <span>2. Rights, Welfare Schemes, AI Legal Chatbot & Advocates Directory</span>
        </button>
      </div>

      {/* ── TAB 1: Interactive Legal Journey Timeline & Dynamic AI Suggestions ── */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Timeline Card */}
          <Card className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">SC/ST POA Act Case Tracker · Case #MH-2026-0814</span>
                <h2 className="text-xl font-extrabold lg:text-2xl">Interactive Legal Journey Stage Tracker</h2>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center gap-2">
                <span className="rounded-full bg-emerald/15 text-emerald border border-emerald/30 px-3 py-1 text-[11px] font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  Active Special Court Trial
                </span>
              </div>
            </div>

            {/* Stepper Timeline Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
              {detailedJourneyStages.map((stage) => {
                const isPast = stage.id < currentStep
                const isCurrent = stage.id === currentStep

                return (
                  <button
                    key={stage.id}
                    onClick={() => setCurrentStep(stage.id)}
                    className={`group flex flex-col items-center p-3.5 rounded-2xl border transition-all text-center ${
                      isCurrent
                        ? 'border-primary bg-primary/10 shadow-lg scale-105 ring-2 ring-primary/20'
                        : isPast
                        ? 'border-emerald/40 bg-emerald/5 text-emerald'
                        : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition-transform ${
                      isCurrent ? 'bg-primary text-primary-foreground shadow-md' : isPast ? 'bg-emerald text-white' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {isPast ? <Check size={16} /> : stage.id + 1}
                    </div>
                    <p className={`mt-2 text-xs font-extrabold leading-tight ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                      {stage.name}
                    </p>
                    <span className="mt-1 text-[9px] text-muted-foreground opacity-80 group-hover:opacity-100">
                      {isCurrent ? '● Current Stage' : isPast ? 'Completed' : 'Upcoming'}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Stage Selector Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-primary">
                  <MapPin size={16} />
                  <span>Stage {activeStageObj.id + 1}: <span className="font-black">{activeStageObj.name}</span></span>
                </div>
                <span className="text-muted-foreground font-semibold">• {activeStageObj.statutoryRef}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground hidden lg:inline">Click any node above to inspect or edit stage</span>
                <button
                  onClick={() => setCurrentStep((prev) => (prev + 1) % detailedJourneyStages.length)}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:scale-105 transition-transform shadow-sm"
                >
                  <Edit3 size={13} />
                  <span>Advance to Next Stage</span>
                </button>
              </div>
            </div>
          </Card>

          {/* AI Dynamic Recommendations & Requirements Grid based on Selected Stage */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* AI Recommendation Box */}
            <Card className="p-6 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background">
              <div className="flex items-center gap-3 border-b border-border/60 pb-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">AI Strategy & Guidance</p>
                  <h3 className="text-base font-black">What Needs To Be Done & How</h3>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-foreground font-medium mb-4">
                {activeStageObj.aiAdvice}
              </p>

              <div className="border-t border-border/60 pt-3">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Procedural Action Steps:</p>
                <ul className="space-y-1.5 text-[11px]">
                  {activeStageObj.proceduralSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Required Documents Checklist */}
            <Card className="p-6">
              <div className="flex items-center gap-3 border-b border-border/60 pb-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <FileCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal">Compliance Checklist</p>
                  <h3 className="text-base font-black">Required Stage Documents</h3>
                </div>
              </div>
              <div className="space-y-2.5">
                {activeStageObj.requiredDocs.map((doc) => (
                  <div key={doc} className="flex items-center gap-2.5 rounded-xl border border-border/60 p-3 text-xs bg-secondary/20">
                    <CheckCircle2 size={16} className="text-emerald shrink-0" />
                    <span className="font-semibold text-foreground">{doc}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Statutory Deadlines & Relief Schedule Box */}
            <Card className="p-6">
              <div className="flex items-center gap-3 border-b border-border/60 pb-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber">Statutory Timelines</p>
                  <h3 className="text-base font-black">Mandatory Limits & Compensation</h3>
                </div>
              </div>
              <div className="space-y-3 text-xs">
                <div className="rounded-xl bg-amber/10 border border-amber/20 p-3.5 text-amber font-bold leading-relaxed">
                  <Clock size={14} className="inline mr-1.5" />
                  Limit: {activeStageObj.statutoryLimit}
                </div>
                <div className="rounded-xl bg-emerald/10 border border-emerald/20 p-3.5 text-emerald font-bold leading-relaxed">
                  <Landmark size={14} className="inline mr-1.5" />
                  Relief: {activeStageObj.reliefAmount}
                </div>
                <div className="rounded-xl bg-secondary p-3 text-[11px] text-muted-foreground">
                  <Info size={13} className="inline mr-1 text-primary" />
                  Governed by SC/ST POA Amendment Rules 2016 Annexure I
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB 2: Rights, Schemes, AI Legal Chatbot & Lawyer Directory Sub-Page ── */}
      {activeTab === 'rights' && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Section 1: Victim Statutory Rights & Government Welfare Schemes */}
          <div>
            <SectionLabel>Statutory Knowledge & Rights Charter</SectionLabel>
            <h2 className="text-2xl font-black mb-4">Guaranteed Statutory Rights & Welfare Schemes</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Detailed Rights */}
              <Card className="p-6">
                <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" />
                  Section 15A Rights Charter (SC/ST POA Act)
                </h3>
                <div className="space-y-3.5">
                  {detailedRights.map((r) => (
                    <div key={r.title} className="rounded-xl border border-border/70 p-4 bg-secondary/20">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-extrabold text-foreground">{r.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                      <span className="mt-2 inline-block rounded bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold text-primary">
                        {r.statute}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Welfare Schemes */}
              <Card className="p-6">
                <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2">
                  <Building size={20} className="text-teal" />
                  Apex Central & State Welfare Schemes
                </h3>
                <div className="space-y-3.5">
                  {govSchemes.map((s) => (
                    <div key={s.name} className="rounded-xl border border-border/70 p-4 bg-secondary/20">
                      <p className="text-sm font-extrabold text-foreground">{s.name}</p>
                      <p className="text-[10px] font-bold text-teal mt-0.5">{s.agency}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2">{s.benefit}</p>
                      <div className="mt-2 border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
                        <strong>Eligibility:</strong> {s.eligibility}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Section 2: Interactive AI Legal Advice Chatbot */}
          <Card className="p-6 border-primary/30 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                  <Bot size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">AI LEGAL ADVICE ASSISTANT</p>
                  <h2 className="text-xl font-extrabold">Clarify Any SC/ST Act Legal Procedure Doubt</h2>
                </div>
              </div>
              <span className="rounded-full bg-primary/15 text-primary border border-primary/30 px-3 py-1 text-[10px] font-bold">
                Trained on POA Act 1989 & Rules 1995
              </span>
            </div>

            {/* Quick Prompt Chips */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-[11px] font-bold text-muted-foreground flex items-center">Quick Questions:</span>
              {[
                'What if police refuse FIR under SC/ST Act?',
                'How to claim 50% initial compensation under Rule 12(4)?',
                'Is anticipatory bail granted under Section 18/18A?',
                'What witness protection is guaranteed under Sec 15A(10)?',
                'What travel & diet allowance is paid under Rule 11?',
                'How to get a free empaneled legal aid lawyer?',
              ].map((qp) => (
                <button
                  key={qp}
                  onClick={() => handleSendQuery(qp)}
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-semibold text-foreground hover:border-primary hover:bg-primary/10 transition-all text-left"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Chat Thread */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3 min-h-[220px] max-h-[320px] overflow-y-auto mb-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-xs' : 'bg-card border border-border text-foreground rounded-tl-xs'
                  }`}>
                    {msg.sender === 'ai' && <p className="text-[10px] font-extrabold text-primary mb-1">SAHAY AI Legal Assistant</p>}
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder="Ask any question about FIR, court procedures, legal rights, DySP rules, or compensation..."
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
              />
              <button
                onClick={() => handleSendQuery()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white hover:scale-105 transition-transform shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </Card>

          {/* Section 3: Empaneled Free Legal Aid Advocates Contact Directory */}
          <div>
            <SectionLabel>Legal Representation Directory</SectionLabel>
            <h2 className="text-2xl font-black mb-4">Empaneled Free Legal Aid Advocates (NALSA / DLSA)</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {empaneledLawyers.map((lawyer) => (
                <Card key={lawyer.name} hover className="p-6 flex flex-col justify-between border-primary/20">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-sm">
                        Adv
                      </div>
                      <span className="rounded-full bg-emerald/15 text-emerald border border-emerald/30 px-2.5 py-0.5 text-[10px] font-bold">
                        Empaneled
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold">{lawyer.name}</h3>
                    <p className="text-xs font-bold text-primary">{lawyer.role}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{lawyer.experience} • Bar ID: {lawyer.barId}</p>

                    <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-xs">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Specialization</p>
                        <p className="font-semibold text-foreground leading-tight">{lawyer.specialization}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Chamber / Office</p>
                        <p className="font-semibold text-foreground text-[11px]">{lawyer.office}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <a
                      href={`tel:${lawyer.phone}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:scale-[1.01] transition-all"
                    >
                      <Phone size={14} />
                      <span>Call Advocate ({lawyer.phone})</span>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      <PageFooter />
    </SahayShell>
  )
}
