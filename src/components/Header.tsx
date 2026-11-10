import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { id: 'problem', label: 'The problem' },
  { id: 'code', label: 'The code' },
  { id: 'scenario', label: 'Your choices' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'research', label: 'Research' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-25% 0px -58% 0px' },
    )
    links.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <header className="site-header no-print">
      <div className="site-container header-inner">
        <a className="brand" href="#top" aria-label="Behind the Mask, back to top" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>BEHIND THE MASK<span className="brand-period">.</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(({ id, label }) => (
            <a key={id} className={active === id ? 'nav-link is-active' : 'nav-link'} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>
          ))}
        </nav>
        <a className="header-action" href="#code">Read the principles <span aria-hidden="true">↗</span></a>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>
      <nav id="mobile-menu" className={menuOpen ? 'mobile-nav is-open' : 'mobile-nav'} aria-label="Mobile navigation" hidden={!menuOpen}>
        {links.map(({ id, label }) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}
      </nav>
    </header>
  )
}
