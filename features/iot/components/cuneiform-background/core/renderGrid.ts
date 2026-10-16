interface RenderGridConfig {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  pointer: { x: number; y: number };
  matrixDensity: number;
  matrixSize: number;
  matrixHoverSize: number;
  matrixOpacity: number;
  matrixColor: string;
  matrixMouseEffect: boolean;
  matrixTwinkleEffect: boolean;
  matrixTwinkleSpeed: number;
  isDark: boolean;
  animationsEnabled: boolean;
  isMobile: boolean;
}

const LUT_SIZE = 3600;
const SIN_LUT = new Float32Array(LUT_SIZE);
const COS_LUT = new Float32Array(LUT_SIZE);

for (let i = 0; i < LUT_SIZE; i++) {
  const rad = (i / LUT_SIZE) * Math.PI * 2;
  SIN_LUT[i] = Math.sin(rad);
  COS_LUT[i] = Math.cos(rad);
}

const FAST_RAD_CONVERSION = LUT_SIZE / (Math.PI * 2);

const GLOW_RADIUS = 300;
const GLOW_RADIUS_SQ = GLOW_RADIUS * GLOW_RADIUS;
const INTENSITY_LUT = new Float32Array(GLOW_RADIUS_SQ + 1);
for (let dSq = 0; dSq <= GLOW_RADIUS_SQ; dSq++) {
  const dist = Math.sqrt(dSq);
  INTENSITY_LUT[dSq] = 1 - Math.pow(dist / GLOW_RADIUS, 1.5);
}

const TWINKLE_LUT_SIZE = 1000;
const TWINKLE_POW_LUT = new Float32Array(TWINKLE_LUT_SIZE + 1);
for(let i = 0; i <= TWINKLE_LUT_SIZE; i++) {
   TWINKLE_POW_LUT[i] = Math.pow(i / TWINKLE_LUT_SIZE, 1.5);
}

function fastSin(rad: number): number {
  let idx = (rad * FAST_RAD_CONVERSION) % LUT_SIZE;
  if (idx < 0) idx += LUT_SIZE;
  return SIN_LUT[idx | 0];
}

function fastCos(rad: number): number {
  let idx = (rad * FAST_RAD_CONVERSION) % LUT_SIZE;
  if (idx < 0) idx += LUT_SIZE;
  return COS_LUT[idx | 0];
}

export function renderGrid({
  ctx, width, height, time, pointer, matrixDensity, matrixSize, matrixHoverSize,
  matrixOpacity, matrixColor, matrixMouseEffect, matrixTwinkleEffect,
  matrixTwinkleSpeed, isDark, animationsEnabled, isMobile
}: RenderGridConfig) {
  const SPACING = matrixDensity;
  const CROSS_SIZE = matrixSize; 

  const effectiveMouseEffect = matrixMouseEffect && !isMobile;

  const speedX = 0.3;
  const speedY = 0.3;
  
  const offsetX = (time * speedX) % SPACING;
  const offsetY = (time * speedY) % SPACING;

  ctx.clearRect(0, 0, width, height);

  const baseColor = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)";

  if (effectiveMouseEffect && pointer.x > -500) {
    const gradient = ctx.createRadialGradient(
      pointer.x, pointer.y, 0, 
      pointer.x, pointer.y, GLOW_RADIUS
    );
    gradient.addColorStop(0, `${matrixColor}33`);
    gradient.addColorStop(1, "transparent");
    
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.lineWidth = 1.2;

  ctx.beginPath();
  const activePoints = [];

  for (let x = -SPACING; x < width + SPACING; x += SPACING) {
    for (let y = -SPACING; y < height + SPACING; y += SPACING) {
      const posX = x + offsetX;
      const posY = y + offsetY;

      const baseAlpha = matrixOpacity / 100;
      let currentAlpha = baseAlpha; 
      let currentSize = CROSS_SIZE;
      let color = baseColor;
      let isDefault = true;
      
      let twinkleFactor = 0;
      if (matrixTwinkleEffect && animationsEnabled) {
        const gridX = (x / SPACING + 0.5) | 0;
        const gridY = (y / SPACING + 0.5) | 0;
        const speed = matrixTwinkleSpeed * 0.0003;
        
        const wave1 = fastSin(gridX * 0.137 + gridY * 0.271 + time * speed);
        const wave2 = fastCos(gridX * 0.223 - gridY * 0.151 + time * speed * 1.3);
        const wave3 = fastSin(gridX * 0.359 + gridY * 0.093 - time * speed * 0.8);
        
        const combined = (wave1 + wave2 + wave3) / 3; 
        
        if (combined > 0.7) {
           let factor = (combined - 0.7) * 3.33333; 
           if (factor > 1) factor = 1;
           twinkleFactor = TWINKLE_POW_LUT[(factor * TWINKLE_LUT_SIZE) | 0]; 
           isDefault = false;
        }
      }

      if (effectiveMouseEffect) {
        const dx = pointer.x - posX;
        const dy = pointer.y - posY;
        const distSq = dx * dx + dy * dy;

        if (distSq <= GLOW_RADIUS_SQ) {
          const intensity = INTENSITY_LUT[distSq | 0]; 
          currentAlpha = baseAlpha + intensity * (1 - baseAlpha);
          currentSize = CROSS_SIZE + intensity * matrixHoverSize;
          color = matrixColor;
          isDefault = false;
        }
      }
      
      if (twinkleFactor > 0) {
         currentAlpha = Math.max(currentAlpha, baseAlpha + twinkleFactor * (1 - baseAlpha));
         currentSize = Math.max(currentSize, CROSS_SIZE + twinkleFactor * matrixHoverSize);
         color = matrixColor;
      }

      if (isDefault) {
        ctx.moveTo(posX - currentSize, posY);
        ctx.lineTo(posX + currentSize, posY);
        ctx.moveTo(posX, posY - currentSize);
        ctx.lineTo(posX, posY + currentSize);
      } else {
        activePoints.push({ posX, posY, currentSize, currentAlpha, color });
      }
    }
  }

  ctx.globalAlpha = matrixOpacity / 100;
  ctx.strokeStyle = baseColor;
  ctx.stroke();

  for (let i = 0; i < activePoints.length; i++) {
    const p = activePoints[i];
    ctx.globalAlpha = p.currentAlpha;
    ctx.strokeStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.posX - p.currentSize, p.posY);
    ctx.lineTo(p.posX + p.currentSize, p.posY);
    ctx.moveTo(p.posX, p.posY - p.currentSize);
    ctx.lineTo(p.posX, p.posY + p.currentSize);
    ctx.stroke();
  }
}
