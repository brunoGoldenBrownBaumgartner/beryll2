import React, { useEffect, useRef, useState } from 'react';
import './Heart.css';
import heartbeatSound from '../heartbeat.mp3';

const HeartCanvas = () => {
  const canvasRef = useRef(null);
  // eslint-disable-next-line
  const [pulseVisual, setPulseVisual] = useState(() => () => {}); 
 // Funktion als anfänglichen Zustand
  const audioRef = useRef(new Audio(heartbeatSound)); // Ref für das Audio-Element

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const rand = Math.random;

    const heartPosition = (rad) => {
      return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
    };

    const scaleAndTranslate = (pos, sx, sy, dx, dy) => {
      return [dx + pos[0] * sx, dy + pos[1] * sy];
    };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const traceCount = window.isDevice ? 20 : 50;
    const pointsOrigin = [];
    const dr = window.isDevice ? 0.3 : 0.1;

    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));

    const heartPointsCount = pointsOrigin.length;

    const targetPoints = [];
    const pulse = (kx, ky) => {
      for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
      }
    };

    const e = [];
    for (let i = 0; i < heartPointsCount; i++) {
      const x = rand() * width;
      const y = rand() * height;
      e[i] = {
        vx: 0,
        vy: 0,
        R: 2,
        speed: rand() + 5,
        q: ~~(rand() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.2 * rand() + 0.7,f: "hsla(" + ~~(45 + 15 * rand()) + ", 100%, 50%, 0.3)",
        trace: [],
      };
      for (let k = 0; k < traceCount; k++) e[i].trace[k] = { x: x, y: y };
    }

    const config = {
      traceK: 0.4,
      timeDelta: 0.01,
    };

    let time = 0;
    const loop = () => {
      const n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);
      time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? 0.2 : 1) * config.timeDelta;
      ctx.fillStyle = "rgba(200,200,200,.1)";
      ctx.fillRect(0, 0, width, height);
      for (let i = e.length; i--;) {
        const u = e[i];
        const q = targetPoints[u.q];
        const dx = u.trace[0].x - q[0];
        const dy = u.trace[0].y - q[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        if (10 > length) {
          if (0.95 < rand()) {
            u.q = ~~(rand() * heartPointsCount);
          } else {
            if (0.99 < rand()) {
              u.D *= -1;
            }
            u.q += u.D;
            u.q %= heartPointsCount;
            if (0 > u.q) {
              u.q += heartPointsCount;
            }
          }
        }
        u.vx += -dx / length * u.speed;
        u.vy += -dy / length * u.speed;
        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;
        u.vx *= u.force;
        u.vy *= u.force;
        for (let k = 0; k < u.trace.length - 1;) {
          const T = u.trace[k];
          const N = u.trace[++k];
          N.x -= config.traceK * (N.x - T.x);
          N.y -= config.traceK * (N.y - T.y);
        }
        ctx.fillStyle = u.f;
        for (let k = 0; k < u.trace.length; k++) {
          ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
        }
      }
      window.requestAnimationFrame(loop);
    };

    const onHeartClick = () => {
      const originalScale = canvas.style.transform || "scale(1)";

      const pulseVisual = (scale) => {
        canvas.style.transform = `${originalScale} scale(${scale})`;
        setTimeout(() => {
          canvas.style.transform = originalScale;
        }, 300);
      };

      setPulseVisual(() => pulseVisual);

      audioRef.current.play();

      pulseVisual(1.2);
      setTimeout(() => {
        pulseVisual(1.2);
        setTimeout(() => {
          pulseVisual(1.2);
        }, 1100);
      }, 1200);
    };

    canvas.addEventListener('click', onHeartClick);

    loop();
  }, []);

  return <canvas ref={canvasRef} id="heart" />;
};

export default HeartCanvas;
