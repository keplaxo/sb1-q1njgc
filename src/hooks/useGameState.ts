import { useState, useCallback, useRef } from 'react';
import {
  INITIAL_BIKE_POS,
  INITIAL_VELOCITY,
  GRAVITY,
  JUMP_FORCE,
  MAX_JUMP_VELOCITY,
  MAX_FALL_VELOCITY,
  GAME_HEIGHT,
  GAME_WIDTH,
  BIKE_SIZE,
  OBSTACLE_WIDTH,
  INITIAL_OBSTACLE_SPEED,
  INVINCIBLE_DURATION,
  COLLISION_COOLDOWN,
} from '../constants/gameConfig';
import { GameState, Position, GameObject } from '../types';

export function useGameState() {
  const [gameStatus, setGameStatus] = useState<GameState>({
    gameStarted: false,
    gameOver: false,
  });

  const [bikePos, setBikePos] = useState<Position>(INITIAL_BIKE_POS);
  const [bikeVelocity, setBikeVelocity] = useState(INITIAL_VELOCITY);
  const [rotation, setRotation] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [isInvincible, setIsInvincible] = useState(false);
  const [flash, setFlash] = useState(false);
  const [obstacleSpeed, setObstacleSpeed] = useState(INITIAL_OBSTACLE_SPEED);

  const [obstacles, setObstacles] = useState<GameObject[]>([]);
  const [packages, setPackages] = useState<GameObject[]>([]);
  const [lifePowerUps, setLifePowerUps] = useState<GameObject[]>([]);
  const [invinciblePowerUps, setInvinciblePowerUps] = useState<GameObject[]>([]);

  // Use refs for collision cooldown to prevent stale closures
  const collisionCooldownRef = useRef(false);
  const lastCollisionTimeRef = useRef(0);

  const updateBikePosition = useCallback((deltaTime: number) => {
    setBikePos((prev) => {
      const newY = Math.max(
        0,
        Math.min(
          GAME_HEIGHT - BIKE_SIZE,
          prev.y + (bikeVelocity * deltaTime) / 16
        )
      );
      return { ...prev, y: newY };
    });

    setBikeVelocity((prev) => {
      if (isJumping) {
        return Math.max(prev + JUMP_FORCE, MAX_JUMP_VELOCITY);
      } else {
        const newVelocity = prev + GRAVITY;
        return Math.min(newVelocity, MAX_FALL_VELOCITY);
      }
    });

    setRotation(() => {
      if (bikeVelocity < 0) return -15;
      if (bikeVelocity > 5) return 15;
      return 0;
    });
  }, [bikeVelocity, isJumping]);

  const updateGameObjects = useCallback((deltaTime: number) => {
    // Update obstacles
    setObstacles((prev) => {
      let newObstacles = prev
        .map((obs) => ({
          ...obs,
          x: obs.x - (obstacleSpeed * deltaTime) / 16,
          y: obs.moving
            ? Math.max(
                OBSTACLE_WIDTH,
                Math.min(
                  GAME_HEIGHT - OBSTACLE_WIDTH,
                  obs.y + (obs.direction || 1) * (deltaTime / 16) * 2
                )
              )
            : obs.y,
        }))
        .filter((obs) => obs.x > -OBSTACLE_WIDTH);

      // Change direction if moving obstacle hits boundaries
      newObstacles = newObstacles.map(obs => {
        if (obs.moving) {
          if (obs.y <= OBSTACLE_WIDTH || obs.y >= GAME_HEIGHT - OBSTACLE_WIDTH) {
            return { ...obs, direction: (obs.direction || 1) * -1 };
          }
        }
        return obs;
      });

      if (
        newObstacles.length === 0 ||
        newObstacles[newObstacles.length - 1].x < GAME_WIDTH - 200
      ) {
        newObstacles.push({
          x: GAME_WIDTH,
          y: Math.random() * (GAME_HEIGHT - 100) + 50,
          moving: Math.random() < 0.3,
          direction: Math.random() < 0.5 ? 1 : -1,
        });
      }

      return newObstacles;
    });

    // Update packages with smoother movement
    setPackages((prev) => {
      let newPackages = prev
        .map((pkg) => ({
          ...pkg,
          x: pkg.x - (obstacleSpeed * deltaTime) / 16,
        }))
        .filter((pkg) => pkg.x > -30);

      if (Math.random() < 0.02) {
        newPackages.push({
          x: GAME_WIDTH,
          y: Math.random() * (GAME_HEIGHT - 150) + 50,
        });
      }

      return newPackages;
    });

    // Update power-ups
    setLifePowerUps((prev) => {
      let newPowerUps = prev
        .map((powerUp) => ({
          ...powerUp,
          x: powerUp.x - (obstacleSpeed * deltaTime) / 16,
        }))
        .filter((powerUp) => powerUp.x > -30);

      if (Math.random() < 0.005) {
        newPowerUps.push({
          x: GAME_WIDTH,
          y: Math.random() * (GAME_HEIGHT - 150) + 50,
        });
      }

      return newPowerUps;
    });

    setInvinciblePowerUps((prev) => {
      let newPowerUps = prev
        .map((powerUp) => ({
          ...powerUp,
          x: powerUp.x - (obstacleSpeed * deltaTime) / 16,
        }))
        .filter((powerUp) => powerUp.x > -30);

      if (Math.random() < 0.001) {
        newPowerUps.push({
          x: GAME_WIDTH,
          y: Math.random() * (GAME_HEIGHT - 150) + 50,
        });
      }

      return newPowerUps;
    });
  }, [obstacleSpeed]);

  const checkCollisions = useCallback(() => {
    if (!isInvincible && !collisionCooldownRef.current) {
      const currentTime = Date.now();
      
      for (const obstacle of obstacles) {
        const collision =
          bikePos.x < obstacle.x + OBSTACLE_WIDTH &&
          bikePos.x + BIKE_SIZE > obstacle.x &&
          bikePos.y < obstacle.y + OBSTACLE_WIDTH &&
          bikePos.y + BIKE_SIZE > obstacle.y;

        if (collision && currentTime - lastCollisionTimeRef.current >= COLLISION_COOLDOWN) {
          lastCollisionTimeRef.current = currentTime;
          collisionCooldownRef.current = true;
          
          setLives((prev) => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameStatus((prev) => ({ ...prev, gameOver: true }));
              return 0;
            }
            // Start collision cooldown
            setTimeout(() => {
              collisionCooldownRef.current = false;
            }, COLLISION_COOLDOWN);
            return newLives;
          });

          // Remove the collided obstacle
          setObstacles((prev) => 
            prev.filter((obs) => obs !== obstacle)
          );
          
          break; // Exit after first collision
        }
      }
    }
  }, [bikePos, obstacles, isInvincible]);

  const collectItems = useCallback(() => {
    setPackages((prev) =>
      prev.filter((pkg) => {
        const collected =
          bikePos.x < pkg.x + 30 &&
          bikePos.x + BIKE_SIZE > pkg.x &&
          bikePos.y < pkg.y + 30 &&
          bikePos.y + BIKE_SIZE > pkg.y;

        if (collected) {
          setScore((prev) => prev + 10);
        }

        return !collected;
      })
    );

    setLifePowerUps((prev) =>
      prev.filter((powerUp) => {
        const collected =
          bikePos.x < powerUp.x + 40 &&
          bikePos.x + BIKE_SIZE > powerUp.x &&
          bikePos.y < powerUp.y + 40 &&
          bikePos.y + BIKE_SIZE > powerUp.y;

        if (collected) {
          setLives((prev) => Math.min(prev + 1, 5));
        }

        return !collected;
      })
    );

    setInvinciblePowerUps((prev) =>
      prev.filter((powerUp) => {
        const collected =
          bikePos.x < powerUp.x + 30 &&
          bikePos.x + BIKE_SIZE > powerUp.x &&
          bikePos.y < powerUp.y + 30 &&
          bikePos.y + BIKE_SIZE > powerUp.y;

        if (collected) {
          setIsInvincible(true);
          setFlash(true);
          setTimeout(() => {
            setIsInvincible(false);
            setFlash(false);
          }, INVINCIBLE_DURATION);
        }

        return !collected;
      })
    );
  }, [bikePos]);

  const updateGame = useCallback((deltaTime: number) => {
    if (!gameStatus.gameOver && gameStatus.gameStarted) {
      updateBikePosition(deltaTime);
      updateGameObjects(deltaTime);
      checkCollisions();
      collectItems();
    }
  }, [gameStatus, updateBikePosition, updateGameObjects, checkCollisions, collectItems]);

  const reset = useCallback(() => {
    setBikePos(INITIAL_BIKE_POS);
    setBikeVelocity(INITIAL_VELOCITY);
    setRotation(0);
    setIsJumping(false);
    setScore(0);
    setLives(3);
    setLevel(1);
    setIsInvincible(false);
    setFlash(false);
    setObstacles([]);
    setPackages([]);
    setLifePowerUps([]);
    setInvinciblePowerUps([]);
    setObstacleSpeed(INITIAL_OBSTACLE_SPEED);
    collisionCooldownRef.current = false;
    lastCollisionTimeRef.current = 0;
    setGameStatus({ gameStarted: false, gameOver: false });
  }, []);

  const startGame = useCallback(() => {
    setGameStatus({ gameStarted: true, gameOver: false });
  }, []);

  return {
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
    startGame,
  };
}