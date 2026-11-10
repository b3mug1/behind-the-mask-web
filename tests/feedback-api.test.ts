import { afterEach, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import handler from '../api/feedback.ts'
import { FEEDBACK_MIN_FILL_MS } from '../src/data/feedback.ts'

const ORIGIN = 'https://behind-the-mask-web.vercel.app'
const env = process.env as Record<string, string | undefined>

const valid = {
  usefulness: 'somewhat_useful',
  learning: 'no_not_really',
  intention: 'definitely',
  consent: true,
  website: '',
  elapsedMs: FEEDBACK_MIN_FILL_MS + 500,
}

type Call = { url: string; init: RequestInit }
let calls: Call[] = []
let fetchImpl: (url: string, init: RequestInit) => Response | Promise<Response> = () => new Response(null, { status: 201 })

const realFetch = globalThis.fetch

beforeEach(() => {
  calls = []
  env.SUPABASE_URL = 'https://example.supabase.co'
  env.SUPABASE_SECRET_KEY = 'test-secret'
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input)
    calls.push({ url, init: init ?? {} })
    return fetchImpl(url, init ?? {})
  }) as typeof fetch
})

afterEach(() => {
  globalThis.fetch = realFetch
  delete env.SUPABASE_URL
  delete env.SUPABASE_SECRET_KEY
  fetchImpl = () => new Response(null, { status: 201 })
})

function post(body: unknown, overrides: Record<string, string> = {}): Request {
  const raw = typeof body === 'string' ? body : JSON.stringify(body)
  return new Request(`${ORIGIN}/api/feedback`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: ORIGIN, ...overrides },
    body: raw,
  })
}

test('GET is not allowed', async () => {
  const response = await handler(new Request(`${ORIGIN}/api/feedback`, { method: 'GET' }))
  assert.equal(response.status, 405)
})

test('cross-origin requests are rejected before any storage call', async () => {
  const response = await handler(post(valid, { origin: 'https://evil.example' }))
  assert.equal(response.status, 403)
  assert.equal(calls.length, 0)
})

test('non-JSON content type is rejected', async () => {
  const response = await handler(post(valid, { 'content-type': 'text/plain' }))
  assert.equal(response.status, 415)
  assert.equal(calls.length, 0)
})

test('oversized bodies are rejected', async () => {
  const response = await handler(post({ ...valid, padding: 'x'.repeat(5000) }))
  assert.equal(response.status, 413)
  assert.equal(calls.length, 0)
})

test('malformed JSON is rejected', async () => {
  const response = await handler(post('{not json'))
  assert.equal(response.status, 400)
  assert.equal(calls.length, 0)
})

test('invalid values are rejected without contacting the database', async () => {
  const response = await handler(post({ ...valid, intention: 'maybe' }))
  assert.equal(response.status, 400)
  assert.equal((await response.json()).error, 'invalid_submission')
  assert.equal(calls.length, 0)
})

test('submissions without consent are never stored', async () => {
  const response = await handler(post({ ...valid, consent: false }))
  assert.equal(response.status, 400)
  assert.equal(calls.length, 0)
})

test('a valid submission is stored with only the allowlisted fields', async () => {
  fetchImpl = (url) => {
    if (url.includes('/rest/v1/guide_feedback?select=id')) {
      return new Response('[]', { status: 200, headers: { 'content-range': '0-0/3' } })
    }
    return new Response(null, { status: 201 })
  }
  const response = await handler(post(valid))
  assert.equal(response.status, 201)
  assert.deepEqual(await response.json(), { ok: true })

  const insert = calls.find((call) => call.url.endsWith('/rest/v1/guide_feedback') && call.init.method === 'POST')
  assert.ok(insert, 'insert request was made')
  assert.deepEqual(JSON.parse(String(insert.init.body)), {
    usefulness: 'somewhat_useful',
    learning: 'no_not_really',
    intention: 'definitely',
    consent: true,
  })
  const headers = insert.init.headers as Record<string, string>
  assert.equal(headers.Authorization, 'Bearer test-secret')
})

test('database failures return an error and never report success', async () => {
  fetchImpl = (url) => {
    if (url.includes('select=id')) return new Response('[]', { status: 200, headers: { 'content-range': '0-0/0' } })
    return new Response('boom', { status: 500 })
  }
  const response = await handler(post(valid))
  assert.equal(response.status, 502)
  assert.equal((await response.json()).ok, false)
})

test('network failures return an error and never report success', async () => {
  fetchImpl = () => {
    throw new TypeError('network down')
  }
  const response = await handler(post(valid))
  assert.equal(response.status, 502)
  assert.equal((await response.json()).ok, false)
})

test('missing server configuration fails closed', async () => {
  delete env.SUPABASE_SECRET_KEY
  const response = await handler(post(valid))
  assert.equal(response.status, 503)
  assert.equal(calls.length, 0)
})

test('global hourly ceiling blocks storage when reached', async () => {
  fetchImpl = (url) => {
    if (url.includes('select=id')) return new Response('[]', { status: 200, headers: { 'content-range': '0-0/500' } })
    return new Response(null, { status: 201 })
  }
  const response = await handler(post(valid))
  assert.equal(response.status, 429)
  assert.equal(calls.filter((call) => call.init.method === 'POST').length, 0)
})
