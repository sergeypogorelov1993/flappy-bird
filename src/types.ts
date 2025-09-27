export interface Bird {
  x: number;
  y: number;
  radius: number;
  velocity: number;
}

export interface Pipe {
  id: string;
  x: number;
  gapY: number;
  width: number;
}

export interface GameState {
  status: 'idle' | 'running' | 'over';
  score: number;
  highScore: number;
}

export interface Dimensions {
  width: number;
  height: number;
}
