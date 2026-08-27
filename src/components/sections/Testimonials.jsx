import React from 'react';
import { Star, CheckCircle, ShieldCheck, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function Testimonials() {
  const cases = [
    {
      name: 'The Harris Family',
      location: 'Sydney, NSW',
      system: '10.4 kW Solar + 13.5 kWh Smart Battery',
      beforeBill: '$380 / mo',
      afterBill: '$0 / mo',
      savings: '$31,920 Saved Over 7 Yrs',
      quote: 'We were skeptical about the 7-year zero bill guarantee until our first quarterly bill arrived: exactly $0.00. The smart controller does all the thinking.',
      rating: 5,
      installedDate: 'Installed May 2024'
    },
    {
      name: 'David & Claire Vance',
      location: 'Melbourne, VIC',
      system: '8.8 kW Solar + Smart Controller',
      beforeBill: '$310 / mo',
      afterBill: '$0 / mo',
      savings: '$26,040 Saved Over 7 Yrs',
      quote: 'The app shows real-time energy flow and when power prices spiked last winter, our battery covered everything. Best financial investment we made for our home.',
      rating: 5,
      installedDate: 'Installed August 2023'
    },
    {
      name: 'Marcus Sterling',
      location: 'Brisbane, QLD',
      system: '13.2 kW Solar + Dual Powerwall Storage',
      beforeBill: '$540 / mo',
      afterBill: '$0 / mo',
      savings: '$45,360 Saved Over 7 Yrs',
      quote: 'Large family with two EVs. We charge both cars at night completely powered by our daytime stored solar energy. Zero electricity expenses.',
      rating: 5,
      installedDate: 'Installed January 2024'
    }
  ];

  return (
    <section id="cases" style={{ position: 'relative', padding: '110px 0', background: 'rgba(15, 23, 42, 0.4)' }}>
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
              color: '#f59e0b',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <Star size={16} fill="#f59e0b" />
            <span>Verified Customer Case Studies</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#fff', marginBottom: '16px' }}>
            Real Homes Living With <span className="gradient-text-gold">$0 Power Bills</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
            See real residential before & after metrics with our 7-year zero electricity bill guarantee.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}
        >
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '36px 30px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Rating Stars & Trust Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <CheckCircle size={14} /> Verified Guarantee
                  </span>
                </div>

                <p style={{ fontSize: '0.98rem', color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.65, marginBottom: '24px' }}>
                  "{item.quote}"
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.location} · {item.installedDate}</div>
                </div>
              </div>

              {/* Before & After Visual Metric Card */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Previous Bill</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ef4444', textDecoration: 'line-through', marginTop: '2px' }}>
                    {item.beforeBill}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Guarantee Bill</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                    {item.afterBill}
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px', fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                  {item.savings}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
