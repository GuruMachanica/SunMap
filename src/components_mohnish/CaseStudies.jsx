import React from 'react';
import { Star, CheckCircle, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function CaseStudies({ onOpenQuote }) {
  const cases = [
    {
      title: 'Delft Residential Villa',
      location: 'South Holland, Netherlands',
      system: '9.6 kWp Solar + 13.5 kWh Storage',
      savings: '$3,180 / year',
      offset: '100% Net Zero',
      quote: 'SunMap simulated our gabled roof pitch perfectly. Our electricity bill literally dropped to zero from day one.',
      author: 'Mark van Dijk',
      rating: 5
    },
    {
      title: 'Modern Alpine Home',
      location: 'Munich, Germany',
      system: '12.4 kWp Solar Array',
      savings: '$4,250 / year',
      offset: '94% Grid Independent',
      quote: 'The 3D shadow occlusion analysis showed us exactly which side of our roof was optimal. Payback estimated in 4.8 years.',
      author: 'Elena Schmidt',
      rating: 5
    },
    {
      title: 'Coastal Residence',
      location: 'Sydney, Australia',
      system: '14.0 kWp All-Black Photovoltaic',
      savings: '$5,100 / year',
      offset: '100% Net Zero',
      quote: 'Switching between Morning, Noon and Night modes in the 3D model gave us complete confidence before installing.',
      author: 'David Chen',
      rating: 5
    }
  ];

  return (
    <section id="cases" style={{ position: 'relative', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          <div className="glass-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', marginBottom: '14px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
            <Star size={16} fill="#f59e0b" />
            <span>Proven Real-World Results</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#fff', marginBottom: '16px' }}>
            Homeowners Living with <span className="gradient-text-gold">$0 Power Bills</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
            See how precision 3D solar planning delivers guaranteed financial returns.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '32px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>

                <p style={{ fontSize: '1rem', color: '#e2e8f0', fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.6 }}>
                  "{item.quote}"
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{item.author}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.title} · {item.location}</div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Annual Savings</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>{item.savings}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Energy Offset</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>{item.offset}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          className="glass-panel"
          style={{
            marginTop: '60px',
            padding: '40px',
            borderRadius: '24px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}
        >
          <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '12px' }}>
            Ready to lock in $0 power bills for the next 7 years?
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 24px' }}>
            Get a tailored 3D rooftop solar simulation and guaranteed savings proposal in under 60 seconds.
          </p>
          <button
            onClick={onOpenQuote}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '14px 36px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
              transition: 'var(--transition-smooth)'
            }}
          >
            Get an Instant Quote
          </button>
        </div>
      </div>
    </section>
  );
}
