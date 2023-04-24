import playerShipUrl from './assets/player-ship.png';
import { loadImage } from './lib/loader.ts';
import { getResolution } from './lib/screen.ts';

const GAME_WIDTH = 128;
const GAME_HEIGHT = 128;

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
ctx.imageSmoothingEnabled = false;
canvas.style.width = `${GAME_WIDTH}px`;
canvas.style.height = `${GAME_HEIGHT}px`;

export const IDENTITY_MATRIX: DOMMatrix2DInit = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0,
};

const resize = () => {
  // Scale canvas to fit window while maintaining 16x9
  const { innerWidth, innerHeight } = window;
  const { factor } = getResolution(
    innerWidth,
    innerHeight,
    GAME_WIDTH,
    GAME_HEIGHT,
  );

  canvas.style.transform = `scale(${factor})`;
  canvas.style.left = `${innerWidth / 2 - canvas.width / 2}px`;
  canvas.style.top = `${innerHeight / 2 - canvas.height / 2}px`;
};

resize();

window.addEventListener('resize', resize);

const playerShipSprite = await loadImage(playerShipUrl);

// ctx.filter = 'blur(1px)';
// ctx.filter = 'brightness(0.5)';
ctx.filter = 'drop-shadow(0 0 1px #ffffff)';

ctx.drawImage(
  playerShipSprite,
  canvas.width / 2 - playerShipSprite.width / 2,
  canvas.height / 2 - playerShipSprite.height / 2,
);

ctx.filter = 'none';

ctx.drawImage(
  playerShipSprite,
  canvas.width / 2 - playerShipSprite.width / 2,
  canvas.height / 2 - playerShipSprite.height / 2,
);
