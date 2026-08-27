import React from 'react';
import { Smartphone, CloudLightning, ShieldAlert, BatteryCharging, Cpu, Sparkles, Activity, Zap } from 'lucide-react';

export default function TechGrid() {
  return (
    <section id="tech-grid" style={{ position: 'relative', padding: '110px 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          <div
            className="glass-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              marginBottom: '14px',
              color: '#38bdf8',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <Cpu size={16} />
            <span>Smart Controller Architecture</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#fff', marginBottom: '16px' }}>
            Powered by Next-Gen <span className="gradient-text-cyan">Energy AI</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
            A four-pillar technology stack engineered for total grid independence, zero bills, and automatic power resilience.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px'
          }}
        >
          {/* Card 1: Real-time Mobile Energy App Preview (Span 7) */}
          <div
            className="glass-panel"
            style={{
              gridColumn: 'span 7',
              padding: '36px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Smartphone size={22} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live Telemetry App
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '12px' }}>
                Real-Time Mobile Energy Monitoring
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '480px' }}>
                Track every watt in real time. Inspect solar generation, battery reserve state, home consumption, and wholesale grid trading right from your phone.
              </p>
            </div>

            {/* Mock Mobile UI Card Preview */}
            <div
              style={{
                marginTop: '28px',
                background: 'rgba(9, 13, 22, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}
            >
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Solar Yield</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>8.4 kW</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Home Load</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>1.8 kW</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Grid Cost</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>$0.00</div>
              </div>
            </div>
          </div>

          {/* Card 2: Predictive AI Weather Forecasting (Span 5) */}
          <div
            className="glass-panel"
            style={{
              gridColumn: 'span 5',
              padding: '36px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CloudLightning size={22} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Weather AI
                </span>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px' }}>
                Predictive Weather Forecasting
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Machine learning models analyze 48-hour cloud vectors and temperature changes to pre-charge your battery ahead of storms.
              </p>
            </div>

            <div
              style={{
                marginTop: '24px',
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Activity size={20} style={{ color: '#fbbf24' }} />
              <div style={{ fontSize: '0.85rem', color: '#fef3c7', fontWeight: 600 }}>
                99.4% Solar Forecast Precision
              </div>
            </div>
          </div>

          {/* Card 3: Automatic Blackout Protection (Span 5) */}
          <div
            className="glass-panel"
            style={{
              gridColumn: 'span 5',
              padding: '36px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldAlert size={22} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Zero Downtime
                </span>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px' }}>
                Instant Blackout Protection
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Under 10-millisecond automatic grid islanding keeps your lights, Wi-Fi, refrigerators, and appliances powered seamlessly during blackout events.
              </p>
            </div>

            <div
              style={{
                marginTop: '24px',
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Zap size={20} style={{ color: '#10b981' }} />
              <div style={{ fontSize: '0.85rem', color: '#d1fae5', fontWeight: 600 }}>
                &lt; 10ms Seamless Islanding Cutover
              </div>
            </div>
          </div>

          {/* Card 4: Tier-1 Long-Life Lithium Battery Management (Span 7) */}
          <div
            className="glass-panel"
            style={{
              gridColumn: 'span 7',
              padding: '36px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BatteryCharging size={22} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Hardware Reliability
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '12px' }}>
                Tier-1 Long-Life Lithium Battery Management
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '520px' }}>
                Smart cell thermal balancing and adaptive depth-of-discharge management prolong battery life to 15+ years with 24/7 cloud health diagnostics.
              </p>
            </div>

            <div
              style={{
                marginTop: '28px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}
            >
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cycle Life</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>6,000+ Cycles</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Round-Trip Eff.</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>92.5%</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Warranty</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>10 Years</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #tech-grid .glass-panel {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}
