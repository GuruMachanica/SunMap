import React from 'react';
import { Sun, Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '60px 0 30px', background: '#070a12' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '50px' }}>
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <Sun size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Sun<span style={{ color: '#f59e0b' }}>Map</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Next-generation 3D solar insolation simulation, raycast shadow modeling, and zero-bill energy optimization.
            </p>
            <div style={{ display: 'flex', gap: '12px', color: 'var(--color-text-muted)' }}>
              <a href="#" style={socialIconStyle}><Twitter size={18} /></a>
              <a href="#" style={socialIconStyle}><Github size={18} /></a>
              <a href="#" style={socialIconStyle}><Linkedin size={18} /></a>
              <a href="#" style={socialIconStyle}><Mail size={18} /></a>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px' }}>Product & Tech</h4>
            <ul style={listStyle}>
              <li><a href="#how-it-works" style={linkStyle}>3D Rooftop Engine</a></li>
              <li><a href="#technology" style={linkStyle}>Raycast Shadow Occlusion</a></li>
              <li><a href="#calculator" style={linkStyle}>Solar ROI Calculator</a></li>
              <li><a href="#cases" style={linkStyle}>CityGML LOD2 Support</a></li>
              <li><a href="#technology" style={linkStyle}>Home Battery Storage</a></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px' }}>Resources</h4>
            <ul style={listStyle}>
              <li><a href="#" style={linkStyle}>Documentation</a></li>
              <li><a href="#" style={linkStyle}>TOF Factor Matrix</a></li>
              <li><a href="#" style={linkStyle}>Solar Radiation Models</a></li>
              <li><a href="#" style={linkStyle}>API & Geometries</a></li>
              <li><a href="#" style={linkStyle}>Open Datasets</a></li>
            </ul>
          </div>

          {/* Col 4: Guarantee */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px' }}>Our Guarantee</h4>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem', marginBottom: '4px' }}>
                7-Year $0 Bill Guarantee
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Protected against energy price increases with 25-year manufacturer warranties.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} SunMap Energy Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem' }}>
            <a href="#" style={linkStyle}>Privacy Policy</a>
            <a href="#" style={linkStyle}>Terms of Service</a>
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
