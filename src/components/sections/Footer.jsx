import React from 'react';
import { Sun, ShieldCheck, Twitter, Github, Linkedin, Mail, Award, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '70px 0 35px', background: '#060911' }}>
      <div className="container">
        {/* Compliance Badges Strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            paddingBottom: '40px',
            marginBottom: '40px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
            <ShieldCheck size={18} /> Clean Energy Council Approved Retailer
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
            <Award size={18} /> ISO 9001 Quality Certified Hardware
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle size={18} /> 25-Year Manufacturer Warranty Protection
          </div>
        </div>

        {/* Footer 4-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '50px' }}>
          {/* Col 1: Brand & Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <Sun size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                reposit<span style={{ color: '#f59e0b' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Pioneering 7-year guaranteed $0 electricity bills through intelligent 3D solar modeling, smart battery arbitrage, and autonomous energy trading.
            </p>
            <div style={{ display: 'flex', gap: '12px', color: 'var(--color-text-muted)' }}>
              <a href="#" style={socialIconStyle}><Twitter size={18} /></a>
              <a href="#" style={socialIconStyle}><Github size={18} /></a>
              <a href="#" style={socialIconStyle}><Linkedin size={18} /></a>
              <a href="#" style={socialIconStyle}><Mail size={18} /></a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px' }}>Navigation</h4>
            <ul style={listStyle}>
              <li><a href="#how-it-works" style={linkStyle}>How It Works</a></li>
              <li><a href="#cases" style={linkStyle}>Our Case Studies</a></li>
              <li><a href="#tech-grid" style={linkStyle}>Smart Controller AI</a></li>
              <li><a href="#calculator" style={linkStyle}>Savings Calculator</a></li>
              <li><a href="#final-cta" style={linkStyle}>Check Roof Eligibility</a></li>
            </ul>
          </div>

          {/* Col 3: Legal & Policies */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px' }}>Legal & Policies</h4>
            <ul style={listStyle}>
              <li><a href="#" style={linkStyle}>7-Year No-Bill Guarantee Terms</a></li>
              <li><a href="#" style={linkStyle}>25-Year Hardware Warranty</a></li>
              <li><a href="#" style={linkStyle}>Grid Connection Compliance</a></li>
              <li><a href="#" style={linkStyle}>Privacy & Data Policy</a></li>
              <li><a href="#" style={linkStyle}>Terms of Service</a></li>
            </ul>
          </div>

          {/* Col 4: Customer Support & Hours */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px' }}>Customer Support</h4>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem', marginBottom: '4px' }}>
                24/7 Grid Support & Monitoring
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Toll Free: 1800 000 SOLAR<br />
                support@repositpower.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclaimer */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} Reposit Solar Technologies Inc. All rights reserved. Zero-bill guarantee subject to site eligibility assessment.
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem' }}>
            <a href="#" style={linkStyle}>Privacy Policy</a>
            <a href="#" style={linkStyle}>Terms & Conditions</a>
            <a href="#" style={linkStyle}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const linkStyle = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '0.85rem',
  transition: 'color 0.2s ease'
};

const socialIconStyle = {
  color: '#94a3b8',
  transition: 'color 0.2s ease'
};
