import React from 'react';
import { Heart } from 'lucide-react';

interface HUDProps {
  score: number;
  lives: number;
  level: number;
}

export function HUD({ score, lives, level }: HUDProps) {
  return (
    <div className="absolute top-4 left-4 flex items-center gap-4 bg-black/50 p-2 rounded-lg">
      <div className="flex gap-1">
        {[...Array(lives)].map((_, i) => (
          <Heart
            key={i}
            className="w-6 h-6 text-red-500 fill-red-500 drop-shadow-[0_0_2px_rgba(239,68,68,0.5)]"
          />
        ))}
      </div>
      <span className="text-cyan-400 font-bold text-lg">Score: {score}</span>
      <span className="text-cyan-400 font-bold text-lg ml-4">Level: {level}</span>
    </div>
  );
}