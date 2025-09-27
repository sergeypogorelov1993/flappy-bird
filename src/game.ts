import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GRAVITY,
  PIPE_INTERVAL,
  PIPE_SPEED
} from './config';
import {
  advancePipes,
  applyGravity,
  clampVelocity,
  createBird,
  createPipe,
  detectCollision,
  filterVisiblePipes,
  flapBird
} from './physics';
import { render } from './renderer';
import type { Bird, GameState, Pipe } from './types';

export class FlappyBirdGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bird: Bird;
  private pipes: Pipe[] = [];
  private gameState: GameState = { status: 'idle', score: 0, highScore: 0 };
  private scoredPipes = new Set<string>();
  private lastTimestamp = 0;
  private pipeTimer = 0;
  private animationFrame: number | null = null;
  private backgroundOffset = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context is not supported in this environment.');
    }
    this.ctx = ctx;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.bird = createBird({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

    this.bindEvents();
    this.draw();
  }

  private bindEvents() {
    const flap = () => {
      if (this.gameState.status === 'over') {
        this.reset();
        this.start();
        return;
      }
      if (this.gameState.status === 'idle') {
        this.start();
      }
      if (this.gameState.status === 'running') {
        this.bird = flapBird(this.bird);
      }
    };

    this.canvas.addEventListener('pointerdown', flap);
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        flap();
      }
    });
  }

  private reset() {
    this.bird = createBird({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    this.pipes = [];
    this.pipeTimer = 0;
    this.backgroundOffset = 0;
    this.scoredPipes.clear();
    this.gameState = {
      status: 'idle',
      score: 0,
      highScore: this.gameState.highScore
    };
  }

  private start() {
    if (this.gameState.status === 'running') return;
    this.gameState.status = 'running';
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  private loop = (timestamp: number) => {
    const deltaMs = timestamp - this.lastTimestamp;
    const dt = deltaMs / (1000 / 60); // convert to frames
    this.lastTimestamp = timestamp;

    if (this.gameState.status === 'running') {
      this.update(dt, deltaMs);
    }

    this.draw();
    this.animationFrame = requestAnimationFrame(this.loop);
  };

  private update(dt: number, deltaMs: number) {
    this.pipeTimer += deltaMs;

    if (this.pipeTimer > PIPE_INTERVAL) {
      this.pipes.push(createPipe({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }));
      this.pipeTimer = 0;
    }

    this.pipes = advancePipes(this.pipes, PIPE_SPEED, dt);
    this.pipes = filterVisiblePipes(this.pipes);

    this.bird = applyGravity(this.bird, GRAVITY, dt);
    this.bird.velocity = clampVelocity(this.bird.velocity);

    if (detectCollision(this.bird, this.pipes, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT })) {
      this.endGame();
      return;
    }

    this.updateScore();
    this.backgroundOffset = (this.backgroundOffset + PIPE_SPEED * dt) % CANVAS_WIDTH;
  }

  private updateScore() {
    for (const pipe of this.pipes) {
      if (pipe.x + pipe.width < this.bird.x && !this.scoredPipes.has(pipe.id)) {
        this.scoredPipes.add(pipe.id);
        this.gameState.score += 1;
      }
    }
    if (this.gameState.score > this.gameState.highScore) {
      this.gameState.highScore = this.gameState.score;
    }
  }

  private endGame() {
    this.gameState.status = 'over';
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.draw();
  }

  private draw() {
    render(
      this.ctx,
      this.bird,
      this.pipes,
      this.gameState.score,
      this.gameState.highScore,
      this.gameState.status,
      this.backgroundOffset
    );
  }
}
