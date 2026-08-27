import React, { useState } from 'react';
import { DollarSign, Zap, TreePine, Award, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SolarCalculator({ onOpenQuote }) {
  const [monthlyBill, setMonthlyBill] = useState(240);
  const [roofArea, setRoofArea] = useState(90);

  // Financial and technical estimates
  const systemSizeKW = Math.min(Math.round((roofArea * 0.16) * 10) / 10, 18);
  const annualGenKWh = Math.round(systemSizeKW * 1380);
  const annualSavings = Math.round(monthlyBill * 12 * 0.92);
  const twentyFiveYearSavings = Math.round(annualSavings * 25 - (systemSizeKW * 1200));
  const paybackYears = (Math.max(4.2, Math.min(6.8, (systemSizeKW * 1300) / annualSavings))).toFixed(1);
  const co2Tons = (annualGenKWh * 0.00042).toFixed(1);
  const treesCount = Math.round(co2Tons * 48);

  const handleClaim = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#38bdf8', '#10b981', '#ffffff']
    });
    if (onOpenQuote) onOpenQuote({ monthlyBill, roofArea, twentyFiveYearSavings, systemSizeKW });
  };

  return (
    <section id="calculator" style={{ position: 'relative', padding: '100px 0', background: 'rgba(15, 23, 42, 0.6)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          <div className="glass-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', marginBottom: '14px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
            <Sparkles size={16} />
            <span>Interactive ROI Calculator</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#fff', marginBottom: '16px' }}>
            Calculate Your 25-Year <span className="gradient-text-gold">Solar Savings</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
            Adjust your current power bill and roof dimensions to simulate real-world photovoltaic production and payback.
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}
        >
          {/* Controls Card */}
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={22} style={{ color: '#f59e0b' }} />
              <span>Your Energy Profile</span>
            </h3>

            {/* Slider 1: Monthly Bill */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 600 }}>
                  Average Monthly Power Bill
                </label>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24' }}>
                  ${monthlyBill} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>/ mo</span>
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="10"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                <span>$50 / mo</span>
                <span>$400 / mo</span>
                <span>$800 / mo</span>
              </div>
            </div>

            {/* Slider 2: Usable Roof Area */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 600 }}>
                  Usable Roof Area (m²)
                </label>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
                  {roofArea} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>m²</span>
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="5"
                value={roofArea}
                onChange={(e) => setRoofArea(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                <span>20 m²</span>
                <span>150 m²</span>
                <span>300 m²</span>
              </div>
            </div>

            {/* Sub-Metric Bar */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recommended System</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{systemSizeKW} kWp Array</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Est. Annual Production</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{annualGenKWh.toLocaleString()} kWh/yr</div>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div
            className="glass-panel"
            style={{
              padding: '36px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 35px rgba(245, 158, 11, 0.15)'
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Guaranteed 25-Year Projection
            </div>
            
            {/* Big 25-Year Savings Number */}
            <div style={{ fontSize: 'clamp(2.8rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#10b981', lineHeight: 1, marginBottom: '6px' }}>
              ${twentyFiveYearSavings.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '28px' }}>
              Net cumulative savings after system investment & maintenance.
            </div>

            {/* Metrics Breakdown Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                  <Award size={16} />
                  <span>Payback Period</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  {paybackYears} <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>Years</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                  <TreePine size={16} />
                  <span>Carbon Offset</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  {co2Tons} <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>Tons/yr</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleClaim}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#fff',
                border: 'none',
                padding: '16px',
                borderRadius: '14px',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(245, 158, 11, 0.55)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
              }}
            >
              <span>Claim $0 Electricity Guarantee</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', marginTop: '12px' }}>
              <ShieldCheck size={14} style={{ color: '#10b981' }} />
              <span>Includes 25-Year Performance & Hardware Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
