import React from 'react';
import { ShieldCheck, CloudSun, BarChart3, Wifi, Zap, Building2, BatteryMedium, Cpu } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Building2 size={24} style={{ color: '#f59e0b' }} />,
      title: 'CityGML & LOD2 3D Support',
      description: 'Ingest raw urban 3D CityGML models, decomposing semantic roof surfaces, walls, and terrain.'
    },
    {
      icon: <CloudSun size={24} style={{ color: '#38bdf8' }} />,
      title: 'Real-Time Sun Trajectory',
      description: 'Calculate instant solar azimuth and elevation with dynamic shadow frustum and illumination maps.'
    },
    {
      icon: <BatteryMedium size={24} style={{ color: '#10b981' }} />,
      title: 'Smart Powerwall Integration',
      description: 'Intelligent battery scheduling charges during peak morning sun and powers your home through night.'
    },
    {
      icon: <BarChart3 size={24} style={{ color: '#8b5cf6' }} />,
      title: 'Hourly & Annual Energy Yield',
      description: 'Get verified MWh/yr production forecasts backed by validated meteorological insolation models.'
    },
    {
      icon: <Wifi size={24} style={{ color: '#ec4899' }} />,
      title: 'Grid Independence & Protection',
      description: 'Insulate your home from soaring utility tariffs with a 7-year $0 bill performance guarantee.'
    },
    {
      icon: <ShieldCheck size={24} style={{ color: '#eab308' }} />,
      title: '25-Year Performance Warranty',
      description: 'Tier-1 monocrystalline panels rated for 25+ years of 90%+ generation with comprehensive coverage.'
    }
  ];

  return (
    <section id="technology" style={{ position: 'relative', padding: '100px 0', background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          <div className="glass-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', marginBottom: '14px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
            <Cpu size={16} />
            <span>Core Capabilities</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#fff', marginBottom: '16px' }}>
            Built for Extreme <span className="gradient-text-cyan">Solar Accuracy</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
            Enterprise-grade computational geometry meets clean energy financial optimization.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {features.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '28px',
                borderRadius: '20px',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
