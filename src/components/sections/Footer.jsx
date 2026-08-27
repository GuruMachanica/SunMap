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
            <ShieldCheck size={18} /> Clean Energy Council Approved Architecture
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
            <Award size={18} /> CodeStorm’25 Winner Hardware Platform
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle size={18} /> 25-Year Manufacturer Warranty Simulation
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
                sunmap<span style={{ color: '#f59e0b' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Pioneering 7-year guaranteed $0 electricity bills through intelligent 3D solar modeling, smart battery arbitrage, and autonomous spatial energy optimization.
            </p>
            <div style={{ display: 'flex', gap: '12px', color: 'var(--color-text-muted)' }}>
              <a href="https://github.com/GuruMachanica/SunMap" target="_blank" rel="noreferrer" style={socialIconStyle}><Github size={18} /></a>
              <a href="https://github.com/GuruMachanica" target="_blank" rel="noreferrer" style={socialIconStyle}><Linkedin size={18} /></a>
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
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px' }}>Engineering Standards</h4>
            <ul style={listStyle}>
              <li><a href="#" style={linkStyle}>NREL PVLib Benchmarked</a></li>
              <li><a href="#" style={linkStyle}>25-Year Hardware Forecasting</a></li>
              <li><a href="#" style={linkStyle}>CityGML LOD2 Geometry Engine</a></li>
              <li><a href="#" style={linkStyle}>Three.js WebGL Acceleration</a></li>
              <li><a href="#" style={linkStyle}>Privacy &amp; Data Security</a></li>
            </ul>
          </div>

          {/* Col 4: Platform Engine & Status */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px' }}>System Status</h4>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem', marginBottom: '4px' }}>
                Autonomous 3D Spatial Engine
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Ray-Traced Shadow Occlusion Active<br />
                CodeStorm’25 Winner Project
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclaimer */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} SunMap • Mohammad Huzaifa &amp; Mohnish Gupta. All rights reserved. Proprietary - Strict Private Use &amp; Inspection License.
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem' }}>
            <a href="#" style={linkStyle}>Privacy Policy</a>
            <a href="#" style={linkStyle}>Terms &amp; Conditions</a>
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
