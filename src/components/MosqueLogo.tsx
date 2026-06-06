import React from 'react';

interface MosqueLogoProps {
  className?: string;
  size?: number | string;
}

export default function MosqueLogo({ className = "w-16 h-16", size }: MosqueLogoProps) {
  const style = size ? { width: size, height: size } : undefined;
  
  return (
    <svg 
      viewBox="0 0 500 500" 
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Border (Double Green & Gold Trim) */}
      <circle cx="250" cy="250" r="238" stroke="#064e3b" strokeWidth="6" fill="none" />
      <circle cx="250" cy="250" r="226" stroke="#bf9a36" strokeWidth="2.5" fill="none" />
      <circle cx="250" cy="250" r="218" stroke="#064e3b" strokeWidth="2.5" fill="none" />
      
      {/* Golden Framing Arch */}
      <path 
        d="M 165,190 A 90,90 0 0,1 335,190" 
        stroke="#bf9a36" 
        strokeWidth="3.5" 
        fill="none" 
        strokeLinecap="round"
        opacity="0.9" 
      />

      {/* Main Dome Structure */}
      {/* Base Building of the Mosque */}
      <rect x="170" y="222" width="160" height="34" fill="#064e3b" rx="2" />
      
      {/* Arched Doors inside the building base */}
      <path 
        d="M 182,256 L 182,243 A 4.5,4.5 0 0,1 191,243 L 191,256 
           M 212,256 L 212,243 A 4.5,4.5 0 0,1 221,243 L 221,256 
           M 244,256 L 244,237 A 6.5,6.5 0 0,1 257,237 L 257,256 
           M 280,256 L 280,243 A 4.5,4.5 0 0,1 289,243 L 289,256 
           M 310,256 L 310,243 A 4.5,4.5 0 0,1 319,243 L 319,256" 
        stroke="#ffffff" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round"
      />

      {/* Main Bulbous Onion Dome */}
      <path 
        d="M 250,110 C 242,120 200,150 185,183 C 170,210 185,223 200,223 L 300,223 C 315,223 330,210 315,183 C 300,150 258,120 250,110 Z" 
        fill="#064e3b" 
      />
      
      {/* Arched detailing at the base of the Onion Dome */}
      <path 
        d="M 205,223 L 205,217 A 4,4 0 0,1 213,217 L 213,223 
           M 225,223 L 225,217 A 4,4 0 0,1 233,217 L 233,223 
           M 245,223 L 245,217 A 4,4 0 0,1 253,217 L 253,223 
           M 265,223 L 265,217 A 4,4 0 0,1 273,217 L 273,223 
           M 285,223 L 285,217 A 4,4 0 0,1 293,217 L 293,223" 
        stroke="#ffffff" 
        strokeWidth="1.5" 
        fill="none" 
        opacity="0.65" 
      />

      {/* Symmetrical Left Minaret */}
      <rect x="135" y="208" width="20" height="48" fill="#064e3b" rx="1" />
      <rect x="138" y="148" width="14" height="60" fill="#064e3b" />
      <rect x="131" y="143" width="28" height="5" rx="1.5" fill="#bf9a36" />
      <rect x="140" y="115" width="10" height="28" fill="#064e3b" />
      <rect x="135" y="111" width="20" height="4" rx="1" fill="#bf9a36" />
      {/* Minaret Peak */}
      <path d="M 140,111 L 145,94 L 150,111 Z" fill="#064e3b" />
      {/* Minaret Spire & Globe */}
      <line x1="145" y1="94" x2="145" y2="84" stroke="#bf9a36" strokeWidth="1.5" />
      <circle cx="145" cy="83" r="1.5" fill="#bf9a36" />
      {/* Left Tower Window Details */}
      <line x1="145" y1="156" x2="145" y2="198" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,5" opacity="0.4" />

      {/* Symmetrical Right Minaret */}
      <rect x="345" y="208" width="20" height="48" fill="#064e3b" rx="1" />
      <rect x="348" y="148" width="14" height="60" fill="#064e3b" />
      <rect x="341" y="143" width="28" height="5" rx="1.5" fill="#bf9a36" />
      <rect x="350" y="115" width="10" height="28" fill="#064e3b" />
      <rect x="345" y="111" width="20" height="4" rx="1" fill="#bf9a36" />
      {/* Minaret Peak */}
      <path d="M 350,111 L 355,94 L 360,111 Z" fill="#064e3b" />
      {/* Minaret Spire & Globe */}
      <line x1="355" y1="94" x2="355" y2="84" stroke="#bf9a36" strokeWidth="1.5" />
      <circle cx="355" cy="83" r="1.5" fill="#bf9a36" />
      {/* Right Tower Window Details */}
      <line x1="355" y1="156" x2="355" y2="198" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,5" opacity="0.4" />

      {/* Main Dome Finial Spire (Crescent Moon and Star) */}
      <line x1="250" y1="110" x2="250" y2="78" stroke="#bf9a36" strokeWidth="2.5" />
      <circle cx="250" cy="94" r="4.5" fill="#bf9a36" />
      <circle cx="250" cy="85" r="3" fill="#bf9a36" />
      
      {/* Detailed Crescent with Star facing upwards/eastwards */}
      <path 
        d="M 250,78 A 12,12 0 1,1 262,67 A 10,10 0 1,0 250,78" 
        fill="#bf9a36" 
      />
      <polygon 
        points="257,56 259,60 263,60 260,62 261,66 257,64 253,66 254,62 251,60 255,60" 
        fill="#bf9a36" 
      />

      {/* Middle Text: "مسجد دارالسلام" */}
      <text 
        x="250" 
        y="322" 
        textAnchor="middle" 
        fontFamily="'Noto Naskh Arabic', 'Noto Nastaliq Urdu', 'Amiri', 'Arabic', 'System-UI', sans-serif" 
        fontWeight="900" 
        fontSize="48" 
        fill="#064e3b"
      >
        مسجد دارالسلام
      </text>

      {/* Golden Decorative Divider Line & Diamond Center */}
      <line x1="130" y1="354" x2="370" y2="354" stroke="#bf9a36" strokeWidth="2" />
      <polygon points="250,345 259,354 250,363 241,354" fill="#bf9a36" />
      <circle cx="170" cy="354" r="3.5" fill="#bf9a36" />
      <circle cx="330" cy="354" r="3.5" fill="#bf9a36" />

      {/* The word "فنڈ" with support gold lines */}
      <line x1="165" y1="391" x2="215" y2="391" stroke="#bf9a36" strokeWidth="2.5" />
      <line x1="285" y1="391" x2="335" y2="391" stroke="#bf9a36" strokeWidth="2.5" />
      <text 
        x="250" 
        y="401" 
        textAnchor="middle" 
        fontFamily="'Noto Naskh Arabic', 'Noto Nastaliq Urdu', 'Amiri', 'Arabic', 'System-UI', sans-serif" 
        fontWeight="900" 
        fontSize="34" 
        fill="#064e3b"
      >
        فنڈ
      </text>

      {/* Hands holding the Quran at the bottom */}
      {/* Symmetrical Open Quran Hands Support pages */}
      <path 
        d="M 250,442 C 235,442 221,432 206,436 L 206,420 C 221,416 235,426 250,426 Z" 
        fill="#ffffff" 
        stroke="#bf9a36" 
        strokeWidth="1.5" 
      />
      <path 
        d="M 250,442 C 265,442 279,432 294,436 L 294,420 C 279,416 265,426 250,426 Z" 
        fill="#ffffff" 
        stroke="#bf9a36" 
        strokeWidth="1.5" 
      />
      
      {/* Book Ribbon Marker */}
      <path d="M 250,426 L 250,450 L 246,450 Z" fill="#bf9a36" />
      
      {/* Book Writing Lines */}
      <line x1="214" y1="425" x2="242" y2="425" stroke="#bf9a36" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <line x1="214" y1="431" x2="242" y2="431" stroke="#bf9a36" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <line x1="258" y1="425" x2="286" y2="425" stroke="#bf9a36" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <line x1="258" y1="431" x2="286" y2="431" stroke="#bf9a36" strokeWidth="1" opacity="0.6" strokeLinecap="round" />

      {/* Symmetrical Hands cradling from both lower-left and lower-right sides */}
      {/* Left Hand */}
      <path 
        d="M 152,402 C 162,434 192,464 240,464 C 244,464 246,461 246,457 C 230,455 192,436 182,410 Z" 
        fill="#064e3b" 
      />
      {/* Right Hand */}
      <path 
        d="M 348,402 C 338,434 308,464 260,464 C 256,464 254,461 254,457 C 270,455 308,436 318,410 Z" 
        fill="#064e3b" 
      />
    </svg>
  );
}
