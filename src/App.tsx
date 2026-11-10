import { useState } from 'react'
import { ArrowDown, ArrowRight, Check, Copy, Printer, Share2 } from 'lucide-react'
import { Header } from './components/Header'
import { MaskVisual } from './components/MaskVisual'
import { Reveal } from './components/Reveal'
import { ScenarioExperience } from './components/ScenarioExperience'
import { principles, team } from './data/content'

const problems = [
  { number: '01', heading: 'Online harassment', body: 'Someone is insulted in a group chat.' },
  { number: '02', heading: 'Misinformation', body: 'False information spreads without correction.' },
  { number: '03', heading: 'Privacy violations', body: 'An embarrassing photograph is shared without consent.' },
]

function PrintSheet() {
  return (
    <section className="print-sheet" aria-label="Printable five principles">
      <p className="print-kicker">BEHIND THE MASK / ASTANA IT UNIVERSITY</p>
      <h1>The Code.</h1>
      <p className="print-intro">Five principles for responsible online communication.</p>
      <div className="print-principles">
        {principles.map(({ number, heading, statement, explanation }) => (
          <div className="print-principle" key={number}>
            <span>{number}</span>
            <div><h2>{heading}</h2><strong>{statement}</strong><p>{explanation}</p></div>
          </div>
        ))}
      </div>
      <footer>Behind the Mask — Philosophy student project, Astana IT University</footer>
    </section>
  )
}

