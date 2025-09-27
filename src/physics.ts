import { nanoid } from 'nanoid';
import {
  BIRD_RADIUS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FLAP_STRENGTH,
  GROUND_HEIGHT,
  PIPE_GAP,
  PIPE_WIDTH,
  TERMINAL_VELOCITY
} from './config';
import type { Bird, Dimensions, Pipe } from './types';

export const clampVelocity = (velocity: number): number => {
  if (velocity > TERMINAL_VELOCITY) return TERMINAL_VELOCITY;
  if (velocity < -TERMINAL_VELOCITY) return -TERMINAL_VELOCITY;
  return velocity;
};

export const createBird = (dimensions: Dimensions): Bird => ({
  x: dimensions.width * 0.3,
  y: dimensions.height / 2,
  radius: BIRD_RADIUS,
  velocity: 0
});

export const applyGravity = (bird: Bird, gravity: number, dt: number): Bird => ({
  ...bird,
  velocity: clampVelocity(bird.velocity + gravity * dt),
  y: bird.y + bird.velocity * dt
});

export const flapBird = (bird: Bird): Bird => ({
  ...bird,
  velocity: FLAP_STRENGTH
});

export const createPipe = (
  dimensions: Dimensions,
  gap: number = PIPE_GAP,
  width: number = PIPE_WIDTH
): Pipe => {
  const margin = 40;
  const verticalSpace = dimensions.height - GROUND_HEIGHT - gap - margin * 2;
  const gapY = margin + Math.random() * verticalSpace;

  return {
    id: nanoid(),
    x: dimensions.width,
    gapY,
    width
  };
};

export const movePipe = (pipe: Pipe, dx: number): Pipe => ({
  ...pipe,
  x: pipe.x - dx
});

export const filterVisiblePipes = (pipes: Pipe[]): Pipe[] =>
  pipes.filter((pipe) => pipe.x + pipe.width > 0);

export const hasBirdCollidedWithPipe = (bird: Bird, pipe: Pipe, dimensions: Dimensions): boolean => {
  const halfGap = PIPE_GAP / 2;
  const topPipeBottom = pipe.gapY - halfGap;
  const bottomPipeTop = pipe.gapY + halfGap;

  if (bird.x + bird.radius < pipe.x || bird.x - bird.radius > pipe.x + pipe.width) {
    return false;
  }

  if (bird.y - bird.radius < topPipeBottom) {
    return true;
  }

  if (bird.y + bird.radius > bottomPipeTop) {
    return true;
  }

  return false;
};

export const hasBirdHitBounds = (bird: Bird, dimensions: Dimensions): boolean => {
  if (bird.y - bird.radius < 0) return true;
  if (bird.y + bird.radius > dimensions.height - GROUND_HEIGHT) return true;
  return false;
};

export const detectCollision = (bird: Bird, pipes: Pipe[], dimensions: Dimensions): boolean => {
  if (hasBirdHitBounds(bird, dimensions)) return true;
  return pipes.some((pipe) => hasBirdCollidedWithPipe(bird, pipe, dimensions));
};

export const advancePipes = (pipes: Pipe[], speed: number, dt: number): Pipe[] =>
  pipes.map((pipe) => movePipe(pipe, speed * dt));

