import React from 'react';

interface GameOverlayProps {
  gameOver: boolean;
  score: number;
  onStart: () => void;
  onReset: () => void;
}

export function GameOverlay({ gameOver, score, onStart, onReset }: GameOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center">
      <h2 className="text-5xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
        {gameOver ? 'Game Over!' : 'Neon Rider'}
      </h2>
      {gameOver && (
        <p className="text-2xl text-cyan-300 mb-4">
          Score: {score}
        </p>
      )}
      <button
        onClick={gameOver ? onReset : onStart}
        className="px-8 py-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-xl shadow-[0_0_15px_rgba(8,145,178,0.5)]"
      >
        {gameOver ? 'Play Again' : 'Start Game'}
      </button>
      <p className="text-cyan-300 mt-6">
        Hold SPACE to jump higher, release to drop
      </p>
    </div>
  );
}