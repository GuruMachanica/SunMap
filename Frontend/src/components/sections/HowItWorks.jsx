import React from 'react';
import { Layers, Cpu, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: <Layers size={28} style={{ color: '#f59e0b' }} />,
      title: 'Smart Hardware Installation',
      description: 'High-efficiency solar array + Smart Controller battery storage setup installed seamlessly on your home with zero upfront disruption.'
    },
    {
      number: '02',
      icon: <Cpu size={28} style={{ color: '#38bdf8' }} />,
      title: 'AI Power Arbitrage',
      description: 'The system buys low, stores energy, powers your home, and trades excess power back to the grid automatically using real-time market data.'
    },
    {
      number: '03',
      icon: <ShieldCheck size={28} style={{ color: '#10b981' }} />,
      title: 'Fixed Zero-Bill Guarantee',
      description: 'Enjoy 7 years of guaranteed $0 electricity bills. Unexpected seasonal dips, winter clouds, or utility rate spikes are 100% covered.'
    }
  ];

  return (
    <section id="how-it-works" style={{ position: 'relative', padding: '110px 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 60px' }}>
          <div
            className="glass-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              marginBottom: '14px',
              color: '#f59e0b',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <Sparkles size={16} />
            <span>Seamless Process</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#fff', marginBottom: '16px' }}>
            How the 7-Year <span className="gradient-text-gold">Zero-Bill</span> Works
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
            We pair high-efficiency solar and storage hardware with an autonomous AI power trading platform.
          </p>
        </div>

        {/* 3-Step Flow Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px'
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '36px 30px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: 'rgba(255, 255, 255, 0.12)',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '14px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
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
