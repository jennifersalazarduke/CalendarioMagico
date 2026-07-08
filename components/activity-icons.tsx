"use client"

// Activity icons as SVG components - designed for children
// Using simple, friendly shapes with bright colors

interface IconProps {
  className?: string
}

export const ActivityIcons: Record<string, React.FC<IconProps>> = {
  // Morning routine
  bed: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="28" width="48" height="24" rx="4" fill="#F48FB1" />
      <rect x="12" y="20" width="16" height="12" rx="6" fill="#EC407A" />
      <rect x="36" y="20" width="16" height="12" rx="6" fill="#EC407A" />
      <rect x="4" y="48" width="56" height="8" rx="4" fill="#E1BEE7" />
      <circle cx="32" cy="32" r="4" fill="#FFE082" />
    </svg>
  ),
  "glass-water": ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <path d="M16 12 L20 52 H44 L48 12 Z" fill="#B3E5FC" stroke="#4FC3F7" strokeWidth="3" />
      <ellipse cx="32" cy="12" rx="16" ry="4" fill="#E1F5FE" />
      <path d="M20 28 Q32 36 44 28" stroke="#4FC3F7" strokeWidth="2" fill="none" />
    </svg>
  ),
  toilet: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="36" rx="16" ry="12" fill="#E1BEE7" />
      <rect x="24" y="12" width="16" height="20" rx="8" fill="#F3E5F5" />
      <ellipse cx="32" cy="36" rx="10" ry="6" fill="#CE93D8" />
    </svg>
  ),
  shower: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="16" r="10" fill="#90CAF9" />
      <rect x="28" y="24" width="8" height="8" fill="#64B5F6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={20 + i * 6} cy={44 + (i % 2) * 4} rx="3" ry="5" fill="#4FC3F7" />
      ))}
    </svg>
  ),
  shirt: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <path d="M20 12 L12 20 L18 24 L18 52 L46 52 L46 24 L52 20 L44 12 L38 18 L26 18 L20 12 Z" fill="#F48FB1" />
      <path d="M26 18 L32 24 L38 18" stroke="#EC407A" strokeWidth="2" fill="none" />
      <circle cx="32" cy="36" r="3" fill="#FFE082" />
      <circle cx="32" cy="46" r="3" fill="#FFE082" />
    </svg>
  ),
  brush: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="16" rx="12" ry="8" fill="#8D6E63" />
      <rect x="28" y="22" width="8" height="32" rx="4" fill="#FFCC80" />
      {[-8, -4, 0, 4, 8].map((x) => (
        <rect key={x} x={28 + x} y="8" width="2" height="12" rx="1" fill="#5D4037" />
      ))}
    </svg>
  ),
  breakfast: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="44" rx="20" ry="8" fill="#FFCC80" />
      <circle cx="24" cy="36" r="8" fill="#FFE082" />
      <circle cx="40" cy="36" r="8" fill="#FFE082" />
      <circle cx="24" cy="36" r="4" fill="#FFF59D" />
      <circle cx="40" cy="36" r="4" fill="#FFF59D" />
      <rect x="44" y="28" width="12" height="8" rx="2" fill="#A1887F" />
    </svg>
  ),
  teeth: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <rect x="24" y="8" width="16" height="40" rx="6" fill="#4FC3F7" />
      <rect x="28" y="44" width="8" height="12" rx="2" fill="#81D4FA" />
      <rect x="26" y="12" width="12" height="6" rx="2" fill="#B3E5FC" />
      <ellipse cx="32" cy="56" rx="8" ry="4" fill="#E1F5FE" />
    </svg>
  ),
  backpack: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <rect x="16" y="16" width="32" height="40" rx="8" fill="#F48FB1" />
      <rect x="20" y="24" width="24" height="16" rx="4" fill="#EC407A" />
      <path d="M24 16 Q24 8 32 8 Q40 8 40 16" stroke="#E1BEE7" strokeWidth="4" fill="none" />
      <circle cx="32" cy="32" r="4" fill="#FFE082" />
    </svg>
  ),
  school: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <rect x="12" y="28" width="40" height="28" fill="#F48FB1" />
      <polygon points="32,8 8,28 56,28" fill="#EC407A" />
      <rect x="26" y="40" width="12" height="16" fill="#FFCC80" />
      <rect x="16" y="32" width="8" height="8" fill="#81D4FA" />
      <rect x="40" y="32" width="8" height="8" fill="#81D4FA" />
      <circle cx="32" cy="20" r="4" fill="#FFE082" />
    </svg>
  ),

  // Afternoon routine
  home: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <rect x="16" y="32" width="32" height="24" fill="#FFCC80" />
      <polygon points="32,8 8,32 56,32" fill="#F48FB1" />
      <rect x="26" y="40" width="12" height="16" fill="#A1887F" />
      <rect x="18" y="36" width="8" height="8" fill="#81D4FA" />
      <rect x="38" y="36" width="8" height="8" fill="#81D4FA" />
      <circle cx="35" cy="48" r="2" fill="#FFE082" />
    </svg>
  ),
  lunch: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="44" rx="24" ry="10" fill="#E1BEE7" />
      <ellipse cx="32" cy="40" rx="20" ry="8" fill="#FFCC80" />
      <circle cx="24" cy="36" r="6" fill="#EF5350" />
      <circle cx="36" cy="34" r="8" fill="#8BC34A" />
      <ellipse cx="40" cy="40" rx="6" ry="4" fill="#FF8A65" />
    </svg>
  ),
  clothes: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <path d="M20 16 L16 24 L24 24 L24 52 L40 52 L40 24 L48 24 L44 16 L36 20 L28 20 L20 16 Z" fill="#81D4FA" />
      <rect x="16" y="36" width="32" height="20" rx="4" fill="#7986CB" />
      <rect x="26" y="52" width="4" height="4" fill="#5C6BC0" />
      <rect x="34" y="52" width="4" height="4" fill="#5C6BC0" />
    </svg>
  ),
  dog: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="40" rx="16" ry="12" fill="#A1887F" />
      <circle cx="32" cy="28" r="12" fill="#BCAAA4" />
      <ellipse cx="18" cy="20" rx="6" ry="8" fill="#8D6E63" />
      <ellipse cx="46" cy="20" rx="6" ry="8" fill="#8D6E63" />
      <circle cx="28" cy="26" r="3" fill="#3E2723" />
      <circle cx="36" cy="26" r="3" fill="#3E2723" />
      <ellipse cx="32" cy="32" rx="4" ry="3" fill="#3E2723" />
      <path d="M28 36 Q32 40 36 36" stroke="#5D4037" strokeWidth="2" fill="none" />
    </svg>
  ),
  play: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="16" width="32" height="24" rx="4" fill="#7986CB" />
      <rect x="12" y="20" width="24" height="16" rx="2" fill="#9FA8DA" />
      <rect x="8" y="40" width="32" height="8" rx="2" fill="#5C6BC0" />
      <circle cx="52" cy="24" r="8" fill="#FFE082" />
      <circle cx="52" cy="40" r="6" fill="#F48FB1" />
      <polygon points="18,26 18,32 24,29" fill="#FFCC80" />
    </svg>
  ),
  snack: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="48" rx="18" ry="8" fill="#FFCC80" />
      <path d="M16 32 Q32 16 48 32" fill="#FF8A65" />
      <circle cx="24" cy="28" r="4" fill="#EF5350" />
      <circle cx="36" cy="24" r="3" fill="#8BC34A" />
      <circle cx="40" cy="30" r="3" fill="#FFC107" />
      <rect x="28" y="40" width="8" height="12" rx="2" fill="#FFF59D" />
    </svg>
  ),

  // Night routine
  dinner: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="44" rx="22" ry="10" fill="#B39DDB" />
      <ellipse cx="32" cy="40" rx="18" ry="8" fill="#FFCC80" />
      <ellipse cx="28" cy="36" rx="6" ry="4" fill="#FF8A65" />
      <ellipse cx="38" cy="38" rx="8" ry="4" fill="#AED581" />
      <rect x="8" y="32" width="4" height="20" rx="1" fill="#90A4AE" />
      <rect x="52" y="32" width="4" height="20" rx="1" fill="#90A4AE" />
    </svg>
  ),
  pajamas: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <path d="M20 16 L16 24 L22 24 L22 52 L42 52 L42 24 L48 24 L44 16 L36 20 L28 20 L20 16 Z" fill="#CE93D8" />
      <rect x="22" y="36" width="20" height="16" rx="4" fill="#E1BEE7" />
      <circle cx="28" cy="28" r="3" fill="#FFE082" />
      <circle cx="36" cy="28" r="3" fill="#FFE082" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={28 + i * 4} cy={44} r="2" fill="#F48FB1" />
      ))}
    </svg>
  ),
  pray: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="20" r="12" fill="#FFCC80" />
      <ellipse cx="32" cy="44" rx="12" ry="16" fill="#E1BEE7" />
      <path d="M24 40 L32 48 L40 40" fill="#CE93D8" />
      <circle cx="28" cy="18" r="2" fill="#5D4037" />
      <circle cx="36" cy="18" r="2" fill="#5D4037" />
      <path d="M28 24 Q32 28 36 24" stroke="#D7CCC8" strokeWidth="2" fill="none" />
      {[-12, 12].map((x) => (
        <path key={x} d={`M${32 + x} 8 L${32 + x} 0`} stroke="#FFE082" strokeWidth="2" />
      ))}
      <path d="M32 0 L32 8" stroke="#FFE082" strokeWidth="3" />
    </svg>
  ),
  sleep: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="32" width="48" height="24" rx="4" fill="#7986CB" />
      <ellipse cx="24" cy="36" rx="12" ry="8" fill="#9FA8DA" />
      <circle cx="24" cy="28" r="10" fill="#FFCC80" />
      <path d="M20 28 Q24 24 28 28" stroke="#5D4037" strokeWidth="2" fill="none" />
      <text x="44" y="24" fontSize="16" fill="#FFE082" fontWeight="bold">Z</text>
      <text x="50" y="18" fontSize="12" fill="#FFE082" fontWeight="bold">z</text>
      <text x="54" y="14" fontSize="8" fill="#FFE082" fontWeight="bold">z</text>
    </svg>
  ),

  // Rewards
  cake: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <rect x="12" y="32" width="40" height="24" rx="4" fill="#F48FB1" />
      <rect x="16" y="28" width="32" height="8" rx="2" fill="#FFE082" />
      <rect x="20" y="24" width="24" height="8" rx="2" fill="#E1BEE7" />
      <rect x="30" y="12" width="4" height="16" fill="#FFCC80" />
      <ellipse cx="32" cy="10" rx="4" ry="6" fill="#FF8A65" />
    </svg>
  ),
  game: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="20" width="48" height="28" rx="8" fill="#7986CB" />
      <circle cx="20" cy="34" r="8" fill="#5C6BC0" />
      <rect x="16" y="32" width="8" height="4" rx="1" fill="#9FA8DA" />
      <rect x="18" y="30" width="4" height="8" rx="1" fill="#9FA8DA" />
      <circle cx="40" cy="30" r="4" fill="#EF5350" />
      <circle cx="48" cy="34" r="4" fill="#4CAF50" />
      <circle cx="44" cy="38" r="4" fill="#FFE082" />
    </svg>
  ),
  movie: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="16" width="48" height="32" rx="4" fill="#424242" />
      <rect x="12" y="20" width="40" height="24" rx="2" fill="#90CAF9" />
      <polygon points="28,28 28,40 40,34" fill="#FFFFFF" />
      <rect x="8" y="12" width="8" height="8" fill="#FFE082" />
      <rect x="48" y="12" width="8" height="8" fill="#FFE082" />
      <rect x="8" y="44" width="8" height="8" fill="#FFE082" />
      <rect x="48" y="44" width="8" height="8" fill="#FFE082" />
    </svg>
  ),
  heart: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <path d="M32 56 C16 44 8 32 8 22 C8 12 16 8 24 8 C28 8 32 12 32 12 C32 12 36 8 40 8 C48 8 56 12 56 22 C56 32 48 44 32 56 Z" fill="#EC407A" />
      <path d="M20 20 Q24 16 28 20" stroke="#F48FB1" strokeWidth="3" fill="none" />
    </svg>
  ),
  star: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <polygon points="32,4 38,24 58,24 42,38 48,58 32,46 16,58 22,38 6,24 26,24" fill="#FFE082" />
      <polygon points="32,12 36,24 48,24 38,32 42,44 32,36 22,44 26,32 16,24 28,24" fill="#FFF59D" />
    </svg>
  ),

  // Routine icons
  sun: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="14" fill="#FFE082" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={32 + Math.cos((angle * Math.PI) / 180) * 18}
          y1={32 + Math.sin((angle * Math.PI) / 180) * 18}
          x2={32 + Math.cos((angle * Math.PI) / 180) * 26}
          y2={32 + Math.sin((angle * Math.PI) / 180) * 26}
          stroke="#FFE082"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
    </svg>
  ),
  "cloud-sun": ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <circle cx="20" cy="24" r="10" fill="#FFE082" />
      <ellipse cx="36" cy="40" rx="20" ry="12" fill="#E1BEE7" />
      <circle cx="28" cy="36" r="10" fill="#F3E5F5" />
      <circle cx="44" cy="38" r="8" fill="#F3E5F5" />
    </svg>
  ),
  moon: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <path d="M40 8 C28 12 20 24 20 38 C20 52 32 60 46 56 C34 56 26 44 26 32 C26 20 34 10 40 8 Z" fill="#B39DDB" />
      <circle cx="36" cy="20" r="2" fill="#FFE082" />
      <circle cx="48" cy="28" r="2" fill="#FFE082" />
      <circle cx="44" cy="40" r="2" fill="#FFE082" />
    </svg>
  ),
}

