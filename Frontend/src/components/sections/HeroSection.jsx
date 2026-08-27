import React, { useState } from 'react';
import PhotorealisticHeroMedia from '../media/PhotorealisticHeroMedia';
import ModeToggle from '../ui/ModeToggle';

export default function HeroSection() {
  const [mode, setMode] = useState('morning');

  return (
    <section
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0c1117'
      }}
    >
      {/* 1. Photorealistic 4-State Architectural Media */}
      <PhotorealisticHeroMedia mode={mode} />

      {/* 2. UI Overlay Container (Pointer-events none) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'transparent',
          paddingTop: '96px',
          paddingBottom: '36px',
          paddingLeft: '24px',
          paddingRight: '24px',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Center: Branding Micro-Pill & Main Shimmer Heading */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '960px',
            margin: '0 auto',
            background: 'transparent'
          }}
        >
          {/* Micro-Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '9999px',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
              marginBottom: '12px',
              backdropFilter: 'blur(12px)',
              pointerEvents: 'auto'
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#00FFA3',
                boxShadow: '0 0 8px #00FFA3',
                animation: 'pulse 2s infinite'
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#38bdf8',
                fontFamily: 'monospace'
              }}
            >
              AI-POWERED GRID ARBITRAGE v4.2
            </span>
          </div>

          {/* Main Centered Shimmer Heading */}
          <h1
            className="hero-heading-shimmer"
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
              lineHeight: 1.1,
              marginBottom: '10px',
              fontWeight: 800,
              letterSpacing: '-0.03em'
            }}
          >
            SunMap Solar Power <br />
            <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 400 }}>
              Prediction
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
              color: '#38bdf8',
              fontWeight: 600,
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.85)',
              letterSpacing: '-0.01em',
              margin: '0 auto'
            }}
          >
            $0 Electricity Bills for the next 7 Years
          </p>
        </div>

        {/* Bottom Section: 4-State Mode Toggle & Subtitle */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '740px',
            margin: '0 auto',
            background: 'transparent'
          }}
        >
          {/* 4-State Segmented Pill Toggle */}
          <div
            style={{
              marginBottom: '14px',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              pointerEvents: 'auto'
            }}
          >
            <ModeToggle mode={mode} onToggle={(newMode) => setMode(newMode)} />
          </div>

          {/* Dynamic Status Subtitle */}
          <p
            style={{
              fontSize: 'clamp(0.90rem, 1.35vw, 1.02rem)',
              color: 'rgba(226, 232, 240, 0.92)',
              lineHeight: 1.55,
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.85)',
              margin: '0 auto'
            }}
          >
            Forget energy volatility, weather conditions, and seasonal tariffs. SunMap AI Controller
            guarantees fixed $0 electricity bills for seven full years.
          </p>
        </div>
      </div>
    </section>
  );
}
