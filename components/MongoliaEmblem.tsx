import React from 'react';

export function MongoliaEmblem({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Golden Lotus Circle */}
      <circle cx="50" cy="50" r="46" fill="#0A3C74" stroke="#D4AF37" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="41" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
      
      {/* Inner Wind Horse & Soyombo Graphic Representation */}
      <g transform="translate(18, 16) scale(0.64)">
        {/* Soyombo Fire, Sun, Moon */}
        {/* Fire (3 flames) */}
        <path d="M50 10 C48 16 45 18 45 22 C45 25 47 27 50 27 C53 27 55 25 55 22 C55 18 52 16 50 10 Z" fill="#E5A912" />
        <path d="M42 15 C40 19 38 21 38 24 C38 26 40 28 42 28 C44 28 46 26 46 24 C46 21 44 19 42 15 Z" fill="#E5A912" />
        <path d="M58 15 C56 19 54 21 54 24 C54 26 56 28 58 28 C60 28 62 26 62 24 C62 21 60 19 58 15 Z" fill="#E5A912" />
        
        {/* Sun & Moon */}
        <circle cx="50" cy="33" r="5" fill="#E5A912" />
        <path d="M42 34 C42 39 46 41 50 41 C54 41 58 39 58 34 C55 37 45 37 42 34 Z" fill="#E5A912" />

        {/* Central Windhorse (Khimori) silhouette */}
        <path
          d="M32 52 C35 46 42 44 48 45 C55 46 58 42 62 38 C64 43 62 48 58 52 C65 54 68 60 66 68 C64 74 58 76 52 75 C45 74 38 78 32 82 C34 76 34 70 30 65 C26 60 28 55 32 52 Z"
          fill="#D4AF37"
          opacity="0.95"
        />
        
        {/* Two Triangles (arrows) pointing down */}
        <polygon points="30,48 40,48 35,56" fill="#D4AF37" />
        <polygon points="60,48 70,48 65,56" fill="#D4AF37" />
        
        {/* Two horizontal rectangles */}
        <rect x="30" y="58" width="40" height="3.5" rx="1" fill="#D4AF37" />
        <rect x="30" y="75" width="40" height="3.5" rx="1" fill="#D4AF37" />
        
        {/* Yin-Yang / Fish symbol */}
        <circle cx="50" cy="67" r="5.5" fill="#D4AF37" />
        <circle cx="48.5" cy="67" r="2.2" fill="#0A3C74" />
        <circle cx="51.5" cy="67" r="2.2" fill="#E5A912" />

        {/* Two vertical bars */}
        <rect x="23" y="44" width="4.5" height="36" rx="1" fill="#D4AF37" />
        <rect x="72.5" y="44" width="4.5" height="36" rx="1" fill="#D4AF37" />
      </g>

      {/* Stylized Bottom Base */}
      <path d="M30 84 Q50 90 70 84" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="87" r="2" fill="#D4AF37" />
    </svg>
  );
}

export function HeaderBannerGraphic() {
  return (
    <div className="absolute right-0 top-0 h-full w-[480px] pointer-events-none opacity-30 overflow-hidden select-none">
      <svg viewBox="0 0 480 90" className="w-full h-full object-cover">
        {/* Mongolia Map / Yurt / Genghis Khan statue backdrop silhouette */}
        <path
          d="M0 75 Q40 50 90 60 T180 40 T270 55 T360 30 T450 45 L480 90 L0 90 Z"
          fill="#cbd5e1"
        />
        {/* Stylized equestrian monument / mountain silhouette */}
        <g transform="translate(180, 10) scale(0.65)" opacity="0.6">
          <path
            d="M50 20 Q55 10 65 15 Q75 10 80 25 Q90 35 85 45 Q75 50 65 60 Q55 70 45 80 L30 80 Q35 60 40 45 Q40 30 50 20 Z"
            fill="#94a3b8"
          />
          <path
            d="M80 25 Q110 20 120 40 Q130 55 110 70 L95 80 L75 80 Q85 60 85 45 Z"
            fill="#94a3b8"
          />
        </g>
        {/* Stylized Mongolia Map outline */}
        <g transform="translate(320, 12) scale(0.55)" opacity="0.45">
          <path
            d="M20 30 Q50 15 90 20 Q130 10 160 35 Q170 60 140 75 Q90 85 50 70 Q10 75 20 30 Z"
            fill="#64748b"
          />
        </g>
      </svg>
    </div>
  );
}
