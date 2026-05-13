/**
 * Image processing utilities — runs entirely in the browser.
 * Generates two derivative versions from a source File:
 *   - full:  long edge clamped to 1920px, WebP (~85%)
 *   - thumb: covered 400x400 square, WebP (~80%)
 *
 * Falls back to the original file on failure.
 */

const FULL_MAX = 1920;
const THUMB_SIZE = 400;
const FULL_QUALITY = 0.85;
const THUMB_QUALITY = 0.8;
const MIME = "image/webp";
const EXT = "webp";

async function loadBitmap(file: File): Promise<ImageBitmap> {
  // createImageBitmap respeita orientação EXIF com a opção "from-image".
  return await createImageBitmap(file, { imageOrientation: "from-image" });
}

function canvasToFile(
  canvas: HTMLCanvasElement,
  baseName: string,
  suffix: string,
  quality: number,
): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Falha a converter imagem."));
          return;
        }
        resolve(
          new File([blob], `${baseName}-${suffix}.${EXT}`, {
            type: MIME,
            lastModified: Date.now(),
          }),
        );
      },
      MIME,
      quality,
    );
  });
}

function makeCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export type ProcessedImage = {
  full: File;
  thumb: File;
};

export async function processImage(file: File): Promise<ProcessedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Ficheiro não é uma imagem.");
  }

  // SVG/GIF: não tentamos transformar para preservar o original.
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return { full: file, thumb: file };
  }

  const bitmap = await loadBitmap(file);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "foto";

  try {
    // ---- FULL: longa aresta = 1920px ----
    const longEdge = Math.max(bitmap.width, bitmap.height);
    const fullScale = longEdge > FULL_MAX ? FULL_MAX / longEdge : 1;
    const fullW = Math.round(bitmap.width * fullScale);
    const fullH = Math.round(bitmap.height * fullScale);
    const fullCanvas = makeCanvas(fullW, fullH);
    const fullCtx = fullCanvas.getContext("2d");
    if (!fullCtx) throw new Error("Canvas indisponível.");
    fullCtx.imageSmoothingEnabled = true;
    fullCtx.imageSmoothingQuality = "high";
    fullCtx.drawImage(bitmap, 0, 0, fullW, fullH);

    // ---- THUMB: cover 400x400 ----
    const thumbCanvas = makeCanvas(THUMB_SIZE, THUMB_SIZE);
    const thumbCtx = thumbCanvas.getContext("2d");
    if (!thumbCtx) throw new Error("Canvas indisponível.");
    thumbCtx.imageSmoothingEnabled = true;
    thumbCtx.imageSmoothingQuality = "high";
    const srcSide = Math.min(bitmap.width, bitmap.height);
    const sx = (bitmap.width - srcSide) / 2;
    const sy = (bitmap.height - srcSide) / 2;
    thumbCtx.drawImage(
      bitmap,
      sx,
      sy,
      srcSide,
      srcSide,
      0,
      0,
      THUMB_SIZE,
      THUMB_SIZE,
    );

    const [full, thumb] = await Promise.all([
      canvasToFile(fullCanvas, baseName, "full", FULL_QUALITY),
      canvasToFile(thumbCanvas, baseName, "thumb", THUMB_QUALITY),
    ]);

    // Se o "full" comprimido for maior que o original (raro: PNG já pequeno),
    // ficamos com o original.
    return {
      full: full.size < file.size ? full : file,
      thumb,
    };
  } finally {
    bitmap.close();
  }
}
