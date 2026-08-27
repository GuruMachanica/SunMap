import React from 'react';
import { ShieldCheck, Calendar, Sun, Cpu } from 'lucide-react';

export default function MetricsStrip() {
  const metrics = [
    {
      value: '$0 Guaranteed',
      label: 'Grid Electricity Bill',
      icon: <ShieldCheck size={20} style={{ color: '#10b981' }} />
    },
    {
      value: '7 Years',
      label: 'Fixed Performance Contract',
      icon: <Calendar size={20} style={{ color: '#f59e0b' }} />
    },
    {
      value: '100% Clean',
      label: 'Solar & Battery Backup Power',
      icon: <Sun size={20} style={{ color: '#38bdf8' }} />
    },
    {
      value: '24/7 AI',
      label: 'Smart Grid Monitoring',
      icon: <Cpu size={20} style={{ color: '#8b5cf6' }} />
    }
  ];

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 20,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '30px 0'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            alignItems: 'center'
          }}
        >
          {metrics.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '8px 12px'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {item.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1.2
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    fontWeight: 500,
                    marginTop: '2px'
                  }}
                >
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
