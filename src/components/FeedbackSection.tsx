import { useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Send } from 'lucide-react'
import { feedbackQuestions, type FeedbackAnswers, type FeedbackKey } from '../data/feedback'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const emptyAnswers: FeedbackAnswers = { usefulness: '', learning: '', intention: '' }

export function FeedbackSection() {
  const [answers, setAnswers] = useState<FeedbackAnswers>(emptyAnswers)
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  // Honeypot: hidden from people, usually filled by simple bots.
  const [website, setWebsite] = useState('')
  // Captured when the form is shown; used only to reject instant automated submissions.
  const [startedAt] = useState(() => Date.now())
  // Synchronous lock: blocks repeated clicks before React re-renders the disabled button.
  const inFlight = useRef(false)

  const allAnswered = feedbackQuestions.every((question) => answers[question.key] !== '')
  const canSubmit = allAnswered && consent && status !== 'submitting' && status !== 'success'

  function choose(key: FeedbackKey, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }))
    if (status === 'error') setStatus('idle')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Guard against double clicks and Enter-key repeats before the first request finishes.
    if (!canSubmit || inFlight.current) return
    inFlight.current = true
    setStatus('submitting')

    const payload = {
      ...answers,
      consent: true,
      website,
      elapsedMs: Date.now() - startedAt,
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Feedback rejected: ${response.status}`)
      const body: unknown = await response.json()
      // Show success only when the server confirms the record was saved.
      if (typeof body === 'object' && body !== null && (body as { ok?: unknown }).ok === true) {
        setStatus('success')
      } else {
        inFlight.current = false
        setStatus('error')
      }
    } catch {
      inFlight.current = false
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section id="feedback" className="section feedback-section" aria-labelledby="feedback-title">
        <div className="site-container">
          <div className="feedback-shell feedback-thanks" role="status" aria-live="polite">
            <span className="section-index">YOUR FEEDBACK / SUBMITTED</span>
            <h2 id="feedback-title">THANK YOU<span>.</span></h2>
            <p>Your feedback has been submitted anonymously. Thank you for helping us make online communication more responsible.</p>
            <a className="button button-blue" href="#code"><ArrowLeft size={17} aria-hidden="true" /> Back to the Code</a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="feedback" className="section feedback-section" aria-labelledby="feedback-title">
      <div className="site-container">
        <div className="section-heading feedback-heading">
          <p className="section-index">07 / YOUR FEEDBACK</p>
          <h2 id="feedback-title">YOUR<br /><em>FEEDBACK.</em></h2>
          <p className="section-lead">Help us understand whether this guide is useful for students.</p>
          <p className="feedback-description">This short anonymous survey takes less than one minute. Your feedback helps us evaluate our Philosophy Social Project at Astana IT University.</p>
        </div>

        <form className="feedback-shell" onSubmit={submit} noValidate>
          <div className="feedback-consent-notice">
            <p>This anonymous feedback is collected for an educational Philosophy Social Project. Participation is voluntary. We do not ask for identifying information. Your answers will be analyzed only in aggregate.</p>
          </div>

          {feedbackQuestions.map((question, questionIndex) => (
            <fieldset className="feedback-question" key={question.key} disabled={status === 'submitting'}>
              <legend>
                <span className="feedback-number">{String(questionIndex + 1).padStart(2, '0')} / 03</span>
                {question.prompt}
              </legend>
              <div className="feedback-options">
                {question.options.map((option) => {
                  const selected = answers[question.key] === option.value
                  return (
                    <label key={option.value} className={selected ? 'feedback-option is-selected' : 'feedback-option'}>
                      <input
                        type="radio"
                        className="feedback-radio"
                        name={question.key}
                        value={option.value}
                        checked={selected}
                        onChange={() => choose(question.key, option.value)}
                      />
                      <span className="feedback-option-label">{option.label}</span>
                      <span className="option-indicator" aria-hidden="true" />
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}

          <div className="feedback-honeypot" aria-hidden="true">
            <label>
              Leave this field empty
              {/* Browser autofill fills fields named "website"/"url"; a neutral name avoids false spam rejections. */}
              <input type="text" name="contact_note" tabIndex={-1} autoComplete="new-password" value={website} onChange={(event) => setWebsite(event.target.value)} />
            </label>
          </div>

          <label className={consent ? 'feedback-consent is-checked' : 'feedback-consent'}>
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={status === 'submitting'} />
            <span className="feedback-check" aria-hidden="true">{consent && <Check size={14} strokeWidth={3} />}</span>
            <span>I voluntarily agree to submit my anonymous feedback for this research project.</span>
          </label>

          <div className="feedback-actions">
            <button type="submit" className="button button-blue" disabled={!canSubmit}>
              {status === 'submitting' ? 'Submitting...' : <><Send size={17} aria-hidden="true" /> Submit Anonymous Feedback</>}
            </button>
            <p className="feedback-status" role="status" aria-live="polite">
              {status === 'error' ? 'Your feedback could not be submitted. Please try again.' : ''}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}

