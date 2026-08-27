import React, { useState, useEffect } from 'react';
import { Zap, BatteryCharging, Sun, Activity } from 'lucide-react';

export default function TelemetryLeftCard({ mode = 'morning' }) {
  const isNight = mode === 'night';
  const [solarKw, setSolarKw] = useState(8.4);
  const [batteryPct, setBatteryPct] = useState(98);

  // Live fluctuating micro-telemetry effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (mode === 'morning') {
        setSolarKw((8.3 + Math.random() * 0.25).toFixed(1));
        setBatteryPct(98);
      } else {
        setSolarKw(0.0);
        setBatteryPct(94);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [mode]);

  // Card 3D tilt on mouse hover
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  // Circular SVG progress calculation
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (batteryPct / 100) * circumference;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '240px',
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
      {/* Header with Live Pulsing Emerald Status Beacon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
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
              background: '#00FFA3',
              boxShadow: '0 0 10px #00FFA3, 0 0 20px #00FFA3',
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
            Live Generation
          </span>
        </div>
        <Zap size={14} color="#38bdf8" />
      </div>

      {/* Solar Generation Metric */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            fontSize: '0.75rem',
            color: 'rgba(148, 163, 184, 0.9)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '4px'
          }}
        >
          <Sun size={13} color={isNight ? '#64748b' : '#f59e0b'} />
          <span>{isNight ? 'BESS Discharge' : 'Solar Photovoltaic'}</span>
        </div>
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            fontFamily: 'monospace',
            color: isNight ? '#38bdf8' : '#fbbf24',
            display: 'flex',
            alignItems: 'baseline',
            gap: '4px'
          }}
        >
          {isNight ? '2.1' : solarKw}
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)' }}>
            kW
          </span>
        </div>
      </div>

      {/* Battery State with Circular Animated Progress Ring */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '10px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <div style={{ position: 'relative', width: '58px', height: '58px' }}>
          <svg width="58" height="58" viewBox="0 0 58 58">
            <circle
              cx="29"
              cy="29"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4.5"
            />
            <circle
              cx="29"
              cy="29"
              r={radius}
              fill="transparent"
              stroke="#00FFA3"
              strokeWidth="4.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 29 29)"
              style={{
                transition: 'stroke-dashoffset 0.8s ease',
                filter: 'drop-shadow(0 0 6px rgba(0, 255, 163, 0.5))'
              }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              color: '#ffffff'
            }}
          >
            {batteryPct}%
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'uppercase'
            }}
          >
            Powerwall 3
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#00FFA3',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '2px'
            }}
          >
            <BatteryCharging size={13} />
            <span>{isNight ? 'Active Reserve' : 'Fully Charged'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
