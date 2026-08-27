import React, { useState, useEffect } from 'react';
import { Sun, ArrowRight, Box, FileText } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenQuote, onOpenReport }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' SYNC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(9, 13, 22, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px'
        }}
      >
        <button
          onClick={() => setActiveTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.45rem',
            letterSpacing: '-0.03em',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
            }}
          >
            <Sun size={22} color="#ffffff" />
          </div>
          <span>sunmap<span style={{ color: '#f59e0b' }}>.</span></span>
        </button>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}
          className="desktop-nav"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              color: '#38bdf8'
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#00FFA3',
                boxShadow: '0 0 8px #00FFA3'
              }}
            />
            <span>{timeStr || 'LIVE SYNC'}</span>
          </div>

          <button
            onClick={() => setActiveTab('home')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'home' ? '#f59e0b' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'studio' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: activeTab === 'studio' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: activeTab === 'studio' ? '#fbbf24' : '#ffffff',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Box size={14} color="#f59e0b" />
            <span>3D Studio</span>
          </button>

          <button
            onClick={onOpenReport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
          >
            <FileText size={14} />
            <span>Audit Report</span>
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onOpenQuote}
            className="btn-glow-pulse"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              outline: 'none'
            }}
          >
            <span>Instant Quote</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
