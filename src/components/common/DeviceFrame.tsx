import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { deviceFrame, theme } = useApp();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (deviceFrame === 'fluid') {
    return (
      <div className={`w-full min-h-[calc(100vh-50px)] flex justify-center ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-amber-50/30 text-slate-800'}`}>
        <div className={`w-full max-w-4xl min-h-screen shadow-sm flex flex-col ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
          {children}
        </div>
      </div>
    );
  }

  // Smartphone preview frame
  return (
    <div className={`w-full min-h-[calc(100vh-50px)] py-4 sm:py-8 px-2 flex justify-center items-start overflow-y-auto ${theme === 'dark' ? 'bg-black/95' : 'bg-slate-950/90'}`}>
      <div className="relative w-full max-w-[420px] h-[860px] max-h-[92vh] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-700/80 shadow-black/80 flex flex-col transition-all">
        {/* Outer phone metal edge reflections */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent"></div>
        <div className="absolute left-[-3px] top-24 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute left-[-3px] top-40 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute right-[-3px] top-32 w-[3px] h-16 bg-slate-700 rounded-r-sm" />

        {/* Screen Bezel */}
        <div className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col shadow-inner select-none ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
          {/* Smartphone Status Bar */}
          <div className={`shrink-0 h-11 px-7 flex items-center justify-between backdrop-blur-md z-30 select-none ${theme === 'dark' ? 'text-white bg-slate-900/90' : 'text-slate-800 bg-white/90'}`}>
            <span className="text-[12px] font-bold tracking-tight">
              {currentTime || '12:30'}
            </span>

            {/* Dynamic Island / Notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
              <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700"></div>
              <div className="w-2 h-2 rounded-full bg-blue-950 border border-blue-900"></div>
            </div>

            <div className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className={`w-4 h-4 ${theme === 'dark' ? 'fill-white' : 'fill-slate-800'}`} />
            </div>
          </div>

          {/* Screen Content Scroll Area */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
            {children}
          </div>

          {/* Smartphone Bottom Home Bar */}
          <div className={`shrink-0 h-5 backdrop-blur-sm flex justify-center items-center pointer-events-none z-30 ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'}`}>
            <div className={`w-32 h-1 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
