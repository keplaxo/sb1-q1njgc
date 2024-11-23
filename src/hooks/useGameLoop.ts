import { useEffect, useRef } from 'react';
import { GameState } from '../types';

export function useGameLoop(
  gameState: GameState,
  onTick: (deltaTime: number) => void
) {
  const frameIdRef = useRef<number>();
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const { gameStarted, gameOver } = gameState;
    if (!gameStarted || gameOver) {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      return;
    }

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      onTick(deltaTime);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [gameState, onTick]);
}