// Helper to get icon by name
export function getActivityIcon(iconName: string): React.FC<IconProps> {
  return ActivityIcons[iconName] || ActivityIcons.star
}

// List of available icons for the reward editor
export const availableIcons = [
  "star", "heart", "cake", "game", "movie",
  "dog", "play", "snack", "sun", "moon",
  "gift", "trophy", "balloon", "rainbow", "unicorn"
]

// Additional reward icons
ActivityIcons.gift = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect x="12" y="28" width="40" height="28" rx="4" fill="#F48FB1" />
    <rect x="8" y="20" width="48" height="12" rx="4" fill="#EC407A" />
    <rect x="28" y="20" width="8" height="36" fill="#FFE082" />
    <path d="M32 20 Q24 8 16 16 Q24 20 32 20" fill="#E1BEE7" />
    <path d="M32 20 Q40 8 48 16 Q40 20 32 20" fill="#E1BEE7" />
  </svg>
)

ActivityIcons.trophy = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="52" rx="14" ry="4" fill="#A1887F" />
    <rect x="28" y="44" width="8" height="12" fill="#BCAAA4" />
    <path d="M16 12 L16 28 Q16 40 32 44 Q48 40 48 28 L48 12 Z" fill="#FFE082" />
    <path d="M16 20 Q8 20 8 28 Q8 36 16 36" fill="#FFF59D" />
    <path d="M48 20 Q56 20 56 28 Q56 36 48 36" fill="#FFF59D" />
    <circle cx="32" cy="28" r="6" fill="#FFC107" />
    <text x="29" y="32" fontSize="10" fill="#FF8F00" fontWeight="bold">1</text>
  </svg>
)

