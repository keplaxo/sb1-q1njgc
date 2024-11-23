import React from 'react';

export function Background() {
  return (
    <div className="absolute inset-0">
      {/* Cyberpunk sky gradient with more urban colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-slate-900 to-black"></div>
      
      {/* Animated neon glow in the sky */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-32 top-0 bg-gradient-to-b from-cyan-500/20 to-transparent animate-pulse"></div>
      </div>
      
      {/* City skyline with more detailed buildings */}
      <div className="absolute bottom-0 w-full h-64 flex items-end">
        {/* Far buildings - creating depth */}
        <div className="absolute bottom-0 w-full flex justify-around">
          {[...Array(12)].map((_, i) => (
            <div
              key={`far-${i}`}
              className="w-16 bg-slate-900/80"
              style={{
                height: `${Math.random() * 80 + 100}px`,
                marginLeft: `${Math.random() * 10}px`,
              }}
            >
              {/* Windows */}
              <div className="h-full w-full grid grid-cols-2 gap-0.5 p-0.5">
                {[...Array(12)].map((_, j) => (
                  <div
                    key={j}
                    className={`bg-yellow-400/25 ${Math.random() > 0.7 ? 'animate-pulse' : ''}`}
                    style={{
                      opacity: Math.random() > 0.5 ? 1 : 0.3,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Near buildings - more detailed */}
        <div className="absolute bottom-0 w-full flex justify-around">
          {[...Array(8)].map((_, i) => (
            <div
              key={`near-${i}`}
              className="w-24 bg-slate-800"
              style={{
                height: `${Math.random() * 120 + 140}px`,
                marginLeft: `${Math.random() * 20}px`,
              }}
            >
              {/* Windows with neon effect */}
              <div className="h-full w-full grid grid-cols-3 gap-1 p-1">
                {[...Array(15)].map((_, j) => (
                  <div
                    key={j}
                    className={`bg-cyan-400/30 ${Math.random() > 0.8 ? 'animate-pulse' : ''}`}
                    style={{
                      opacity: Math.random() > 0.6 ? 1 : 0.2,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Road with neon lines */}
        <div className="absolute bottom-0 w-full h-24 bg-slate-900">
          {/* Main road line */}
          <div className="absolute top-1/2 w-full h-1 bg-cyan-400/50"></div>
          
          {/* Animated side lines */}
          <div className="absolute top-1/3 w-full h-0.5 bg-purple-500/30"></div>
          <div className="absolute bottom-1/3 w-full h-0.5 bg-purple-500/30"></div>
        </div>
      </div>
      
      {/* Stars with enhanced twinkling */}
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            top: Math.random() * 60 + '%',
            left: Math.random() * 100 + '%',
            animationDelay: `${Math.random() * 3}s`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        ></div>
      ))}
      
      {/* Floating particles effect */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute bg-cyan-400/30 rounded-full animate-pulse"
          style={{
            width: Math.random() * 3 + 2 + 'px',
            height: Math.random() * 3 + 2 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDuration: `${Math.random() * 2 + 1}s`,
          }}
        ></div>
      ))}
    </div>
  );
}