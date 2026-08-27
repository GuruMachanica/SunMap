import React, { useState } from 'react';
import SolarHouse3D from './SolarHouse3D';
import { Sun, Moon, Sunrise, Sunset, Zap, BatteryCharging, ShieldCheck, ArrowDown, Sparkles } from 'lucide-react';

export default function HeroSection({ onOpenQuote, onScrollToCalculator }) {
  const [timeMode, setTimeMode] = useState('morning');

  // Real-time telemetry data that shifts based on the selected time of day
  const timeData = {
    morning: {
      label: 'Morning',
      tagline: '$0 for Electricity',
      solarOutput: '5.2 kW',
      powerRate: '$0.00 / kWh',
      batteryStatus: '92% (Charging)',
      gridStatus: '0 kW (Self-Powered)',
      roofEfficiency: '88.4%',
      glowColor: '#fbbf24'
    },
    noon: {
      label: 'Noon',
      tagline: 'Peak Generation',
      solarOutput: '10.8 kW',
      powerRate: '+$0.18 / kWh (Exporting)',
      batteryStatus: '100% (Full Storage)',
      gridStatus: '+4.8 kW (Feed-In)',
      roofEfficiency: '98.9%',
      glowColor: '#38bdf8'
    },
    sunset: {
      label: 'Sunset',
      tagline: 'Golden Hour Storage',
      solarOutput: '3.6 kW',
      powerRate: '$0.00 / kWh',
      batteryStatus: '98% (Ready for Peak)',
      gridStatus: '0 kW (Self-Powered)',
      roofEfficiency: '74.2%',
      glowColor: '#f97316'
    },
    night: {
      label: 'Night',
      tagline: '100% Battery Powered',
      solarOutput: '0.0 kW (Moonlight)',
      powerRate: '$0.00 from Grid',
      batteryStatus: '84% (Discharging to Home)',
      gridStatus: '0 kW (Self-Sufficient)',
      roofEfficiency: 'Standby Mode',
      glowColor: '#818cf8'
    }
  };

  const currentInfo = timeData[timeMode];

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}
    >
      {/* Background Ambient Glows */}
      <div className="bg-glow-gold" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="bg-glow-blue" style={{ bottom: '15%', right: '10%' }} />

      {/* 3D Canvas Background Engine */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        <SolarHouse3D timeMode={timeMode} />
      </div>

      {/* Top Hero Text Container (Overlaid on 3D scene) */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '900px',
          marginTop: '20px',
          pointerEvents: 'none' /* allow mouse drag through text */
        }}
      >
        {/* Smart Badge */}
        <div
          className="glass-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            marginBottom: '18px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#fbbf24',
            pointerEvents: 'auto'
          }}
        >
          <Sparkles size={16} />
          <span>Next-Generation 3D Solar Intelligence</span>
        </div>

        {/* Main Headline from Reference Design */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            lineHeight: 1.1,
            marginBottom: '16px',
            color: '#ffffff',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.7)'
          }}
        >
          $0 Electricity Bills <br />
          <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 400 }}>
            for the next 7 Years
          </span>
        </h1>

        {/* Subtitle from Reference Design */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: 'rgba(226, 232, 240, 0.85)',
            maxWidth: '680px',
            margin: '0 auto 24px',
            lineHeight: 1.6,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
          }}
        >
          Forget the energy market, weather volatility and peak grid charges; our 3D
          Smart Solar Controller calculates sub-degree roof angles to guarantee zero electricity bills.
        </p>
      </div>

      {/* Center Floating Time-of-Day Pill Switcher (Exact Match to Reference Image!) */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          margin: '24px 0 20px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <div
          className="glass-panel"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.15)',
            gap: '6px'
          }}
        >
          {/* Morning Button */}
          <button
            onClick={() => setTimeMode('morning')}
            style={getPillStyle(timeMode === 'morning')}
          >
            <Sunrise size={18} style={{ color: timeMode === 'morning' ? '#0f172a' : '#fbbf24' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Morning</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>$0 for Electricity</div>
            </div>
          </button>

          {/* Noon Button */}
          <button
            onClick={() => setTimeMode('noon')}
            style={getPillStyle(timeMode === 'noon')}
          >
            <Sun size={18} style={{ color: timeMode === 'noon' ? '#0f172a' : '#38bdf8' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Noon</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Peak 10.8 kW Yield</div>
            </div>
          </button>

          {/* Sunset Button */}
          <button
            onClick={() => setTimeMode('sunset')}
            style={getPillStyle(timeMode === 'sunset')}
          >
            <Sunset size={18} style={{ color: timeMode === 'sunset' ? '#0f172a' : '#f97316' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sunset</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Battery Storage</div>
            </div>
          </button>

          {/* Night Button */}
          <button
            onClick={() => setTimeMode('night')}
            style={getPillStyle(timeMode === 'night')}
          >
            <Moon size={18} style={{ color: timeMode === 'night' ? '#0f172a' : '#818cf8' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Night</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>$0 from Grid</div>
            </div>
          </button>
        </div>
      </div>

      {/* Floating Realtime Telemetry HUD Badges */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 15,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginTop: '10px'
        }}
      >
        {/* Card 1: Active PV Output */}
        <div className="glass-panel animate-float-1" style={{ padding: '16px 20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Active PV Output</span>
            <Zap size={18} style={{ color: '#fbbf24' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            {currentInfo.solarOutput}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
            ● Rooftop Generation Active
          </div>
        </div>

        {/* Card 2: Net Grid Cost */}
        <div className="glass-panel animate-float-2" style={{ padding: '16px 20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Net Grid Cost</span>
            <ShieldCheck size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>
            $0.00 <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#94a3b8' }}>/ month</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, marginTop: '2px' }}>
            7-Year Price Protection
          </div>
        </div>

        {/* Card 3: Home Battery Storage */}
        <div className="glass-panel animate-float-3" style={{ padding: '16px 20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Battery Storage</span>
            <BatteryCharging size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            {currentInfo.batteryStatus.split(' ')[0]}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, marginTop: '2px' }}>
            {currentInfo.batteryStatus}
          </div>
        </div>

        {/* Card 4: Action Quick Button */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            cursor: 'pointer'
          }}
          onClick={onScrollToCalculator}
        >
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Calculate Your Savings</span>
            <ArrowDown size={16} />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
            Enter your monthly bill to see 25-year ROI
          </div>
        </div>
      </div>
    </section>
  );
}

function getPillStyle(active) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    background: active
      ? 'linear-gradient(135deg, #fef08a 0%, #fde047 50%, #facc15 100%)'
      : 'transparent',
    color: active ? '#0f172a' : '#cbd5e1',
    boxShadow: active ? '0 4px 20px rgba(250, 204, 21, 0.4)' : 'none',
    transform: active ? 'scale(1.03)' : 'scale(1)'
  };
}
