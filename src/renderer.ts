import {
  BIRD_RADIUS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GROUND_HEIGHT,
  PIPE_GAP
} from './config';
import type { Bird, Pipe } from './types';

export interface RendererOptions {
  ctx: CanvasRenderingContext2D;
  backgroundOffset: number;
}

export const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
};

const drawBackground = (ctx: CanvasRenderingContext2D, offset: number) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, '#56ccf2');
  gradient.addColorStop(1, '#2f80ed');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  const hillWidth = 240;
  const hillHeight = 90;
  const hillY = CANVAS_HEIGHT - GROUND_HEIGHT - hillHeight / 2;
  for (let i = -2; i < 4; i++) {
    const hillX = (i * hillWidth + offset * 0.2) % (hillWidth * 2);
    ctx.beginPath();
    ctx.ellipse(hillX, hillY, hillWidth, hillHeight, 0, 0, Math.PI, true);
    ctx.fill();
  }
};

const drawGround = (ctx: CanvasRenderingContext2D, offset: number) => {
  ctx.fillStyle = '#825201';
  ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);

  ctx.fillStyle = '#f2c94c';
  const stripeWidth = 40;
  for (let i = -1; i < CANVAS_WIDTH / stripeWidth + 2; i++) {
    const x = (i * stripeWidth + offset) % (stripeWidth * 2);
    ctx.fillRect(x, CANVAS_HEIGHT - GROUND_HEIGHT, stripeWidth, GROUND_HEIGHT);
  }
};

const drawBird = (ctx: CanvasRenderingContext2D, bird: Bird, status: string) => {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 6, bird.velocity / 12));
  ctx.rotate(rotation);

  ctx.fillStyle = status === 'over' ? '#eb5757' : '#f2c94c';
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_RADIUS + 6, BIRD_RADIUS, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.arc(BIRD_RADIUS / 2, -BIRD_RADIUS / 3, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f2994a';
  ctx.beginPath();
  ctx.moveTo(BIRD_RADIUS, 0);
  ctx.lineTo(BIRD_RADIUS + 12, -4);
  ctx.lineTo(BIRD_RADIUS, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const drawPipe = (ctx: CanvasRenderingContext2D, pipe: Pipe) => {
  const halfGap = PIPE_GAP / 2;
  const topHeight = pipe.gapY - halfGap;
  const bottomY = pipe.gapY + halfGap;
  const bottomHeight = CANVAS_HEIGHT - bottomY - GROUND_HEIGHT;

  ctx.fillStyle = '#6fcf97';
  ctx.fillRect(pipe.x, 0, pipe.width, topHeight);
  ctx.fillRect(pipe.x, bottomY, pipe.width, bottomHeight);

  ctx.fillStyle = '#27ae60';
  ctx.fillRect(pipe.x - 6, topHeight - 20, pipe.width + 12, 20);
  ctx.fillRect(pipe.x - 6, bottomY, pipe.width + 12, 20);
};

const drawScoreboard = (
  ctx: CanvasRenderingContext2D,
  score: number,
  highScore: number,
  status: 'idle' | 'running' | 'over'
) => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(16, 16, 140, 56);

  ctx.fillStyle = '#ffffff';
  ctx.font = '20px "Segoe UI", sans-serif';
  ctx.textAlign = 'start';
  ctx.fillText(`Score: ${score}`, 28, 40);
  ctx.fillText(`Best: ${highScore}`, 28, 64);

  if (status === 'idle') {
    ctx.textAlign = 'center';
    ctx.font = '26px "Segoe UI", sans-serif';
    ctx.fillText('Tap, click or space to start!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }

  if (status === 'over') {
    ctx.textAlign = 'center';
    ctx.font = '32px "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    ctx.font = '20px "Segoe UI", sans-serif';
    ctx.fillText('Press space or tap to retry', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 16);
  }

  ctx.textAlign = 'start';
};

export const render = (
  ctx: CanvasRenderingContext2D,
  bird: Bird,
  pipes: Pipe[],
  score: number,
  highScore: number,
  status: 'idle' | 'running' | 'over',
  backgroundOffset: number
) => {
  clearCanvas(ctx);
  drawBackground(ctx, backgroundOffset);
  pipes.forEach((pipe) => drawPipe(ctx, pipe));
  drawGround(ctx, backgroundOffset * 1.5);
  drawBird(ctx, bird, status);
  drawScoreboard(ctx, score, highScore, status);
};