ActivityIcons.balloon = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="24" rx="14" ry="18" fill="#F48FB1" />
    <polygon points="32,42 28,48 36,48" fill="#EC407A" />
    <path d="M32 48 Q28 54 32 60" stroke="#A1887F" strokeWidth="2" fill="none" />
    <ellipse cx="26" cy="18" rx="4" ry="6" fill="#FCE4EC" opacity="0.6" />
  </svg>
)

ActivityIcons.rainbow = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <path d="M8 48 Q8 16 32 16 Q56 16 56 48" stroke="#EF5350" strokeWidth="6" fill="none" />
    <path d="M14 48 Q14 22 32 22 Q50 22 50 48" stroke="#FF9800" strokeWidth="5" fill="none" />
    <path d="M20 48 Q20 28 32 28 Q44 28 44 48" stroke="#FFEB3B" strokeWidth="4" fill="none" />
    <path d="M25 48 Q25 33 32 33 Q39 33 39 48" stroke="#4CAF50" strokeWidth="4" fill="none" />
    <path d="M29 48 Q29 37 32 37 Q35 37 35 48" stroke="#2196F3" strokeWidth="3" fill="none" />
    <circle cx="12" cy="52" r="6" fill="#E1BEE7" />
    <circle cx="52" cy="52" r="6" fill="#E1BEE7" />
  </svg>
)

