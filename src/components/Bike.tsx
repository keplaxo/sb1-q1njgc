import React from 'react';
import { Bike as BikeIcon } from 'lucide-react';
import { BIKE_SIZE } from '../constants/gameConfig';
import { Position } from '../types';

interface BikeProps {
  position: Position;
  rotation: number;
  velocity: number;
  isInvincible: boolean;
  flash: boolean;
}

export function Bike({ position, rotation, velocity, isInvincible, flash }: BikeProps) {
  return (
    <div
      className={`absolute transition-transform ${flash ? 'opacity-50' : 'opacity-100'}`}
      style={{
        left: position.x,
        top: position.y,
        width: BIKE_SIZE,
        height: BIKE_SIZE,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className="relative w-full h-full">
        <BikeIcon className="w-full h-full text-cyan-400" />
        <div className="absolute -right-4 top-1/2 w-6 h-1 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"></div>
      </div>
    </div>
  );
}