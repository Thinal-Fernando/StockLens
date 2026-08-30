"use client";

import { useEffect, useRef } from "react";

type DepthFieldProps = {
  //0–100, from the Depth Rail. Raises or lowers the whole survey
  depth?: number;
  // Seeds the seabed. Same seed, same coastline, every reload
  seed?: number;
  // Soundings are dense on a real chart; set false for quiet surfaces
  showSoundings?: boolean;
  className?: string;
};

function hash3(x: number, y: number, z: number, seed: number): number {
  let h = x * 374761393 + y * 668265263 + z * 1274126177 + seed * 144665477;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function smootherstep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function valueNoise(x: number, y: number, z: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = smootherstep(x - xi);
  const yf = smootherstep(y - yi);
  const zf = smootherstep(z - zi);

  const c = (dx: number, dy: number, dz: number) =>
    hash3(xi + dx, yi + dy, zi + dz, seed);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), xf);
  const x10 = lerp(c(0, 1, 0), c(1, 1, 0), xf);
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), xf);
  const x11 = lerp(c(0, 1, 1), c(1, 1, 1), xf);

  return lerp(lerp(x00, x10, yf), lerp(x01, x11, yf), zf);
}

// Three octaves is enough to read as a seabed and cheap enough to animate
function fbm(x: number, y: number, z: number, seed: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let o = 0; o < 3; o++) {
    sum += valueNoise(x * freq, y * freq, z * freq, seed + o * 101) * amp;
    amp *= 0.5;
    freq *= 2.07;
  }
  return sum / 0.875;
}

type Palette = {
  bands: string[];
  line: string;
  lineStrong: string;
  sounding: string;
};

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) =>
    s.getPropertyValue(name).trim() || fallback;

  return {
    bands: [
      v("--paper", "#f2ede1"),
      v("--shoal-1", "#dce7ec"),
      v("--shoal-2", "#bbd3de"),
      v("--shoal-3", "#7faec2"),
      v("--shoal-4", "#5b93ab"),
    ],
    line: v("--rule", "rgba(20,24,26,0.22)"),
    lineStrong: v("--rule-strong", "rgba(20,24,26,0.46)"),
    sounding: v("--ink-3", "#8a9aa2"),
  };
}