ActivityIcons.unicorn = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="40" rx="18" ry="14" fill="#F3E5F5" />
    <circle cx="24" cy="32" r="12" fill="#FCE4EC" />
    <polygon points="24,8 20,24 28,24" fill="#FFE082" />
    <circle cx="20" cy="30" r="2" fill="#5D4037" />
    <ellipse cx="16" cy="26" rx="4" ry="6" fill="#F48FB1" />
    <path d="M48 36 Q56 32 52 44" stroke="#E1BEE7" strokeWidth="4" fill="none" />
    <path d="M28 24 Q32 20 36 24" fill="#CE93D8" />
    <ellipse cx="48" cy="48" rx="4" ry="6" fill="#F3E5F5" />
  </svg>
)

// Additional activity icons
ActivityIcons.homework = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect x="12" y="8" width="40" height="48" rx="4" fill="#E3F2FD" />
    <rect x="16" y="16" width="28" height="4" rx="2" fill="#90CAF9" />
    <rect x="16" y="24" width="24" height="4" rx="2" fill="#90CAF9" />
    <rect x="16" y="32" width="20" height="4" rx="2" fill="#90CAF9" />
    <rect x="16" y="40" width="16" height="4" rx="2" fill="#90CAF9" />
    <path d="M44 32 L52 24 L56 28 L48 36 L44 36 Z" fill="#FFE082" />
    <rect x="54" y="22" width="4" height="8" rx="1" transform="rotate(45 56 26)" fill="#F48FB1" />
  </svg>
)

