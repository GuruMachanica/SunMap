import React, { useState } from 'react';
import PhotorealisticHeroMedia from '../media/PhotorealisticHeroMedia';
import ModeToggle from '../ui/ModeToggle';
import { Box, ArrowRight, Zap, Sparkles } from 'lucide-react';

export default function HeroSection({ onLaunchStudio, onOpenQuote }) {
  const [mode, setMode] = useState('morning');

  return (
    <section
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#070a12'
      }}
    >
      {/* 1. Photorealistic 4-State Architectural Media with Contrast Gradient */}
      <PhotorealisticHeroMedia mode={mode} />

      {/* 2. Top-to-Bottom Ambient Dark Vignette Overlay for Crisp Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(9, 13, 22, 0.85) 0%, rgba(9, 13, 22, 0.45) 45%, rgba(9, 13, 22, 0.85) 100%)',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      />

      {/* 3. UI Overlay Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '92px',
          paddingBottom: '32px',
          paddingLeft: '20px',
          paddingRight: '20px',
          boxSizing: 'border-box'
        }}
      >
        {/* Center: High-Contrast Glassmorphic Card */}
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            textAlign: 'center',
            background: 'rgba(9, 13, 22, 0.78)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '28px',
            padding: '36px 32px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            pointerEvents: 'auto'
          }}
        >
          {/* Shimmering Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              marginBottom: '14px'
            }}
          >
            <Zap size={14} color="#f59e0b" />
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#fbbf24',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              AI-Powered 3D Spatial Solar Engine v2.4
            </span>
          </div>

          {/* Main Hero Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4.8vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '14px'
            }}
          >
            Precision 3D Solar Potential &amp; <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fef08a 50%, #ea580c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Rooftop Intelligence
            </span>
          </h1>

          {/* Value Subheading with Razor-Sharp Contrast */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              color: '#f1f5f9',
              lineHeight: 1.7,
              maxWidth: '780px',
              margin: '0 auto',
              fontWeight: 500,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
            }}
          >
            Eliminate <span style={{ color: '#fbbf24', fontWeight: 700 }}>25-40% shading errors</span> with sub-degree <span style={{ color: '#38bdf8', fontWeight: 700 }}>LOD2 CityGML</span> facet extraction, real-time <span style={{ color: '#a78bfa', fontWeight: 700 }}>WebGL shadow occlusion</span>, and bankable <span style={{ color: '#34d399', fontWeight: 700 }}>PVLib solar yield forecasting</span>.
          </p>

          {/* Primary Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              marginTop: '26px',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={onLaunchStudio}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 30px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 25px rgba(245, 158, 11, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <Box size={18} />
              <span>Launch 3D Studio</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onOpenQuote}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span>Instant Solar Audit</span>
            </button>
          </div>
        </div>

        {/* Bottom Floating Control Bar: Day/Night Mode Switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'auto'
          }}
        >
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>
      </div>
    </section>
  );
}
