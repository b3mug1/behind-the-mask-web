import { Eye, EyeOff } from 'lucide-react'

export function MaskVisual() {
  return (
    <div className="mask-stage" aria-hidden="true">
      <div className="mask-orbit mask-orbit-one" />
      <div className="mask-orbit mask-orbit-two" />
      <svg className="mask-art" viewBox="0 0 560 590" fill="none" role="presentation">
        <path d="M280 36C147 36 68 139 68 287c0 153 78 266 212 266V36Z" fill="#F8FAFC" />
        <path d="M280 36c133 0 212 103 212 251 0 153-78 266-212 266V36Z" fill="#3B82F6" />
        <path d="M280 36v517" stroke="#111827" strokeWidth="2" />
        <rect x="112" y="148" width="136" height="44" rx="6" fill="#111827" />
        <rect x="312" y="148" width="136" height="44" rx="6" fill="#111827" />
        <g fill="#F8FAFC" fontSize="20" fontWeight="800" letterSpacing="2" textAnchor="middle">
          <text x="180" y="177">VISIBLE</text>
          <text x="380" y="177">HIDDEN</text>
        </g>
        <ellipse cx="205" cy="275" rx="24" ry="14" fill="#111827" />
        <ellipse cx="355" cy="275" rx="24" ry="14" fill="#111827" />
        <path d="M216 407h128" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
        <path d="M80 185H16M477 409h68M29 459h73" stroke="#475569" strokeWidth="2" />
        <circle cx="16" cy="185" r="5" fill="#3B82F6" />
        <circle cx="545" cy="409" r="5" fill="#3B82F6" />
        <circle cx="29" cy="459" r="5" fill="#3B82F6" />
      </svg>
      <div className="mask-caption">
        <div className="mask-key mask-key-visible">
          <div className="mask-key-title"><Eye size={18} /><span>Visible</span></div>
          <span className="mask-key-description">What others see</span>
        </div>
        <div className="mask-key mask-key-hidden">
          <div className="mask-key-title"><EyeOff size={18} /><span>Hidden</span></div>
          <span className="mask-key-description">What you keep within</span>
        </div>
      </div>
      <div className="mask-coordinate">IDENTITY / 01</div>
    </div>
  )
}