ActivityIcons.book = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect x="10" y="12" width="44" height="40" rx="4" fill="#81D4FA" />
    <rect x="14" y="16" width="36" height="32" rx="2" fill="#E3F2FD" />
    <rect x="30" y="12" width="4" height="40" fill="#4FC3F7" />
    <rect x="18" y="24" width="10" height="3" rx="1" fill="#90CAF9" />
    <rect x="18" y="30" width="8" height="3" rx="1" fill="#90CAF9" />
    <rect x="36" y="24" width="10" height="3" rx="1" fill="#90CAF9" />
    <rect x="36" y="30" width="8" height="3" rx="1" fill="#90CAF9" />
  </svg>
)

ActivityIcons.toys = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <circle cx="20" cy="44" r="12" fill="#F48FB1" />
    <rect x="32" y="32" width="20" height="20" rx="4" fill="#81D4FA" />
    <polygon points="32,8 20,28 44,28" fill="#FFE082" />
    <circle cx="20" cy="44" r="6" fill="#EC407A" />
    <rect x="38" y="38" width="8" height="8" rx="2" fill="#4FC3F7" />
  </svg>
)

ActivityIcons.hands = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="40" rx="20" ry="16" fill="#BBDEFB" />
    <path d="M24 24 L24 40" stroke="#FFCC80" strokeWidth="8" strokeLinecap="round" />
    <path d="M32 20 L32 36" stroke="#FFCC80" strokeWidth="8" strokeLinecap="round" />
    <path d="M40 24 L40 40" stroke="#FFCC80" strokeWidth="8" strokeLinecap="round" />
    <ellipse cx="32" cy="48" rx="12" ry="8" fill="#4FC3F7" />
    <ellipse cx="32" cy="46" rx="8" ry="4" fill="#E1F5FE" />
  </svg>
)

ActivityIcons.cat = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="40" rx="16" ry="12" fill="#BDBDBD" />
    <circle cx="32" cy="28" r="14" fill="#E0E0E0" />
    <polygon points="20,18 16,6 24,16" fill="#9E9E9E" />
    <polygon points="44,18 48,6 40,16" fill="#9E9E9E" />
    <circle cx="26" cy="26" r="3" fill="#4CAF50" />
    <circle cx="38" cy="26" r="3" fill="#4CAF50" />
    <circle cx="26" cy="26" r="1.5" fill="#1B5E20" />
    <circle cx="38" cy="26" r="1.5" fill="#1B5E20" />
    <ellipse cx="32" cy="32" rx="2" ry="1.5" fill="#F48FB1" />
    <path d="M30 34 L28 38" stroke="#757575" strokeWidth="1" />
    <path d="M34 34 L36 38" stroke="#757575" strokeWidth="1" />
    <path d="M32 34 L32 36" stroke="#757575" strokeWidth="1" />
  </svg>
)

