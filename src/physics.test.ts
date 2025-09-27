import { describe, expect, it, vi } from 'vitest';
import {
  applyGravity,
  clampVelocity,
  createBird,
  createPipe,
  detectCollision,
  flapBird
} from './physics';
import { CANVAS_HEIGHT, CANVAS_WIDTH, FLAP_STRENGTH, TERMINAL_VELOCITY } from './config';

describe('clampVelocity', () => {
  it('limits velocity to terminal velocity', () => {
    expect(clampVelocity(TERMINAL_VELOCITY + 10)).toBe(TERMINAL_VELOCITY);
    expect(clampVelocity(-TERMINAL_VELOCITY - 10)).toBe(-TERMINAL_VELOCITY);
    expect(clampVelocity(5)).toBe(5);
  });
});

describe('applyGravity', () => {
  it('increases velocity over time', () => {
    const bird = createBird({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    const updated = applyGravity(bird, 1, 1);
    expect(updated.velocity).toBeGreaterThan(bird.velocity);
    // Position only changes when there's existing velocity
    expect(updated.y).toBe(bird.y); // First frame: no movement yet
    
    // Apply gravity again - now position should change
    const updated2 = applyGravity(updated, 1, 1);
    expect(updated2.y).toBeGreaterThan(bird.y);
  });

  it('respects dt multiplier', () => {
    const bird = createBird({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    const slow = applyGravity(bird, 1, 0.5);
    const fast = applyGravity(bird, 1, 2);
    expect(fast.velocity).toBeGreaterThan(slow.velocity);
  });
});

describe('flapBird', () => {
  it('applies flap strength instantly', () => {
    const bird = createBird({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    const flapped = flapBird(bird);
    expect(flapped.velocity).toBe(FLAP_STRENGTH);
  });
});

describe('createPipe', () => {
  it('creates pipes within bounds', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const pipe = createPipe({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    expect(pipe.x).toBe(CANVAS_WIDTH);
    expect(pipe.gapY).toBeGreaterThan(0);
    expect(pipe.gapY).toBeLessThan(CANVAS_HEIGHT);
    vi.restoreAllMocks();
  });
});

describe('detectCollision', () => {
  it('detects collision with pipe', () => {
    const bird = createBird({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    const pipe = createPipe({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    pipe.x = bird.x;
    pipe.gapY = bird.y + 100; // ensure top collision
    const collided = detectCollision(bird, [pipe], { width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    expect(collided).toBe(true);
  });

  it('returns false when clear', () => {
    const bird = createBird({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    const pipe = createPipe({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    pipe.x = bird.x + 400;
    const collided = detectCollision(bird, [pipe], { width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    expect(collided).toBe(false);
  });
});
