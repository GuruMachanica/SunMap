import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export default function PhotorealisticHeroMedia({ mode = 'morning' }) {
  const containerRef = useRef(null);
  const currentModeRef = useRef(mode);
  const [activeMode, setActiveMode] = useState(mode);

  const frames = {
    morning: '/assets/morning-frame.jpg',
    afternoon: '/assets/afternoon-frame.jpg',
    evening: '/assets/evening-frame.jpg',
    night: '/assets/night-frame.jpg'
  };

  // Zero-Lag Sink & Rise Animation Timeline
  useEffect(() => {
    if (mode === currentModeRef.current) return;
    const targetMode = mode;
    const container = containerRef.current;
    if (!container) return;

    currentModeRef.current = targetMode;

    const tl = gsap.timeline();

    // 1. House sinks down (translateY: 40px, opacity: 0.8) over 0.16s
    tl.to(container, {
      y: 40,
      opacity: 0.8,
      duration: 0.16,
      ease: 'power1.in',
      onComplete: () => {
        // 2. Switch lighting / render to target time state at 0.16s
        setActiveMode(targetMode);
      }
    });

    // 3. House rises smoothly back to center (translateY: 0px, opacity: 1) over 0.32s with power2.out
    tl.to(container, {
      y: 0,
      opacity: 1.0,
      duration: 0.32,
      ease: 'power2.out'
    });
  }, [mode]);

  // Subtle Mouse Parallax
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 14;
    const y = (e.clientY / innerHeight - 0.5) * 8;
    setMouseOffset({ x, y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none',
        background: '#0c1117'
      }}
    >
      {/* Visual House Container that sinks and rises */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: -20,
          width: 'calc(100vw + 40px)',
          height: 'calc(100vh + 40px)',
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform, opacity'
        }}
      >
        {Object.entries(frames).map(([key, src]) => {
          const isCurrent = activeMode === key;

          return (
            <img
              key={key}
              src={src}
              alt={`Modern Solar Homestead - ${key}`}
              className="hero-bg-media"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: isCurrent ? 2 : 1,
                opacity: isCurrent ? 1 : 0,
                transition: 'opacity 0.25s ease-in-out',
                pointerEvents: 'none'
              }}
            />
          );
        })}
      </div>

      {/* Cinematic Horizon Contrast Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            mode === 'night'
              ? 'radial-gradient(ellipse at 50% 45%, rgba(4, 7, 15, 0.15) 0%, rgba(4, 7, 15, 0.6) 65%, rgba(4, 7, 15, 0.92) 100%)'
              : mode === 'evening'
              ? 'radial-gradient(ellipse at 50% 45%, rgba(20, 10, 5, 0.1) 0%, rgba(20, 10, 5, 0.45) 65%, rgba(12, 17, 23, 0.88) 100%)'
              : 'radial-gradient(ellipse at 50% 45%, rgba(12, 17, 23, 0.12) 0%, rgba(12, 17, 23, 0.48) 65%, rgba(12, 17, 23, 0.88) 100%)',
          zIndex: 3,
          transition: 'background 0.5s ease',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