ActivityIcons.plant = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect x="20" y="40" width="24" height="20" rx="4" fill="#A1887F" />
    <ellipse cx="32" cy="42" rx="10" ry="4" fill="#8D6E63" />
    <path d="M32 40 L32 24" stroke="#4CAF50" strokeWidth="4" />
    <ellipse cx="24" cy="28" rx="8" ry="6" fill="#66BB6A" transform="rotate(-30 24 28)" />
    <ellipse cx="40" cy="24" rx="8" ry="6" fill="#81C784" transform="rotate(30 40 24)" />
    <ellipse cx="32" cy="16" rx="6" ry="8" fill="#A5D6A7" />
    <ellipse cx="20" cy="36" rx="6" ry="4" fill="#4CAF50" transform="rotate(-20 20 36)" />
  </svg>
)

// New activity icons — body, learning & night routines
ActivityIcons.sports = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="22" fill="#FFFFFF" stroke="#5D4037" strokeWidth="2" />
    <polygon points="32,22 41,29 38,40 26,40 23,29" fill="#5D4037" />
    <path d="M32 22 L32 10 M41 29 L53 26 M38 40 L46 50 M26 40 L18 50 M23 29 L11 26" stroke="#5D4037" strokeWidth="2" />
    <circle cx="24" cy="18" r="4" fill="#FCE4EC" opacity="0.7" />
  </svg>
)

ActivityIcons.vitamins = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect x="14" y="20" width="24" height="34" rx="6" fill="#FFE082" />
    <rect x="14" y="12" width="24" height="10" rx="3" fill="#F48FB1" />
    <rect x="19" y="30" width="14" height="14" rx="2" fill="#FFF8E1" />
    <path d="M26 32 L26 42 M21 37 L31 37" stroke="#EC407A" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="48" cy="44" rx="8" ry="5" transform="rotate(-30 48 44)" fill="#B39DDB" />
    <path d="M44 46 L52 41" stroke="#FFFFFF" strokeWidth="2" />
  </svg>
)

ActivityIcons["wash-face"] = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="34" r="18" fill="#FFCCBC" />
    <circle cx="26" cy="30" r="2" fill="#5D4037" />
    <circle cx="38" cy="30" r="2" fill="#5D4037" />
    <path d="M27 40 Q32 44 37 40" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="14" cy="18" r="5" fill="#B3E5FC" opacity="0.9" />
    <circle cx="50" cy="14" r="4" fill="#B3E5FC" opacity="0.9" />
    <circle cx="44" cy="22" r="3" fill="#E1F5FE" />
    <circle cx="20" cy="10" r="3" fill="#E1F5FE" />
    <circle cx="52" cy="26" r="2" fill="#B3E5FC" />
  </svg>
)

ActivityIcons.english = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect x="6" y="12" width="30" height="22" rx="6" fill="#81D4FA" />
    <polygon points="14,34 14,42 22,34" fill="#81D4FA" />
    <text x="12" y="28" fontSize="12" fill="#FFFFFF" fontWeight="bold">EN</text>
    <rect x="28" y="26" width="30" height="22" rx="6" fill="#F48FB1" />
    <polygon points="50,48 50,56 42,48" fill="#F48FB1" />
    <text x="34" y="42" fontSize="12" fill="#FFFFFF" fontWeight="bold">ES</text>
  </svg>
)

