import { Eye, EyeOff } from 'lucide-react'

export function MaskVisual() {
  return (
    <div className="mask-stage" aria-hidden="true">
      <div className="mask-orbit mask-orbit-one" />
      <div className="mask-orbit mask-orbit-two" />
      <svg className="mask-art" viewBox="0 0 560 590" fill="none" role="presentation">
        {/* Visible: a human face with hair, a natural eye, and warm skin tones. */}
        <path d="M280 36C147 36 68 139 68 287c0 153 78 266 212 266V36Z" fill="#E7B89B" />
        <path d="M280 36C147 36 68 139 68 287c0 71 17 133 48 179-19-70-19-145-1-211 16-62 48-101 84-133 27 19 55 24 81 18V36Z" fill="#3D2B2A" />
        <path d="M280 140c-27 6-55 1-81-18-30 27-57 59-74 103 30-47 57-67 80-85 26 15 50 18 75 14v-14Z" fill="#BE8C70" />
        <path d="M164 244c24-13 51-13 75-2" stroke="#51362E" strokeWidth="12" strokeLinecap="round" />
        <path d="M163 278c22-24 57-24 80 0-24 20-58 20-80 0Z" fill="#FFFAF3" />
        <path d="M163 278c22-24 57-24 80 0" stroke="#704B3C" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="205" cy="276" rx="12" ry="15" fill="#617B76" />
        <ellipse cx="206" cy="277" rx="6" ry="9" fill="#172A2C" />
        <circle cx="209" cy="271" r="3" fill="#FFFAF3" />
        <path d="M269 295c-2 25-8 44-14 58-3 8 7 15 25 15" stroke="#B67D62" strokeWidth="5" strokeLinecap="round" />
        <path d="M232 412c17-9 33-10 48-6v22c-17 0-33-5-48-16Z" fill="#B86D65" />
        <path d="M232 412c16 3 32 4 48 2" stroke="#794A43" strokeWidth="3" strokeLinecap="round" />
        <path d="M255 470c8 3 16 4 25 4" stroke="#C68F74" strokeWidth="4" strokeLinecap="round" />

        {/* Hidden: the arched brow, moustache, smile, and goatee of an Anonymous mask. */}
        <path d="M280 36c133 0 212 103 212 251 0 153-78 266-212 266V36Z" fill="#F8FAFC" />
        <path d="M280 36c133 0 212 103 212 251 0 153-78 266-212 266v-24c113-10 187-111 187-245 0-131-65-225-187-248Z" fill="#BFDBFE" />
        <path d="M316 244c21-43 69-46 101-13-35-15-66-6-101 13Z" fill="#111827" />
        <path d="M319 280c25-26 62-23 87-3-28 13-58 17-87 3Z" fill="#111827" />
        <path d="M290 298c0 25 4 42 15 55-6 8-14 12-25 12" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="421" cy="342" rx="23" ry="16" fill="#E9A8A2" opacity=".65" />
        <path d="M282 389c17-25 33-22 52-8 23 17 44 14 64 3-12 26-42 33-68 17-21-13-32-13-48-3v-9Z" fill="#111827" />
        <path d="M282 429c57 18 107-4 137-43-14 49-75 79-137 61v-18Z" fill="#111827" />
        <path d="M282 429c46 12 91-4 119-27-29 32-72 45-119 32v-5Z" fill="#F8FAFC" />
        <path d="M282 464c13 10 25 10 38 1-3 27-16 54-38 69v-70Z" fill="#111827" />
        <path d="M280 36v517" stroke="#111827" strokeWidth="3" />
        <rect x="112" y="148" width="136" height="44" rx="6" fill="#111827" />
        <rect x="312" y="148" width="136" height="44" rx="6" fill="#111827" />
        <g fill="#F8FAFC" fontSize="20" fontWeight="800" letterSpacing="2" textAnchor="middle">
          <text x="180" y="177">VISIBLE</text>
          <text x="380" y="177">HIDDEN</text>
        </g>
        <path d="M80 185H16M477 409h68M29 459h73" stroke="#475569" strokeWidth="2" />
        <circle cx="16" cy="185" r="5" fill="#3B82F6" />
        <circle cx="545" cy="409" r="5" fill="#3B82F6" />
        <circle cx="29" cy="459" r="5" fill="#3B82F6" />
      </svg>
      <div className="mask-caption">
        <div className="mask-key mask-key-visible">
          <div className="mask-key-title"><Eye size={18} /><span>Visible</span></div>
          <span className="mask-key-description">The face others see</span>
        </div>
        <div className="mask-key mask-key-hidden">
          <div className="mask-key-title"><EyeOff size={18} /><span>Hidden</span></div>
          <span className="mask-key-description">The mask of anonymity</span>
        </div>
      </div>
      <div className="mask-coordinate">IDENTITY / 01</div>
    </div>
  )
}
