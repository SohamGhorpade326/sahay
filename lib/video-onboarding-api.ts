export interface VictimIntake {
  phone: string
  age: string
  location: string
  incidentSummary: string
  preferredLanguage: string
  consent: boolean
}

export interface VideoQuestion {
  question_id: number
  question_text: string
  question_type: string
  timer_seconds: number
  order: number
}

export interface VideoSession {
  session_id: string
  employee_name: string
  employee_id: string
  status: string
  questions_answered: number
  total_questions: number
  answers: Array<{
    question_id: number
    question_text: string
    answer_text?: string
    audio_path?: string
    audio_transcript?: string
    answered_at?: string
  }>
}

const API_BASE = (process.env.NEXT_PUBLIC_VIDEO_ONBOARDING_API_URL || '/api/video-onboarding').replace(/\/$/, '')

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || `Video service error (${response.status})`)
  }

  return response.json()
}

export function createVideoSession() {
  return request<{ session_id: string; questions_count: number }>('/sessions/create', {
    method: 'POST',
    body: JSON.stringify({
      employee_name: 'SAHAY survivor',
      employee_id: `SAHAY-${Date.now()}`,
      employee_email: undefined,
    }),
  })
}

export function startVideoInterview(sessionId: string) {
  return request<{ first_question: VideoQuestion; total_questions: number }>(`/sessions/${sessionId}/start-interview`, {
    method: 'POST',
  })
}

export function getVideoSession(sessionId: string) {
  return request<VideoSession>(`/sessions/${sessionId}`)
}

export function getNextVideoQuestion(sessionId: string) {
  return request<{ next_question?: VideoQuestion; completed: boolean }>(`/sessions/${sessionId}/next-question`)
}

export function uploadVideoAnswer(sessionId: string, questionId: number, blob: Blob, durationSeconds: number) {
  const formData = new FormData()
  formData.append('question_id', String(questionId))
  formData.append('audio_duration_seconds', String(durationSeconds))
  formData.append('duration_seconds', String(durationSeconds))
  formData.append('file', blob, `question-${questionId}.webm`)

  return fetch(`${API_BASE}/sessions/${sessionId}/upload-audio`, {
    method: 'POST',
    body: formData,
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }))
      throw new Error(error.detail || `Video upload error (${response.status})`)
    }
    return response.json() as Promise<{ next_question?: VideoQuestion; audio_transcript?: string }>
  })
}

export function submitVideoSession(sessionId: string) {
  return request<{ success: boolean; review_queue_id: string }>(`/sessions/${sessionId}/submit-for-hr`, {
    method: 'POST',
  })
}

export function saveTypedAnswer(sessionId: string, questionId: number, answerText: string) {
  return request<{ next_question?: VideoQuestion }>(`/sessions/${sessionId}/answer`, {
    method: 'POST',
    body: JSON.stringify({
      question_id: questionId,
      answer_text: answerText,
      duration_seconds: 0,
    }),
  })
}