function App() {
  const [shareStatus, setShareStatus] = useState('')

  async function copyLink() {
    const url = window.location.href
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const input = document.createElement('textarea')
        input.value = url
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        const copied = document.execCommand('copy')
        input.remove()
        if (!copied) throw new Error('Copy unavailable')
      }
      setShareStatus('Link copied to clipboard.')
    } catch {
      setShareStatus('Copy is unavailable in this browser. You can copy the address from the address bar.')
    }
  }

  async function shareLink() {
    if (!navigator.share) {
      await copyLink()
      return
    }
    try {
      await navigator.share({ title: 'Behind the Mask', text: 'Five principles for responsible online communication.', url: window.location.href })
      setShareStatus('Share options opened.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      await copyLink()
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="screen-site">
        <Header />
        <main id="main">
          <section id="top" className="hero-section">
            <div className="site-container hero-grid">
              <div className="hero-copy">
                <p className="eyebrow"><span className="eyebrow-rule" /> ASTANA IT UNIVERSITY / PHILOSOPHY SOCIAL PROJECT</p>
                <h1>BEHIND<br />THE MASK<span className="hero-period">.</span></h1>
                <p className="hero-subtitle">THE MORALITY OF ANONYMITY</p>
                <div className="hero-divider" />
                <h2>Does anonymity change who we are — or simply reveal who we choose to be?</h2>
                <p className="hero-description">A student-led initiative exploring moral responsibility, digital identity, and respectful communication in online spaces.</p>
                <div className="hero-actions">
                  <a className="button button-blue" href="#code">Explore the Code <ArrowRight size={18} aria-hidden="true" /></a>
                  <a className="button button-outline" href="#scenario">Test Your Choices <ArrowRight size={18} aria-hidden="true" /></a>
                </div>
              </div>
              <MaskVisual />
            </div>
            <a className="scroll-cue" href="#problem">SCROLL TO EXPLORE <ArrowDown size={15} aria-hidden="true" /></a>
          </section>

          <section id="problem" className="section problem-section">
            <div className="site-container">
              <Reveal className="section-heading problem-heading">
                <p className="section-index">01 / THE PROBLEM</p>
                <h2>WHEN NO ONE<br /><em>KNOWS YOUR NAME.</em></h2>
                <div className="problem-intro">
                  <p>Anonymity can protect privacy, allow honest expression, and give people room to speak.</p>
                  <p>It can also make insults, false claims, and privacy violations feel easier when accountability seems distant.</p>
                </div>
              </Reveal>
              <div className="problem-list">
                {problems.map(({ number, heading, body }) => (
                  <Reveal className="problem-row" key={number}>
                    <span className="problem-number">{number}</span>
                    <h3>{heading}</h3>
                    <p>{body}</p>
                    <span className="problem-cross" aria-hidden="true">+</span>
                  </Reveal>
                ))}
              </div>
              <Reveal className="problem-conclusion">Being anonymous is not the same as being irresponsible<span>.</span></Reveal>
            </div>
          </section>

          <section id="code" className="section principles-section">
            <div className="site-container">
              <Reveal className="principles-header">
                <div><p className="section-index">02 / A PRACTICAL GUIDE</p><h2>THE CODE<span>.</span></h2><p>Five principles for responsible online communication.</p></div>
                <button className="button print-button" type="button" onClick={() => window.print()}><Printer size={17} aria-hidden="true" /> Print the Code</button>
              </Reveal>
              <div className="principle-list">
                {principles.map(({ number, heading, statement, explanation, example, Icon }) => (
                  <Reveal className="principle-row" key={number}>
                    <div className="principle-number">{number}</div>
                    <div className="principle-main"><p className="principle-heading">{heading}</p><h3>{statement}</h3><p className="principle-explanation">{explanation}</p></div>
                    <div className="principle-side"><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><p><span>IN PRACTICE</span>{example}</p></div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section id="scenario" className="section scenario-section">
            <div className="site-container">
              <Reveal className="section-heading"><p className="section-index">03 / YOUR CHOICES</p><h2>WHAT WOULD<br /><em>YOU DO?</em></h2><p className="section-lead">Three situations. No grades, no moral score, and no answers sent anywhere.</p></Reveal>
              <Reveal><ScenarioExperience /></Reveal>
            </div>
          </section>

          <section id="philosophy" className="section philosophy-section">
            <div className="site-container">
              <Reveal className="section-heading"><p className="section-index">04 / THE PHILOSOPHY</p><h2>TWO PHILOSOPHERS.<br /><em>ONE QUESTION.</em></h2></Reveal>
              <div className="philosophy-grid">
                <Reveal className="philosopher"><div className="philosopher-top"><span>01 / EXTERNAL ORDER</span><span aria-hidden="true">↗</span></div><h3>Thomas<br />Hobbes</h3><p>Shared rules and social authority help maintain order.</p><div className="philosopher-application"><span>OUR CONNECTION</span><p>Clear group rules and fair moderation can discourage harm when people feel less accountable.</p></div></Reveal>
                <Reveal className="philosopher"><div className="philosopher-top"><span>02 / INNER DUTY</span><span aria-hidden="true">↗</span></div><h3>Immanuel<br />Kant</h3><p>Moral duties should guide actions regardless of observation or punishment.</p><div className="philosopher-application"><span>OUR CONNECTION</span><p>We should respect others even when nobody knows who we are.</p></div></Reveal>
              </div>
              <Reveal className="philosophy-conclusion">Hobbes reminds us why <strong>rules</strong> matter. Kant reminds us why <strong>principles</strong> matter.</Reveal>
              <p className="source-note">These are contemporary applications of their ideas, not claims that either philosopher wrote about the internet. <a href="https://www.gutenberg.org/files/3207/3207-h/3207-h.htm" target="_blank" rel="noopener noreferrer">Hobbes, <em>Leviathan</em></a> · <a href="https://www.gutenberg.org/files/5682/5682-h/5682-h.htm" target="_blank" rel="noopener noreferrer">Kant, <em>Groundwork</em></a></p>
            </div>
          </section>

          <section id="research" className="section research-section">
            <div className="site-container research-grid">
              <Reveal className="research-copy"><p className="section-index">05 / OUR RESEARCH</p><h2>WHAT WE<br /><em>OBSERVED.</em></h2><p>We compared real answers to the same online ethics questions in two voluntary surveys. Four submissions without consent were excluded.</p><div className="research-counts"><div><strong>22</strong><span>consenting participants</span></div><div><strong>12</strong><span>anonymous</span></div><div><strong>10</strong><span>identified</span></div></div></Reveal>
              <Reveal className="research-figure"><p className="figure-kicker">WHEN SOMEONE WAS INSULTED ONLINE</p><h3>Who said they would intervene?</h3><div className="research-bar"><div className="bar-label"><span>Anonymous</span><strong>50%</strong></div><div className="bar-track"><div style={{ width: '50%' }} /></div><p>6 of 12 selected reporting the messages.</p></div><div className="research-bar"><div className="bar-label"><span>Identified</span><strong>90%</strong></div><div className="bar-track"><div style={{ width: '90%' }} /></div><p>9 of 10 selected reporting or defending the person.</p></div><p className="research-disclosure">These are real responses to “what would you do?” questions. They do not show that anonymity caused different behavior or record actions taken in real events.</p></Reveal>
            </div>
          </section>

          <section id="takeaway" className="section closing-section">
            <div className="site-container">
              <Reveal><p className="section-index">06 / THE TAKEAWAY</p><h2>THE MASK HIDES<br />YOUR NAME.<br /><em>NOT YOUR<br className="mobile-only" /> RESPONSIBILITY.</em></h2><p>Responsible communication starts with small choices: showing respect, checking information, protecting privacy, and correcting mistakes.</p></Reveal>
              <div className="closing-actions no-print"><button className="button button-blue" type="button" onClick={shareLink}><Share2 size={17} aria-hidden="true" /> Share the Code</button><button className="button button-outline" type="button" onClick={copyLink}>{shareStatus.startsWith('Link copied') ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />} Copy page link</button></div>
              <p className="share-status" role="status" aria-live="polite">{shareStatus}</p>
            </div>
          </section>
        </main>
        <footer className="site-footer">
          <div className="site-container footer-grid"><div><p className="footer-brand">BEHIND THE MASK<span>.</span></p><p>The Morality of Anonymity<br />Astana IT University · Philosophy Endterm Social Project</p><p className="footer-note">Created as an educational student initiative.</p></div><div><p className="footer-label">THE TEAM</p><ul>{team.map((member) => <li key={member}>{member}</li>)}</ul></div><div className="footer-back"><a href="#top">Back to top ↑</a></div></div>
        </footer>
      </div>
      <PrintSheet />
    </>
  )
}

export default App
