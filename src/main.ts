import bunnyUrl from './assets/bunny.png';
import cherryBombUrl from './assets/cherry-bomb.png';
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

const bunnySprite = await loadImage(bunnyUrl);
const cherryBombSprite = await loadImage(cherryBombUrl);
const playerShipSprite = await loadImage(playerShipUrl);

ctx.drawImage(
  cherryBombSprite,
  canvas.width / 2 - cherryBombSprite.width / 2,
  canvas.height / 2 - cherryBombSprite.height / 2,
);

const thickness = 1;
const width = cherryBombSprite.width + thickness * 2;
const height = cherryBombSprite.height + thickness * 2;

// Create a new canvas for the outline
const outlineCanvas = document.createElement('canvas');
outlineCanvas.width = cherryBombSprite.width + 2;
outlineCanvas.height = cherryBombSprite.height + 2;
const outlineCtx = outlineCanvas.getContext('2d');

if (outlineCtx == null) {
  throw new Error('Could not get 2d context from outline canvas');
}

outlineCtx.imageSmoothingEnabled = false;

// Draw the sprite onto the outline canvas
outlineCtx.drawImage(
  cherryBombSprite,
  1,
  1,
  cherryBombSprite.width,
  cherryBombSprite.height,
);

// Get the pixel data from the temporary canvas
const imageData = outlineCtx.getImageData(0, 0, width, height);
const pixels = imageData.data;

const modifiedIndices = new Set();

const color = {
  r: 255,
  g: 255,
  b: 255,
  a: 255,
};

for (let i = 0; i < pixels.length; i += 4) {
  // const r = pixels[i];
  // const g = pixels[i + 1];
  // const b = pixels[i + 2];
  const a = pixels[i + 3];

  // Check if the current pixel is non-transparent
  if (a > 0) {
    const x = (i / 4) % width;
    const y = Math.floor(i / 4 / width);
    const index = (y * width + x) * 4;

    if (modifiedIndices.has(index)) {
      continue;
    }

    // Check the surrounding pixels
    for (let j = -thickness; j <= thickness; j++) {
      for (let k = -thickness; k <= thickness; k++) {
        const neighborX = x + j;
        const neighborY = y + k;

        if (
          neighborX >= 0 &&
          neighborX < width &&
          neighborY >= 0 &&
          neighborY < height
        ) {
          const neighborIndex = (neighborY * width + neighborX) * 4;

          // Check if the neighbor pixel is transparent and has not already been modified
          if (
            pixels[neighborIndex + 3] === 0 &&
            !modifiedIndices.has(neighborIndex)
          ) {
            pixels[neighborIndex] = color.r;
            pixels[neighborIndex + 1] = color.g;
            pixels[neighborIndex + 2] = color.b;
            pixels[neighborIndex + 3] = 255;

            modifiedIndices.add(neighborIndex);
          }
        }
      }
    }
  }
}

// Put the modified image data back onto the outline canvas
outlineCtx.putImageData(imageData, 0, 0);

ctx.drawImage(outlineCanvas, 10, 10);