ActivityIcons.reading = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <path d="M8 16 Q20 10 32 16 L32 50 Q20 44 8 50 Z" fill="#C8E6C9" />
    <path d="M56 16 Q44 10 32 16 L32 50 Q44 44 56 50 Z" fill="#A5D6A7" />
    <text x="13" y="34" fontSize="11" fill="#2E7D32" fontWeight="bold">A</text>
    <text x="38" y="34" fontSize="11" fill="#1B5E20" fontWeight="bold">B</text>
    <rect x="12" y="38" width="14" height="2.5" rx="1" fill="#81C784" />
    <rect x="38" y="38" width="14" height="2.5" rx="1" fill="#66BB6A" />
  </svg>
)

ActivityIcons.writing = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect x="10" y="10" width="36" height="44" rx="4" fill="#FFF8E1" />
    <path d="M16 22 L40 22 M16 30 L36 30 M16 38 L30 38" stroke="#FFCC80" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="38" y="18" width="7" height="26" rx="1" transform="rotate(35 42 30)" fill="#FFE082" />
    <polygon points="30,50 36,54 28,56" fill="#FFCCBC" transform="rotate(10 32 52)" />
    <path d="M16 46 Q22 42 28 46" stroke="#F48FB1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
)

ActivityIcons.table = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="30" rx="26" ry="10" fill="#BCAAA4" />
    <rect x="10" y="32" width="5" height="22" rx="2" fill="#A1887F" />
    <rect x="49" y="32" width="5" height="22" rx="2" fill="#A1887F" />
    <circle cx="32" cy="28" r="8" fill="#FFFFFF" />
    <circle cx="32" cy="28" r="5" fill="#FCE4EC" />
    <rect x="14" y="24" width="3" height="9" rx="1.5" fill="#E0E0E0" />
    <rect x="47" y="24" width="3" height="9" rx="1.5" fill="#E0E0E0" />
  </svg>
)

ActivityIcons.paint = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <path d="M32 8 C16 8 8 20 8 32 C8 46 18 54 28 54 C34 54 34 48 32 44 C30 40 34 36 40 38 C52 42 58 32 54 22 C50 12 42 8 32 8 Z" fill="#FFF3E0" stroke="#FFCC80" strokeWidth="2" />
    <circle cx="20" cy="24" r="4" fill="#EF5350" />
    <circle cx="32" cy="18" r="4" fill="#FFEB3B" />
    <circle cx="44" cy="24" r="4" fill="#42A5F5" />
    <circle cx="18" cy="36" r="4" fill="#66BB6A" />
  </svg>
)

ActivityIcons.story = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <path d="M10 18 Q22 12 32 18 L32 48 Q22 42 10 48 Z" fill="#B39DDB" />
    <path d="M54 18 Q42 12 32 18 L32 48 Q42 42 54 48 Z" fill="#D1C4E9" />
    <path d="M46 22 C42 23 40 27 40 31 C40 35 44 38 48 37 C44 37 42 33 42 29 C42 26 44 23 46 22 Z" fill="#FFE082" />
    <circle cx="18" cy="26" r="1.5" fill="#FFE082" />
    <circle cx="24" cy="32" r="1.5" fill="#FFE082" />
    <circle cx="16" cy="38" r="1.5" fill="#FFE082" />
  </svg>
)

ActivityIcons.hug = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <circle cx="22" cy="20" r="8" fill="#FFCCBC" />
    <circle cx="42" cy="20" r="8" fill="#FFE0B2" />
    <path d="M10 52 Q10 34 22 34 Q30 34 32 42 Q34 34 42 34 Q54 34 54 52 Z" fill="#F48FB1" />
    <path d="M14 40 Q32 52 50 40" stroke="#EC407A" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M32 26 C30 23 26 23 26 26 C26 29 32 32 32 32 C32 32 38 29 38 26 C38 23 34 23 32 26 Z" fill="#EF5350" />
  </svg>
)

ActivityIcons.dance = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <circle cx="28" cy="14" r="7" fill="#FFCCBC" />
    <path d="M28 22 Q22 30 26 38 L22 52 M26 38 L34 52" stroke="#F48FB1" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M28 26 L16 20 M28 26 L40 30" stroke="#F48FB1" strokeWidth="4" strokeLinecap="round" />
    <path d="M46 12 L46 26 M46 12 L54 14 L54 22" stroke="#7E57C2" strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="43" cy="27" r="4" fill="#B39DDB" />
    <circle cx="51" cy="23" r="4" fill="#B39DDB" />
  </svg>
)