export default function DepthField({
  depth = 46,
  seed = 20260830,
  showSoundings = true,
  className,
}: DepthFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const depthRef = useRef(depth);
  const rafRef = useRef<number | null>(null);
  const redrawRef = useRef<(() => void) | null>(null);

  depthRef.current = depth;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let palette = readPalette();
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Survey resolution. One sample every CELL px
    const CELL = 26;

    const tint = document.createElement("canvas");
    const tctx = tint.getContext("2d");

    let cols = 0;
    let rows = 0;
    let field: Float32Array = new Float32Array(0);

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = Math.max(1, Math.floor(width * dpr));
      el.height = Math.max(1, Math.floor(height * dpr));

      cols = Math.ceil(width / CELL) + 2;
      rows = Math.ceil(height / CELL) + 2;
      field = new Float32Array(cols * rows);

      tint.width = cols;
      tint.height = rows;
    }

    // Sample the seabed into the field buffer
    function survey(t: number) {
      const scale = 0.055;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          field[r * cols + c] = fbm(c * scale, r * scale, t, seed);
        }
      }
    }

    function bandFor(value: number, levels: number[]): number {
      let band = 0;
      for (let i = 0; i < levels.length; i++) {
        if (value > levels[i]) band = i + 1;
      }
      return band;
    }

    function draw(t: number) {
      const el = canvasRef.current;
      if (!el || !tctx || !ctx) return;

      survey(t);

      // The depth rail moves every contour together
      const d = depthRef.current / 100;
      const base = 0.34 + d * 0.26;
      const levels = [
        base,
        base + 0.075,
        base + 0.15,
        base + 0.225,
      ];

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const img = tctx.createImageData(cols, rows);
      const rgbCache = new Map<string, [number, number, number, number]>();

      const toRgb = (css: string): [number, number, number, number] => {
        const cached = rgbCache.get(css);
        if (cached) return cached;
        tctx.fillStyle = "#000";
        tctx.fillStyle = css;
        tctx.clearRect(0, 0, 1, 1);
        tctx.fillRect(0, 0, 1, 1);
        const px = tctx.getImageData(0, 0, 1, 1).data;
        const out: [number, number, number, number] = [
          px[0],
          px[1],
          px[2],
          px[3],
        ];
        rgbCache.set(css, out);
        return out;
      };

      const bandRgb = palette.bands.map(toRgb);
      // Band 0 is open water: the paper shows through untinted
      const bandAlpha = [0, 0.5, 0.72, 0.86, 0.95];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const b = bandFor(field[r * cols + c], levels);
          const [rr, gg, bb] = bandRgb[Math.min(b, bandRgb.length - 1)];
          const i = (r * cols + c) * 4;
          img.data[i] = rr;
          img.data[i + 1] = gg;
          img.data[i + 2] = bb;
          img.data[i + 3] = Math.round(255 * bandAlpha[Math.min(b, 4)]);
        }
      }
      tctx.putImageData(img, 0, 0);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.globalAlpha = 0.9;
      ctx.drawImage(tint, 0, 0, cols, rows, 0, 0, cols * CELL, rows * CELL);
      ctx.globalAlpha = 1;

      // Isobaths: marching squares, cut at one device pixel
      for (let li = 0; li < levels.length; li++) {
        const level = levels[li];
        ctx.beginPath();
        ctx.lineWidth = li === 0 ? 1 : 1;
        ctx.strokeStyle = li >= 2 ? palette.lineStrong : palette.line;

        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const tl = field[r * cols + c];
            const tr = field[r * cols + c + 1];
            const br = field[(r + 1) * cols + c + 1];
            const bl = field[(r + 1) * cols + c];

            const idx =
              (tl > level ? 8 : 0) |
              (tr > level ? 4 : 0) |
              (br > level ? 2 : 0) |
              (bl > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;

            const x0 = c * CELL;
            const y0 = r * CELL;
            const lerpX = (a: number, b: number) =>
              x0 + (CELL * (level - a)) / (b - a || 1e-6);
            const lerpY = (a: number, b: number) =>
              y0 + (CELL * (level - a)) / (b - a || 1e-6);

            const top = { x: lerpX(tl, tr), y: y0 };
            const bottom = { x: lerpX(bl, br), y: y0 + CELL };
            const left = { x: x0, y: lerpY(tl, bl) };
            const right = { x: x0 + CELL, y: lerpY(tr, br) };

            const seg = (
              a: { x: number; y: number },
              b: { x: number; y: number },
            ) => {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            };

            switch (idx) {
              case 1:
              case 14:
                seg(left, bottom);
                break;
              case 2:
              case 13:
                seg(bottom, right);
                break;
              case 3:
              case 12:
                seg(left, right);
                break;
              case 4:
              case 11:
                seg(top, right);
                break;
              case 6:
              case 9:
                seg(top, bottom);
                break;
              case 7:
              case 8:
                seg(left, top);
                break;
              case 5:
                seg(left, top);
                seg(bottom, right);
                break;
              case 10:
                seg(left, bottom);
                seg(top, right);
                break;
            }
          }
        }
        ctx.stroke();
      }

      // Soundings: the figures a survey leaves behind
      if (showSoundings) {
        ctx.fillStyle = palette.sounding;
        ctx.globalAlpha = 0.5;
        ctx.font =
          '9px var(--font-azeret), ui-monospace, SFMono-Regular, monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let r = 1; r < rows - 1; r += 3) {
          for (let c = 1; c < cols - 1; c += 3) {
            // Stagger the survey lines so the grid never reads as a grid
            const jitter = hash3(c, r, 7, seed);
            if (jitter > 0.62) continue;
            const v = field[r * cols + c];
            const fathoms = Math.max(1, Math.round((1 - v) * 60));
            const x = c * CELL + (hash3(c, r, 11, seed) - 0.5) * CELL * 0.7;
            const y = r * CELL + (hash3(c, r, 13, seed) - 0.5) * CELL * 0.7;
            ctx.fillText(String(fathoms), x, y);
          }
        }
        ctx.globalAlpha = 1;
      }
    }

    let t = 0;
    let last = 0;
    const FRAME_MS = 1000 / 10; /* The sea is slow. So is this. */

    function loop(now: number) {
      rafRef.current = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      t += 0.0016;
      draw(t);
    }

    resize();
    draw(0);

    // The rail can force a re-solve without waiting for the next frame, which
    // is the only way the field moves at all under reduced motion
    redrawRef.current = () => draw(t);

    if (!reduceMotion) {
      rafRef.current = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      draw(t);
    };
    window.addEventListener("resize", onResize);

    // Night light swaps the whole plate. Re-read and redraw
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      draw(t);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
      redrawRef.current = null;
    };
  }, [seed, showSoundings]);

  // Redraw immediately when the rail moves, without restarting the survey
  useEffect(() => {
    redrawRef.current?.();
  }, [depth]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
