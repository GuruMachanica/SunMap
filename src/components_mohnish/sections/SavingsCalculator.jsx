import React, { useState } from 'react';
import { DollarSign, Zap, TreePine, Award, ArrowRight, ShieldCheck, Sparkles, MapPin, Home } from 'lucide-react';
import Button from '../ui/Button';
import confetti from 'canvas-confetti';

export default function SavingsCalculator({ onOpenQuote }) {
  const [monthlyBill, setMonthlyBill] = useState(280);
  const [postcode, setPostcode] = useState('2000');
  const [homeSize, setHomeSize] = useState('3-4 Bedrooms');

  // 7-Year Total Savings Calculation based on monthly power bill
  const sevenYearSavings = Math.round(monthlyBill * 12 * 7 * 0.95);
  const co2Tons = (monthlyBill * 0.024 * 7).toFixed(1);
  const treesPlanted = Math.round(co2Tons * 45);
  const batteryCapacity = monthlyBill > 400 ? '27.0 kWh (Dual Powerwall)' : '13.5 kWh Powerwall';

  const handleLockIn = () => {
    confetti({
      particleCount: 90,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#38bdf8', '#10b981', '#ffffff']
    });
    if (onOpenQuote) {
      onOpenQuote({
        monthlyBill,
        postcode,
        homeSize,
        sevenYearSavings,
        batteryCapacity
      });
    }
  };

  return (
    <section id="calculator" style={{ position: 'relative', padding: '110px 0', background: 'rgba(15, 23, 42, 0.6)' }}>
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
            <Sparkles size={16} />
            <span>Interactive Savings Calculator</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#fff', marginBottom: '16px' }}>
            Calculate Your 7-Year <span className="gradient-text-gold">$0 Bill Savings</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
            Move the slider to see how much you will save under our guaranteed 7-year zero electricity bill plan.
          </p>
        </div>

        {/* Calculator Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}
        >
          {/* Inputs Column */}
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={22} style={{ color: '#f59e0b' }} />
              <span>Your Home Profile</span>
            </h3>

            {/* Slider: Average Monthly Power Bill */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 600 }}>
                  Average Monthly Power Bill
                </label>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
                  ${monthlyBill} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>/ mo</span>
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="800"
                step="10"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                <span>$150 / mo</span>
                <span>$450 / mo</span>
                <span>$800 / mo</span>
              </div>
            </div>

            {/* Dual Inputs: Postcode & Home Size */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                  Postcode / City
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 32px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                  Home Size
                </label>
                <select
                  value={homeSize}
                  onChange={(e) => setHomeSize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="1-2 Bedrooms">1-2 Bedrooms</option>
                  <option value="3-4 Bedrooms">3-4 Bedrooms</option>
                  <option value="5+ Bedrooms">5+ Large Estate</option>
                </select>
              </div>
            </div>

            {/* Smart Hardware Summary */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.85rem',
                color: '#cbd5e1'
              }}
            >
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '2px' }}>Included Storage Setup</div>
              <div style={{ fontWeight: 700, color: '#38bdf8' }}>{batteryCapacity} + Smart Controller</div>
            </div>
          </div>

          {/* Results Output Column */}
          <div
            className="glass-panel"
            style={{
              padding: '38px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.85) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 35px rgba(245, 158, 11, 0.15)'
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Guaranteed 7-Year Total Savings
            </div>

            {/* Big 7-Year Savings Number */}
            <div style={{ fontSize: 'clamp(2.8rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#10b981', lineHeight: 1, marginBottom: '6px' }}>
              ${sevenYearSavings.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '28px' }}>
              Zero power bills, zero grid price rises, 100% price certainty.
            </div>

            {/* Environmental Metric Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px 18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                  <TreePine size={16} />
                  <span>Carbon Offset</span>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                  {co2Tons} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Tons CO₂</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px 18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                  <Award size={16} />
                  <span>Trees Equivalent</span>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                  {treesPlanted.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Trees</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              variant="glow"
              size="lg"
              fullWidth
              onClick={handleLockIn}
              icon={ArrowRight}
            >
              Lock in your $0 Guarantee
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', marginTop: '12px' }}>
              <ShieldCheck size={14} style={{ color: '#10b981' }} />
              <span>Includes 7-Year Fixed No-Bill Performance Contract</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
