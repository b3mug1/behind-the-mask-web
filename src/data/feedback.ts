// Shared by the browser form, the Vercel API route, the tests and the report script.
// Only these exact values are accepted and stored.

export const FEEDBACK_MAX_BODY_BYTES = 2048
export const FEEDBACK_MIN_FILL_MS = 3000
export const FEEDBACK_MAX_FILL_MS = 24 * 60 * 60 * 1000

export type FeedbackKey = 'usefulness' | 'learning' | 'intention'

export type FeedbackOption = { readonly value: string; readonly label: string }

export type FeedbackQuestion = {
  readonly key: FeedbackKey
  readonly prompt: string
  readonly options: readonly FeedbackOption[]
}

export const feedbackQuestions: readonly FeedbackQuestion[] = [
  {
    key: 'usefulness',
    prompt: 'Was this guide useful?',
    options: [
      { value: 'very_useful', label: 'Very useful' },
      { value: 'somewhat_useful', label: 'Somewhat useful' },
      { value: 'not_very_useful', label: 'Not very useful' },
      { value: 'not_useful_at_all', label: 'Not useful at all' },
    ],
  },
  {
    key: 'learning',
    prompt: 'Did you learn something new from this guide?',
    options: [
      { value: 'yes_definitely', label: 'Yes, definitely' },
      { value: 'yes_a_little', label: 'Yes, a little' },
      { value: 'no_not_really', label: 'No, not really' },
      { value: 'no_nothing_new', label: 'No, nothing new' },
    ],
  },
  {
    key: 'intention',
    prompt: 'Would you use these principles in your online communication?',
    options: [
      { value: 'definitely', label: 'Definitely' },
      { value: 'probably', label: 'Probably' },
      { value: 'probably_not', label: 'Probably not' },
      { value: 'definitely_not', label: 'Definitely not' },
    ],
  },
]

export type FeedbackAnswers = Record<FeedbackKey, string>

export type FeedbackValidation =
  | { ok: true; record: FeedbackAnswers }
  | { ok: false; reason: string }

const ALLOWED_FIELDS: readonly string[] = ['usefulness', 'learning', 'intention', 'consent', 'website', 'elapsedMs']

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseAnswer(key: FeedbackKey, value: unknown): string | null {
  const question = feedbackQuestions.find((item) => item.key === key)
  if (!question || typeof value !== 'string') return null
  return question.options.some((option) => option.value === value) ? value : null
}

export function validateFeedbackSubmission(input: unknown): FeedbackValidation {
  if (!isPlainObject(input)) return { ok: false, reason: 'invalid_body' }
  if (Object.keys(input).some((field) => !ALLOWED_FIELDS.includes(field))) {
    return { ok: false, reason: 'unexpected_field' }
  }
  // Honeypot: real users never see or fill this field.
  if (input.website !== undefined && input.website !== '') return { ok: false, reason: 'spam_detected' }

  const elapsed = input.elapsedMs
  if (typeof elapsed !== 'number' || !Number.isFinite(elapsed)) return { ok: false, reason: 'invalid_timing' }
  if (elapsed < FEEDBACK_MIN_FILL_MS || elapsed > FEEDBACK_MAX_FILL_MS) return { ok: false, reason: 'invalid_timing' }

  if (input.consent !== true) return { ok: false, reason: 'consent_required' }

  const usefulness = parseAnswer('usefulness', input.usefulness)
  const learning = parseAnswer('learning', input.learning)
  const intention = parseAnswer('intention', input.intention)
  if (usefulness === null || learning === null || intention === null) {
    return { ok: false, reason: 'invalid_answer' }
  }

  return { ok: true, record: { usefulness, learning, intention } }
}
