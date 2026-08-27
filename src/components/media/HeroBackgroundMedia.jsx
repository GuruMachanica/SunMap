import React, { useRef, useEffect, useState } from 'react';

export default function HeroBackgroundMedia({ mode = 'morning' }) {
  const videoRef = useRef(null);
  const [hasVideo, setHasVideo] = useState(false);

  // Video scrub / playback logic if day-night-transition.mp4 is available
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setHasVideo(true);
    video.addEventListener('canplaythrough', handleCanPlay);

    if (hasVideo && video.duration) {
      if (mode === 'night') {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, [mode, hasVideo]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      {/* 1. Daylight Photorealistic Architectural Frame */}
      <img
        src="/assets/morning-frame.jpg"
        alt="Modern Solar Homestead - Morning Sunlight"
        className="hero-bg-media"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 1,
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: mode === 'morning' ? 1 : 0
        }}
      />

      {/* 2. Nighttime Photorealistic Architectural Frame with Glowing Windows */}
      <img
        src="/assets/night-frame.jpg"
        alt="Modern Solar Homestead - Night Illumination"
        className="hero-bg-media"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 2,
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: mode === 'night' ? 1 : 0
        }}
      />

      {/* 3. HTML5 Video Background Element (Optional Scrubbing / Playback) */}
      <video
        id="hero-video"
        className="hero-bg-media"
        muted
        playsInline
        preload="auto"
        poster="/assets/morning-frame.jpg"
        ref={videoRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 3,
          pointerEvents: 'none',
          display: hasVideo ? 'block' : 'none'
        }}
      >
        <source src="/assets/day-night-transition.mp4" type="video/mp4" />
      </video>

      {/* 4. Cinematic Vignette Gradient for High-Contrast Readable SaaS Typography */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            mode === 'night'
              ? 'radial-gradient(ellipse at 50% 45%, rgba(4, 7, 15, 0.2) 0%, rgba(4, 7, 15, 0.65) 65%, rgba(4, 7, 15, 0.92) 100%)'
              : 'radial-gradient(ellipse at 50% 45%, rgba(12, 17, 23, 0.15) 0%, rgba(12, 17, 23, 0.52) 65%, rgba(12, 17, 23, 0.88) 100%)',
          zIndex: 4,
          transition: 'background 0.8s ease'
        }}
      />
    </div>
  );
}
