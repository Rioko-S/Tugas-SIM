import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-extrabold',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon matching user's image: Yellow rounded icon with orange delivery scooter + cloche & heart */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 shadow-md shadow-amber-500/25 p-1 shrink-0`}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Heart Steam */}
          <path
            d="M58 22 C58 17 66 17 66 22 C66 26 58 31 58 31 C58 31 50 26 50 22 C50 17 58 17 58 22 Z"
            fill="#EF4444"
          />
          {/* Steam wisps */}
          <path d="M68 28 Q72 32 70 36" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />

          {/* Speed dashes behind */}
          <path d="M12 42 H24" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M8 50 H20" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M14 58 H22" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />

          {/* Cloche Food Dome with heart */}
          <path
            d="M30 48 C30 33 66 33 66 48 Z"
            fill="#FBBF24"
            stroke="#451A03"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M48 31 H48.01" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
          {/* Little heart on cloche */}
          <path
            d="M48 41 C48 38 52 38 52 41 C52 43 48 45.5 48 45.5 C48 45.5 44 43 44 41 C44 38 48 38 48 41 Z"
            fill="#FFFFFF"
          />
          {/* Cloche tray rim */}
          <rect x="28" y="47" width="40" height="4" rx="2" fill="#F59E0B" stroke="#451A03" strokeWidth="2.5" />

          {/* Scooter Body */}
          <path
            d="M32 54 C34 54 44 54 48 60 L62 60 C68 60 74 54 75 48 L77 48"
            stroke="#451A03"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M34 56 C34 56 46 54 52 64 C56 64 68 64 72 58 C74 64 70 73 60 73 C50 73 40 73 34 68 Z"
            fill="#EA580C"
            stroke="#451A03"
            strokeWidth="3"
          />
          {/* Scooter Handlebar & Headlight */}
          <circle cx="74" cy="46" r="3.5" fill="#FEF08A" stroke="#451A03" strokeWidth="2.5" />

          {/* Wheels */}
          {/* Back Wheel */}
          <circle cx="38" cy="73" r="8" fill="#1C1917" stroke="#451A03" strokeWidth="2.5" />
          <circle cx="38" cy="73" r="3" fill="#FDE047" />

          {/* Front Wheel */}
          <circle cx="68" cy="73" r="8" fill="#1C1917" stroke="#451A03" strokeWidth="2.5" />
          <circle cx="68" cy="73" r="3" fill="#FDE047" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`tracking-tight text-slate-900 ${textSizes[size]}`}>
            Antar<span className="text-amber-600">Rasa</span>
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] font-semibold text-amber-700 tracking-wider uppercase mt-0.5">
              Food & Delivery
            </span>
          )}
        </div>
      )}
    </div>
  );
};
