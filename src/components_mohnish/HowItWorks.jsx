import React from 'react';
import { Layers, Compass, SunDim, Battery, ShieldAlert, Cpu } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: <Layers size={28} style={{ color: '#f59e0b' }} />,
      title: '3D Rooftop Facet Extraction',
      description: 'Our engine parses 3D building geometry, extracting exact tilt angles, compass azimuths, and unobstructed surface areas with sub-millimeter precision.'
    },
    {
      number: '02',
      icon: <Compass size={28} style={{ color: '#38bdf8' }} />,
      title: 'Raycast Shadow Occlusion',
      description: 'Simulates hourly sun vectors 365 days a year, tracing raycasts against nearby trees, adjacent structures, and rooftop obstacles to prevent loss.'
    },
    {
      number: '03',
      icon: <SunDim size={28} style={{ color: '#10b981' }} />,
      title: 'Annual Solar Insolation Matrix',
      description: 'Applies validated Tilt-Orientation Factors (TOF) to calculate total irradiance (kWh/m²/yr) and identify maximum-yield photovoltaic zones.'
    },
    {
      number: '04',
      icon: <Battery size={28} style={{ color: '#8b5cf6' }} />,
      title: 'Zero-Bill Storage Optimization',
      description: 'Pairs high-efficiency solar arrays with smart battery storage and predictive weather algorithms to eliminate 100% of peak grid charges.'
    }
  ];

  return (
    <section id="how-it-works" style={{ position: 'relative', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          <div className="glass-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', marginBottom: '14px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>
            <Cpu size={16} />
            <span>Precision Engineering</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#fff', marginBottom: '16px' }}>
            How SunMap Delivers <span className="gradient-text-gold">Zero-Bill Solar</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
            From 3D LiDAR modeling to smart battery arbitrage, here is how our solar intelligence engine operates.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '32px 26px',
                borderRadius: '20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {step.icon}
                  </div>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.15)', fontFamily: 'var(--font-heading)' }}>
                    {step.number}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '12px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
