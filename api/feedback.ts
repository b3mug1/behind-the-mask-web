// Vercel Edge Function: POST /api/feedback
// Stores only validated, consented, allowlisted answers in Supabase.
// The Supabase secret key is read from server-side environment variables only.
import { FEEDBACK_MAX_BODY_BYTES, validateFeedbackSubmission } from '../src/data/feedback.ts'

export const config = { runtime: 'edge' }

declare const process: { env: Record<string, string | undefined> }

const HOURLY_SUBMISSION_LIMIT = 500

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
}

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS })
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  return origin === new URL(request.url).origin
}

// Global ceiling for the whole survey (not per person): protects the free tier
// from bulk automated writes without identifying any visitor.
async function underHourlyLimit(baseUrl: string, headers: Record<string, string>): Promise<boolean> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const response = await fetch(`${baseUrl}/rest/v1/guide_feedback?select=id&created_at=gte.${encodeURIComponent(since)}`, {
    method: 'GET',
    headers: { ...headers, Prefer: 'count=exact', Range: '0-0' },
  })
  if (!response.ok) throw new Error(`count failed: ${response.status}`)
  const range = response.headers.get('content-range') ?? ''
  const total = Number(range.split('/')[1])
  return Number.isFinite(total) ? total < HOURLY_SUBMISSION_LIMIT : true
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { allow: 'POST' } })
  }
  if (!isSameOrigin(request)) return json(403, { ok: false, error: 'forbidden_origin' })

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return json(415, { ok: false, error: 'unsupported_media_type' })
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0')
  if (declaredLength > FEEDBACK_MAX_BODY_BYTES) return json(413, { ok: false, error: 'payload_too_large' })

  const rawBody = await request.text()
  if (new TextEncoder().encode(rawBody).byteLength > FEEDBACK_MAX_BODY_BYTES) {
    return json(413, { ok: false, error: 'payload_too_large' })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(rawBody)
  } catch {
    return json(400, { ok: false, error: 'invalid_json' })
  }

  const result = validateFeedbackSubmission(parsed)
  if (!result.ok) {
    // Spam and validation failures are answered the same way the form expects,
    // without echoing details back to the client.
    return json(400, { ok: false, error: 'invalid_submission' })
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, '')
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !secretKey) {
    console.error('feedback: Supabase environment variables are not configured')
    return json(503, { ok: false, error: 'storage_unavailable' })
  }

  const headers = {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    'content-type': 'application/json',
  }

  try {
    if (!(await underHourlyLimit(supabaseUrl, headers))) {
      return json(429, { ok: false, error: 'rate_limited' })
    }

    const insert = await fetch(`${supabaseUrl}/rest/v1/guide_feedback`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ ...result.record, consent: true }),
    })
    if (!insert.ok) {
      console.error(`feedback: insert failed with status ${insert.status}`)
      return json(502, { ok: false, error: 'storage_failed' })
    }
  } catch {
    console.error('feedback: storage request failed')
    return json(502, { ok: false, error: 'storage_failed' })
  }

  return json(201, { ok: true })
}
