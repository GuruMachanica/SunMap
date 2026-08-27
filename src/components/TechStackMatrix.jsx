import React from "react";

const TECH = [
  { name: "Three.js r153", role: "3D WebGL Ray-Tracing & Soft Shadow Engine", cat: "Graphics" },
  { name: "React 18 + Vite", role: "Ultra-Fast Component Lifecycle & Reactive State", cat: "Frontend" },
  { name: "PVLib Python", role: "Astronomical Solar Positioning & POA Irradiance", cat: "Physics" },
  { name: "CityGML XML", role: "3D Urban Surface Normal Extraction & TOF Mapping", cat: "GIS Data" },
  { name: "TailwindCSS", role: "Monochromatic High-Contrast CAD Design System", cat: "Styling" },
  { name: "PyTorch 2.2+", role: "Neural Yield Prediction & Anomaly Filtering", cat: "Machine Learning" }
];

const TechStackMatrix = () => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div>
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
          ENGINEERING ARCHITECTURE
        </span>
        <h3 className="text-2xl font-extrabold font-sans text-white">
          Enterprise Technology Stack
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono">
        {TECH.map((t, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-white">{t.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-amber-300 border border-white/10">
                {t.cat}
              </span>
            </div>
            <p className="text-[12px] text-zinc-400 font-sans">{t.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackMatrix;
