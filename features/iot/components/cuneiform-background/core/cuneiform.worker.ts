import { renderGrid } from "./renderGrid";

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let animationFrameId: number;

let width = 0;
let height = 0;
let time = 0;
let lastDrawTime = 0;

let config: any = {
  isPageVisible: true,
  pointer: { x: -1000, y: -1000 },
  matrixDensity: 30,
  matrixSize: 2,
  matrixHoverSize: 4,
  matrixOpacity: 100,
  matrixColor: "#00ff00",
  matrixMoving: true,
  matrixMouseEffect: true,
  matrixTwinkleEffect: true,
  matrixTwinkleSpeed: 1,
  isDark: true,
  animationsEnabled: true,
  animationsFps: 60,
  isMobile: false,
};

let targetPointer = { x: -1000, y: -1000 };

const render = (currentTime: number) => {
  animationFrameId = requestAnimationFrame(render);
  
  if (!ctx || !canvas) return;
  if (lastDrawTime === 0) lastDrawTime = currentTime;
  if (!config.isPageVisible) return;
  if (!config.animationsEnabled && time > 0) return;

  const fpsInterval = 1000 / config.animationsFps;
  const elapsed = currentTime - lastDrawTime;

  if (elapsed < fpsInterval) return;

  lastDrawTime = currentTime - (elapsed % fpsInterval);

  if (config.animationsEnabled && config.matrixMoving) {
    time += elapsed / (1000 / 60);
  }
  
  config.pointer.x += (targetPointer.x - config.pointer.x) * 0.1;
  config.pointer.y += (targetPointer.y - config.pointer.y) * 0.1;

  renderGrid({
    ctx, 
    width, 
    height, 
    time, 
    pointer: config.pointer,
    matrixDensity: config.matrixDensity, 
    matrixSize: config.matrixSize, 
    matrixHoverSize: config.matrixHoverSize, 
    matrixOpacity: config.matrixOpacity, 
    matrixColor: config.matrixColor,
    matrixMouseEffect: config.matrixMouseEffect, 
    matrixTwinkleEffect: config.matrixTwinkleEffect, 
    matrixTwinkleSpeed: config.matrixTwinkleSpeed, 
    isDark: config.isDark, 
    animationsEnabled: config.animationsEnabled,
    isMobile: config.isMobile
  });
};

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'INIT':
      canvas = payload.canvas;
      ctx = canvas?.getContext('2d') as OffscreenCanvasRenderingContext2D | null;
      width = payload.width;
      height = payload.height;
      Object.assign(config, payload.config);
      if (payload.devicePixelRatio) {
        ctx?.scale(payload.devicePixelRatio, payload.devicePixelRatio);
      }
      animationFrameId = requestAnimationFrame(render);
      break;

    case 'RESIZE':
      width = payload.width;
      height = payload.height;
      if (payload.isMobile !== undefined) {
        config.isMobile = payload.isMobile;
      }
      if (canvas) {
        canvas.width = width * payload.devicePixelRatio;
        canvas.height = height * payload.devicePixelRatio;
        ctx?.scale(payload.devicePixelRatio, payload.devicePixelRatio);
      }
      break;

    case 'POINTER_UPDATE':
      targetPointer = payload;
      break;

    case 'CONFIG_UPDATE':
      Object.assign(config, payload);
      break;
      
    case 'CLEANUP':
      cancelAnimationFrame(animationFrameId);
      break;
  }
};
