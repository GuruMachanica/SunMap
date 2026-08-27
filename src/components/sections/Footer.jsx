import React from 'react';
import { Sun, ShieldCheck, Github, Award, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '60px 0 30px', background: '#060911' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Accolades Strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            paddingBottom: '32px',
            marginBottom: '36px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
            <Award size={18} /> CodeStorm’25 Hackathon Winner Project
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
            <ShieldCheck size={18} /> CityGML LOD2 Geometry Extraction Engine
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle size={18} /> NREL PVLib Irradiance Physics Benchmarked
          </div>
        </div>

        {/* 4-Column Structured Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          {/* Col 1: Brand & Team Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
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
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '18px' }}>
              Intelligent 3D spatial solar irradiance modeling, LOD2 CityGML rooftop normal extraction, and ray-traced shadow occlusion engine developed for urban photovoltaic assessment.
            </p>
            <div style={{ display: 'flex', gap: '12px', color: 'var(--color-text-muted)' }}>
              <a href="https://github.com/GuruMachanica/SunMap" target="_blank" rel="noreferrer" style={socialIconStyle}><Github size={18} /></a>
            </div>
          </div>

          {/* Col 2: Engineering Team */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px' }}>Team Ironlogic</h4>
            <ul style={listStyle}>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Mohammad Huzaifa (Lead Architecture)</li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Mohnish Narayan Gupta</li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Isnia Izhar</li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Ashutosh Mishra</li>
            </ul>
          </div>

          {/* Col 3: Technical Specifications */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px' }}>Architecture</h4>
            <ul style={listStyle}>
              <li><a href="#how-it-works" style={linkStyle}>3D Facet Raycasting Pipeline</a></li>
              <li><a href="#tech" style={linkStyle}>Smart Controller Architecture</a></li>
              <li><a href="#calculator" style={linkStyle}>Diurnal Yield Modeling</a></li>
              <li><a href="#cases" style={linkStyle}>Validation Case Studies</a></li>
            </ul>
          </div>

          {/* Col 4: Platform Engine Status */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px' }}>Engine Status</h4>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.88rem', marginBottom: '4px' }}>
                WebGL 60 FPS Ray-Tracing Active
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                Developed for CodeStorm’25<br />
                Licensed to Team Ironlogic
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclaimer */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} SunMap • Team Ironlogic. All rights reserved. Proprietary - Strict Private Use &amp; Inspection License.
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Inquiries: ironlogic@zohomail.in
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
  gap: '8px'
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
