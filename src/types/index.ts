export interface Position {
  x: number;
  y: number;
}

export interface GameObject extends Position {
  moving?: boolean;
  direction?: number;
}

export interface GameState {
  gameStarted: boolean;
  gameOver: boolean;
}