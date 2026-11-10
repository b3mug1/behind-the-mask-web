import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FEEDBACK_MIN_FILL_MS, validateFeedbackSubmission } from '../src/data/feedback.ts'

const valid = {
  usefulness: 'very_useful',
  learning: 'yes_a_little',
  intention: 'probably',
  consent: true,
  website: '',
  elapsedMs: FEEDBACK_MIN_FILL_MS + 1000,
}

test('accepts a complete, consented submission', () => {
  const result = validateFeedbackSubmission(valid)
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.deepEqual(result.record, { usefulness: 'very_useful', learning: 'yes_a_little', intention: 'probably' })
  }
})

test('rejects submissions without consent', () => {
  assert.deepEqual(validateFeedbackSubmission({ ...valid, consent: false }), { ok: false, reason: 'consent_required' })
  const { consent: _omit, ...withoutConsent } = valid
  assert.equal(validateFeedbackSubmission(withoutConsent).ok, false)
})

test('rejects values outside the allowlist', () => {
  for (const field of ['usefulness', 'learning', 'intention'] as const) {
    const result = validateFeedbackSubmission({ ...valid, [field]: 'drop table' })
    assert.deepEqual(result, { ok: false, reason: 'invalid_answer' })
  }
})

test('rejects missing answers and non-string answers', () => {
  const { usefulness: _u, ...missing } = valid
  assert.equal(validateFeedbackSubmission(missing).ok, false)
  assert.equal(validateFeedbackSubmission({ ...valid, learning: 3 }).ok, false)
  assert.equal(validateFeedbackSubmission({ ...valid, intention: ['probably'] }).ok, false)
})

test('rejects unexpected fields such as names or emails', () => {
  assert.deepEqual(validateFeedbackSubmission({ ...valid, email: 'a@b.c' }), { ok: false, reason: 'unexpected_field' })
  assert.deepEqual(validateFeedbackSubmission({ ...valid, name: 'Aidar' }), { ok: false, reason: 'unexpected_field' })
})

test('rejects a filled honeypot field', () => {
  assert.deepEqual(validateFeedbackSubmission({ ...valid, website: 'http://spam.example' }), { ok: false, reason: 'spam_detected' })
})

test('rejects instant automated submissions and absurd timings', () => {
  assert.equal(validateFeedbackSubmission({ ...valid, elapsedMs: 10 }).ok, false)
  assert.equal(validateFeedbackSubmission({ ...valid, elapsedMs: Number.NaN }).ok, false)
  assert.equal(validateFeedbackSubmission({ ...valid, elapsedMs: 10 * 24 * 60 * 60 * 1000 }).ok, false)
})

test('rejects non-object bodies', () => {
  assert.equal(validateFeedbackSubmission(null).ok, false)
  assert.equal(validateFeedbackSubmission([valid]).ok, false)
  assert.equal(validateFeedbackSubmission('text').ok, false)
})
