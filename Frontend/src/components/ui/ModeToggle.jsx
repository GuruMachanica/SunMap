import React from 'react';

export default function ModeToggle({ mode, onToggle }) {
  const modes = [
    { id: 'morning', label: 'Morning', index: 0 },
    { id: 'afternoon', label: 'Afternoon', index: 1 },
    { id: 'evening', label: 'Evening', index: 2 },
    { id: 'night', label: 'Night', index: 3 }
  ];

  const activeIndex = Math.max(0, modes.findIndex((m) => m.id === mode));

  return (
    <div className="toggle-container">
      {/* Sliding white pill indicator */}
      <div
        className="toggle-slider"
        style={{
          transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 4}px))`
        }}
      />

      {/* 4 Mode Buttons */}
      {modes.map((item) => {
        const isActive = mode === item.id;

        return (
          <button
            key={item.id}
            className={`toggle-btn ${isActive ? 'active' : ''}`}
            data-mode={item.id}
            data-index={item.index}
            onClick={() => onToggle(item.id)}
          >
            <span className="btn-title">{item.label}</span>
            <span className="btn-sub">$0 for Electricity</span>
          </button>
        );
      })}
    </div>
  );
}
