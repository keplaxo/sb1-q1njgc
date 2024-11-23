import React from 'react';
import { Package2, PlusCircle, Shield } from 'lucide-react';
import { GameObject } from '../types';

interface GameObjectsProps {
  obstacles: GameObject[];
  packages: GameObject[];
  lifePowerUps: GameObject[];
  invinciblePowerUps: GameObject[];
}

export function GameObjects({
  obstacles,
  packages,
  lifePowerUps,
  invinciblePowerUps,
}: GameObjectsProps) {
  return (
    <>
      {obstacles.map((obstacle, i) => (
        <div
          key={i}
          className="absolute w-8 h-8 bg-red-500/80 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
          style={{ left: obstacle.x, top: obstacle.y }}
        >
          <div className="absolute inset-0 bg-red-400/30 rounded-full animate-ping"></div>
        </div>
      ))}

      {packages.map((pkg, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: pkg.x, top: pkg.y }}
        >
          <Package2 className="w-6 h-6 text-green-400 animate-pulse" />
        </div>
      ))}

      {lifePowerUps.map((powerUp, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: powerUp.x, top: powerUp.y }}
        >
          <PlusCircle className="w-10 h-10 text-blue-400 animate-bounce" />
        </div>
      ))}

      {invinciblePowerUps.map((powerUp, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: powerUp.x, top: powerUp.y }}
        >
          <Shield className="w-8 h-8 text-yellow-400 animate-spin" />
        </div>
      ))}
    </>
  );
}