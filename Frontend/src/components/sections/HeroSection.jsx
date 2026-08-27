import React, { useState } from 'react';
import PhotorealisticHeroMedia from '../media/PhotorealisticHeroMedia';
import ModeToggle from '../ui/ModeToggle';
import { Box, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function HeroSection({ onLaunchStudio, onOpenQuote }) {
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

      {/* 2. UI Overlay Container */}
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
        {/* Top Center: Shimmer Badge & Hero Heading */}
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
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(9, 13, 22, 0.75)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              backdropFilter: 'blur(16px)',
              marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
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
              fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '14px',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)'
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

          {/* Value Subheading */}
          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
              color: '#e2e8f0',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
            }}
          >
            Eliminate 25-40% shading errors with sub-degree LOD2 CityGML facet extraction, real-time WebGL shadow occlusion, and bankable PVLib solar yield forecasting.
          </p>

          {/* Primary Interactive CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '24px',
              pointerEvents: 'auto'
            }}
          >
            <button
              onClick={onLaunchStudio}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 25px rgba(245, 158, 11, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
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
                padding: '12px 24px',
                borderRadius: '9999px',
                background: 'rgba(9, 13, 22, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(16px)',
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
