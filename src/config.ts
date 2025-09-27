export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 640;

export const BIRD_X = CANVAS_WIDTH * 0.3;
export const BIRD_RADIUS = 18;
export const INITIAL_BIRD_Y = CANVAS_HEIGHT / 2;

export const GRAVITY = 0.45;
export const FLAP_STRENGTH = -7.5;
export const TERMINAL_VELOCITY = 11;

export const PIPE_WIDTH = 80;
export const PIPE_GAP = 160;
export const PIPE_INTERVAL = 1400; // ms
export const PIPE_SPEED = 2.75;

export const GROUND_HEIGHT = 80;
export const SKY_GRADIENT = ['#56ccf2', '#2f80ed'];

export const BACKGROUND_HILLS = [
  { color: 'rgba(255,255,255,0.15)', height: 100, speed: 0.25 },
  { color: 'rgba(0,0,0,0.15)', height: 120, speed: 0.35 }
];
