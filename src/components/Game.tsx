import React, { useCallback, useEffect } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { GameOverlay } from './GameOverlay';
import { HUD } from './HUD';
import { Background } from './Background';
import { Bike } from './Bike';
import { GameObjects } from './GameObjects';
import { useGameState } from '../hooks/useGameState';

export default function Game() {
  const gameState = useGameState();
  const {
    gameStatus,
    bikePos,
    bikeVelocity,
    rotation,
    obstacles,
    packages,
    lifePowerUps,
    invinciblePowerUps,
    score,
    lives,
    level,
    isInvincible,
    flash,
    setIsJumping,
    updateGame,
    reset,
    startGame
  } = gameState;

  const onTick = useCallback((deltaTime: number) => {
    updateGame(deltaTime);
  }, [updateGame]);

  useGameLoop(gameStatus, onTick);

  // Global keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!gameStatus.gameStarted) {
          startGame();
        } else if (!gameStatus.gameOver) {
          setIsJumping(true);
        }
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsJumping(false);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStatus, setIsJumping, startGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="relative w-[600px] h-[400px] rounded-lg overflow-hidden border-4 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
        <Background />
        
        <Bike
          position={bikePos}
          rotation={rotation}
          velocity={bikeVelocity}
          isInvincible={isInvincible}
          flash={flash}
        />

        <GameObjects
          obstacles={obstacles}
          packages={packages}
          lifePowerUps={lifePowerUps}
          invinciblePowerUps={invinciblePowerUps}
        />

        <HUD score={score} lives={lives} level={level} />

        {(!gameStatus.gameStarted || gameStatus.gameOver) && (
          <GameOverlay
            gameOver={gameStatus.gameOver}
            score={score}
            onStart={startGame}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}