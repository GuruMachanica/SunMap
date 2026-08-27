import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, Cpu } from 'lucide-react';

export default function TelemetryRightCard({ mode = 'morning' }) {
  const isNight = mode === 'night';
  const [savings, setSavings] = useState(14280);

  // Subtle live increment effect on savings
  useEffect(() => {
    const interval = setInterval(() => {
      setSavings((prev) => prev + (Math.random() > 0.5 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Card 3D tilt on mouse hover
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '250px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
    >
      {/* Header with AI Autonomous Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#38bdf8',
              boxShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8',
              animation: 'pulse 2s infinite'
            }}
          />
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'rgba(255, 255, 255, 0.75)',
              textTransform: 'uppercase',
              fontFamily: 'monospace'
            }}
          >
            Grid Independence
          </span>
        </div>
        <Cpu size={14} color="#00FFA3" />
      </div>

      {/* Grid Draw & Self-Sufficiency */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '8px 10px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.68rem', color: 'rgba(148, 163, 184, 0.8)', textTransform: 'uppercase' }}>
            Grid Draw
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'monospace', color: '#00FFA3' }}>
            0.00 <span style={{ fontSize: '0.7rem' }}>kW</span>
          </div>
        </div>

        <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '8px 10px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.68rem', color: 'rgba(148, 163, 184, 0.8)', textTransform: 'uppercase' }}>
            Autonomy
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>
            100%
          </div>
        </div>
      </div>

      {/* Est. 7-Yr Savings Metric */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(148, 163, 184, 0.85)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} color="#fbbf24" />
            <span>Est. 7-Yr Guaranteed Savings</span>
          </div>
        </div>
        <div
          style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            fontFamily: 'monospace',
            color: '#f8fafc',
            marginTop: '2px'
          }}
        >
          ${savings.toLocaleString()}
        </div>
      </div>

      {/* Pulsing Live SVG Sparkline Waveform */}
      <div style={{ position: 'relative', width: '100%', height: '34px', overflow: 'hidden' }}>
        <svg width="100%" height="34" viewBox="0 0 200 34" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparklineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 24 Q 25 10, 50 18 T 100 8 T 150 16 T 200 12 L 200 34 L 0 34 Z"
            fill="url(#sparklineGrad)"
          />
          <path
            d="M 0 24 Q 25 10, 50 18 T 100 8 T 150 16 T 200 12"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.8))'
            }}
          />
        </svg>
      </div>
    </div>
  );
}
