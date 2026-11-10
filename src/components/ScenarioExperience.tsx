import { useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { scenarios } from '../data/content'

export function ScenarioExperience() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const complete = index === scenarios.length
  const scenario = scenarios[index]
  const choice = scenario?.options.find((option) => option.id === selected)

  function goNext() {
    if (!selected) return
    setIndex((current) => current + 1)
    setSelected(null)
  }

  function goBack() {
    setIndex((current) => Math.max(0, current - 1))
    setSelected(null)
  }

  function restart() {
    setIndex(0)
    setSelected(null)
  }

  return (
    <div className="scenario-shell">
      {complete ? (
        <div className="scenario-finish" aria-live="polite">
          <span className="section-index">REFLECTION COMPLETE / 03</span>
          <h3>Your identity may be hidden.<br /><em>Your choices still matter.</em></h3>
          <p>There is no score here. The point is to pause, notice who may be affected, and choose a response you can stand behind.</p>
          <button type="button" className="button button-blue" onClick={restart}><RotateCcw size={17} aria-hidden="true" /> Try Again</button>
          <a className="button button-outline" href="#feedback">Help Us Evaluate This Guide</a>
        </div>
      ) : (
        <>
          <div className="scenario-topline">
            <span className="section-index">SCENARIO {String(index + 1).padStart(2, '0')} / 03</span>
            <span className="scenario-category">{scenario.category}</span>
          </div>
          <div className="scenario-progress" aria-label={`Scenario ${index + 1} of ${scenarios.length}`}>
            {scenarios.map((item, position) => <span key={item.id} className={position <= index ? 'is-current' : ''} />)}
          </div>
          <div className="scenario-columns">
            <div className="scenario-prompt">
              <h3>{scenario.title}</h3>
              <p>{scenario.message}</p>
              <span className="scenario-aside">No moral score. No answers are saved.</span>
            </div>
            <div className="scenario-controls">
              <p className="scenario-question">What would you do?</p>
              <div className="scenario-options">
                {scenario.options.map((option, optionIndex) => (
                  <button
                    key={option.id}
                    type="button"
                    className={selected === option.id ? 'scenario-option is-selected' : 'scenario-option'}
                    aria-pressed={selected === option.id}
                    onClick={() => setSelected(option.id)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                    <span>{option.label}</span>
                    <span className="option-indicator" aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div className="scenario-feedback" aria-live="polite" aria-atomic="true">
                {choice ? (
                  <><span className="feedback-label">A WAY TO THINK ABOUT IT</span><p>{choice.feedback}</p><p className="feedback-reflection">{scenario.reflection}</p></>
                ) : <p className="feedback-placeholder">Choose a response to explore its consequences.</p>}
              </div>
              <div className="scenario-actions">
                {index > 0 && <button type="button" className="text-button" onClick={goBack}><ArrowLeft size={16} aria-hidden="true" /> Previous</button>}
                <button type="button" className="button button-blue" disabled={!selected} onClick={goNext}>{index === scenarios.length - 1 ? 'See reflection' : 'Next scenario'} <ArrowRight size={17} aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
