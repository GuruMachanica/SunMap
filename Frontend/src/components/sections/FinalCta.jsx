import React, { useState } from 'react';
import { MapPin, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import confetti from 'canvas-confetti';

export default function FinalCta({ onOpenQuote }) {
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address) return;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#38bdf8', '#10b981']
    });
    if (onOpenQuote) onOpenQuote({ address });
  };

  return (
    <section id="final-cta" style={{ position: 'relative', padding: '100px 0 80px' }}>
      <div className="container">
        <div
          className="glass-panel"
          style={{
            padding: ' clamp(40px, 6vw, 70px) clamp(24px, 5vw, 60px)',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(245, 158, 11, 0.18)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Radial Glow inside the card */}
          <div className="bg-glow-gold" style={{ top: '-30%', left: '50%', transform: 'translateX(-50%)', opacity: 0.6 }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
            <div
              className="glass-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                marginBottom: '16px',
                color: '#f59e0b',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <Sparkles size={16} />
              <span>Instant 3D Solar Eligibility</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '16px'
              }}
            >
              Ready to stop paying for electricity?
            </h2>

            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginBottom: '36px'
              }}
            >
              Enter your property address below to generate an instant 3D rooftop solar simulation and claim your 7-year $0 bill guarantee.
            </p>

            {/* Instant Address / Email Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'center',
                maxWidth: '560px',
                margin: '0 auto 20px'
              }}
            >
              <div
                style={{
                  flex: '1 1 300px',
                  position: 'relative'
                }}
              >
                <input
                  type="text"
                  required
                  placeholder="Enter your home address or postcode..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px 16px 44px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <MapPin size={18} style={{ position: 'absolute', left: '18px', top: '18px', color: '#fbbf24' }} />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={ArrowRight}
                style={{ flex: '0 0 auto', padding: '16px 28px' }}
              >
                Check My Roof Eligibility
              </Button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} style={{ color: '#10b981' }} />
              <span>100% Free · No obligation · Guaranteed 7-Year $0 Bill</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
