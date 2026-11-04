import React, { useEffect, useRef } from 'react';

export default function AmbientEffects({ type = 'snow' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!type || type === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialisation des particules selon le type
    const particles = [];
    const count = type === 'snow' ? 55 : type === 'hearts' ? 24 : 45;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === 'hearts' ? Math.random() * 12 + 10 : Math.random() * 3.5 + 1.2,
        speedX: (Math.random() - 0.5) * (type === 'hearts' ? 0.6 : 0.8),
        speedY: type === 'hearts' ? -(Math.random() * 0.9 + 0.4) : Math.random() * 1.2 + 0.5,
        opacity: Math.random() * 0.6 + 0.25,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.03
      });
    }

    const drawHeart = (cx, cy, size, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#FF4D6D';
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.2);
      ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawSnow = (cx, cy, size, alpha) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#FFFFFF';
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (cx, cy, size, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#FFDF78';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ECC880';
      ctx.beginPath();
      for (let j = 0; j < 4; j++) {
        ctx.lineTo(Math.cos(((j * 90 + 0) * Math.PI) / 180) * size * 1.6, Math.sin(((j * 90 + 0) * Math.PI) / 180) * size * 1.6);
        ctx.lineTo(Math.cos(((j * 90 + 45) * Math.PI) / 180) * (size * 0.4), Math.sin(((j * 90 + 45) * Math.PI) / 180) * (size * 0.4));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Boucle sans fin des particules
        if (type === 'hearts') {
          if (p.y < -20) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
        } else {
          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        }

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        if (type === 'snow') {
          drawSnow(p.x, p.y, p.size, p.opacity);
        } else if (type === 'hearts') {
          drawHeart(p.x, p.y, p.size, p.opacity);
        } else {
          drawStar(p.x, p.y, p.size, p.opacity);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  if (!type || type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 15,
        width: '100%',
        height: '100%'
      }}
    />
  );
}
