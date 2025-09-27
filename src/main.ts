import './style.css';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './config';
import { FlappyBirdGame } from './game';

const root = document.querySelector<HTMLDivElement>('#app');
if (!root) {
  throw new Error('Root element not found');
}

const title = document.createElement('h1');
title.textContent = 'Flappy Bird — Primitive Edition';
title.style.margin = '0';
title.style.fontSize = '1.75rem';
title.style.textAlign = 'center';

const description = document.createElement('p');
description.innerHTML =
  'Click, tap or press <kbd>Space</kbd> / <kbd>↑</kbd> to flap. Primitive shapes are used now, but the rendering pipeline is ready for animated sprites later.';
description.style.maxWidth = '480px';
description.style.textAlign = 'center';
description.style.color = 'rgba(255,255,255,0.85)';
description.style.lineHeight = '1.5';

const canvas = document.createElement('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.maxWidth = 'min(90vw, 480px)';
canvas.style.touchAction = 'manipulation';
canvas.style.background = 'transparent';

const restartButton = document.createElement('button');
restartButton.textContent = 'Restart';
restartButton.addEventListener('click', () => {
  window.location.reload();
});

root.append(title, description, canvas, restartButton);

// Attach stylesheet for kbd tags
const style = document.createElement('style');
style.textContent = `
  kbd {
    display: inline-block;
    padding: 0.15rem 0.4rem;
    border-radius: 0.35rem;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.35);
    font-size: 0.9rem;
  }
`;
document.head.appendChild(style);

new FlappyBirdGame(canvas);
