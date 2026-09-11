"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./WebGLBackground.module.css";

/**
 * Live 3D network scene — full-bleed hero background.
 *
 * Features:
 *   - Perspective projection (canvas 2D, no Three.js dependency)
 *   - Behind-camera nodes skipped (prevents negative radius)
 *   - Responds to scroll: rotation + tilt follow scrollY, fades on scroll out
 *   - Auto-scales to viewport; collapses node count on small screens
 *   - Respects prefers-reduced-motion
 */
export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    // --- Config (responsive counts) ---
    let NODE_COUNT = 54;
    let PACKET_COUNT = 68;
    let FOV = 720;
    let ROT_SPEED = 0.00030;

    type Node3 = { x: number; y: number; z: number; r: number; phase: number };
    type Packet = {
      from: number;
      to: number;
      t: number;
      speed: number;
      size: number;
    };

    let nodes: Node3[] = [];
    let packets: Packet[] = [];

    let anchorX = 0;
    let anchorY = 0;
    let sceneScale = 1;

    let scrollY = 0;
    let heroHeight = 1;
    let opacity = 1;

    function buildScene() {
      anchorX = w * 0.72;
      anchorY = h * 0.5;
      sceneScale = Math.max(w, h) / 900;

      const baseRadius = 330 * sceneScale;
      const radiusJitter = 190 * sceneScale;

      nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / NODE_COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const radius = baseRadius + Math.random() * radiusJitter;
        return {
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.sin(phi) * Math.sin(theta) * 0.62,
          z: radius * Math.cos(phi),
          r: 1.4 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
        };
      });

      packets = Array.from({ length: PACKET_COUNT }, () => {
        const from = Math.floor(Math.random() * NODE_COUNT);
        let to = Math.floor(Math.random() * NODE_COUNT);
        if (to === from) to = (to + 1) % NODE_COUNT;
         return {
          from,
          to,
          t: Math.random(),
          speed: 0.0012 + Math.random() * 0.0028,
          size: 1.6 + Math.random() * 2,
        };
      });
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Responsive quality scaling
            if (w < 640) {
        NODE_COUNT = 28;
        PACKET_COUNT = 34;
        FOV = 620;
        ROT_SPEED = 0.00009;
      } else if (w < 1024) {
        NODE_COUNT = 40;
        PACKET_COUNT = 50;
        FOV = 680;
        ROT_SPEED = 0.00011;
      } else {
        NODE_COUNT = 54;
        PACKET_COUNT = 68;
        FOV = 720;
        ROT_SPEED = 0.00013;
      }

      // On narrow screens, anchor scene to bottom-right (keeps text clear)
      if (w < 900) {
        anchorX = w * 0.78;
        anchorY = h * 0.62;
      }

      buildScene();
    }

    // Skip nodes behind the camera to avoid negative scale
    function project(
      x: number,
      y: number,
      z: number,
      angleY: number,
      tiltX: number
    ): { x: number; y: number; z: number; scale: number } | null {
      const cy = Math.cos(angleY);
      const sy = Math.sin(angleY);
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;

      const cx = Math.cos(tiltX);
      const sx = Math.sin(tiltX);
      const y1 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;

      const denom = FOV + z2;
      // Behind camera → cull
      if (denom < FOV * 0.35) return null;

      const scale = FOV / denom;
      const sx2 = anchorX + x1 * scale;
      const sy2 = anchorY + y1 * scale;
      return { x: sx2, y: sy2, z: z2, scale };
    }

    const start = performance.now();

    function draw(now: number) {
      if (!ctx) return;
      const t = now - start;

      // Scroll response — rotation, tilt, and fade all follow scroll
      const sNorm = Math.max(0, Math.min(1, scrollY / Math.max(1, heroHeight)));
      const scrollRot = sNorm * 1.2; // extra Y rotation
      const scrollTilt = sNorm * 0.35; // extra X tilt
      const scrollRise = sNorm * -30; // scene drifts up slightly

            // Fade only 25% max, only after 60% scroll into hero
      const fadeProgress = Math.max(0, (sNorm - 0.6) / 0.4);
      opacity = reduced ? 1 : 1 - fadeProgress * 0.25;

      const angleY = t * ROT_SPEED + scrollRot;
      const tiltX = -0.3 + Math.sin(t * 0.0001) * 0.12 + scrollTilt;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.globalAlpha = Math.max(0, opacity);
      ctx.translate(0, scrollRise);

      // --- Orbital rings ---
      drawRings(ctx, t, angleY, tiltX);

      // --- Project nodes (skip nulls) ---
      const projected = nodes.map((n) =>
        project(n.x, n.y, n.z, angleY, tiltX)
      );

      // --- Connections ---
      ctx.lineWidth = 0.9;
      const reach = 380 * sceneScale;
      for (let i = 0; i < nodes.length; i++) {
        const pa = projected[i];
        if (!pa) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const pb = projected[j];
          if (!pb) continue;
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < reach) {
            const depthAvg = (pa.scale + pb.scale) * 0.5;
            const alpha = (1 - d / reach) * 0.36 * depthAvg;
            ctx.strokeStyle = `rgba(124, 92, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
      }

      // --- Depth-sorted nodes ---
      const order = nodes
        .map((_, i) => i)
        .filter((i) => projected[i] !== null)
        .sort((a, b) => projected[b]!.z - projected[a]!.z);

      for (const i of order) {
        const p = projected[i]!;
        const n = nodes[i];
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0016 + n.phase);
        const baseAlpha = Math.max(0.3, Math.min(1, p.scale * 1.05));
        const radius = Math.max(0.5, n.r * p.scale * (1 + pulse * 0.3));

        ctx.fillStyle = `rgba(124, 92, 255, ${baseAlpha * 0.34})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 3.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(190, 170, 255, ${baseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Packets ---
      for (const pack of packets) {
        pack.t += pack.speed;
        if (pack.t >= 1) {
          pack.t = 0;
          pack.from = pack.to;
          let next = Math.floor(Math.random() * NODE_COUNT);
          if (next === pack.from) next = (next + 1) % NODE_COUNT;
          pack.to = next;
        }
        const a = nodes[pack.from];
        const b = nodes[pack.to];
        if (!a || !b) continue;

        const x = a.x + (b.x - a.x) * pack.t;
        const y = a.y + (b.y - a.y) * pack.t;
        const z = a.z + (b.z - a.z) * pack.t;
        const p = project(x, y, z, angleY, tiltX);
        if (!p) continue;

        const alpha = Math.sin(pack.t * Math.PI) * 0.95 * p.scale;
        if (alpha <= 0) continue;
        const s1 = Math.max(0.3, pack.size * p.scale * 3.6);
        const s2 = Math.max(0.2, pack.size * p.scale);

        ctx.fillStyle = `rgba(140, 110, 255, ${alpha * 0.42})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(220, 205, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s2, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Endpoint ---
      drawEndpoint(ctx, anchorX, anchorY + scrollRise * -1, t, sceneScale);

      ctx.restore();
      raf = requestAnimationFrame(draw);
    }

    function drawRings(
      c: CanvasRenderingContext2D,
      t: number,
      angleY: number,
      tiltX: number
    ) {
      const ringSpecs = [
        { r: 260 * sceneScale, tilt: 0.28, speed: 0.00020, seg: 96, a: 0.22 },
        { r: 380 * sceneScale, tilt: -0.46, speed: -0.00014, seg: 120, a: 0.14 },
      ];

      for (const ring of ringSpecs) {
        const rot = t * ring.speed + angleY * 0.4;
        c.lineWidth = 1.1;
        c.beginPath();
        let started = false;
        for (let i = 0; i <= ring.seg; i++) {
          const a = (i / ring.seg) * Math.PI * 2;
          const x3 = Math.cos(a) * ring.r;
          const z3 = Math.sin(a) * ring.r;
          const y3 = Math.sin(a) * ring.r * ring.tilt;
          const p = project(x3, y3, z3, rot, tiltX);
          if (!p) {
            started = false;
            continue;
          }
          if (!started) {
            c.moveTo(p.x, p.y);
            started = true;
          } else {
            c.lineTo(p.x, p.y);
          }
        }
        c.strokeStyle = `rgba(124, 92, 255, ${ring.a})`;
        c.stroke();
      }
    }

    function drawEndpoint(
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      t: number,
      scale: number
    ) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.002);

      const haloS = 210 * scale;
      const halo = c.createRadialGradient(cx, cy, 0, cx, cy, haloS + pulse * 40);
      halo.addColorStop(0, "rgba(124, 92, 255, 0.34)");
      halo.addColorStop(0.4, "rgba(124, 92, 255, 0.1)");
      halo.addColorStop(1, "rgba(124, 92, 255, 0)");
      c.fillStyle = halo;
      c.beginPath();
      c.arc(cx, cy, haloS + pulse * 40, 0, Math.PI * 2);
      c.fill();

      c.strokeStyle = `rgba(168, 140, 255, ${0.32 + pulse * 0.35})`;
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(cx, cy, (52 + pulse * 10) * scale, 0, Math.PI * 2);
      c.stroke();

      c.strokeStyle = `rgba(124, 92, 255, ${0.16 + pulse * 0.18})`;
      c.lineWidth = 0.9;
      c.beginPath();
      c.arc(cx, cy, (84 + pulse * 14) * scale, 0, Math.PI * 2);
      c.stroke();

      const coreR = Math.max(1, 36 * scale);
      const core = c.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      core.addColorStop(0, "rgba(235, 225, 255, 1)");
      core.addColorStop(0.55, "rgba(124, 92, 255, 0.95)");
      core.addColorStop(1, "rgba(124, 92, 255, 0)");
      c.fillStyle = core;
      c.beginPath();
      c.arc(cx, cy, coreR * 0.85, 0, Math.PI * 2);
      c.fill();
    }

        function onScroll() {
      scrollY = window.scrollY;
      const hero = document.getElementById("hero");
      heroHeight = hero?.offsetHeight ?? window.innerHeight;
    }

    // Debounced resize — prevents mobile address-bar scroll spam
    let resizeTimer: number | null = null;
    function onResize() {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        onScroll();
        resizeTimer = null;
      }, 200);
    }

    // Pause animation while tab is hidden (battery + CPU)
    let paused = false;
    function onVisibility() {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(raf);
      } else if (!reduced && !paused === false) {
        paused = false;
        raf = requestAnimationFrame(draw);
      }
    }

    resize();
    onScroll();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    if (!reduced) {
      raf = requestAnimationFrame(draw);
    } else {
      draw(start + 1);
      cancelAnimationFrame(raf);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className={styles.wrap} aria-hidden>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} />
    </div>
  );
}
