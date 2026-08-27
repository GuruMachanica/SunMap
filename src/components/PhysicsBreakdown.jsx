import React, { useState } from "react";

const TABS = [
  {
    id: "airmass",
    title: "1. Optical Airmass Attenuation",
    formula: "m(θ_z) = 1 / (cos(θ_z) + 0.50572 · (96.07995 - θ_z)^(-1.6364))",
    desc: "Calculates the atmospheric path length sunlight travels through Earth's atmosphere relative to the zenith path. As zenith angle approaches 90° (sunrise/sunset), airmass m increases exponentially, filtering out high-energy wavelengths."
  },
  {
    id: "dni",
    title: "2. Direct & Diffuse Separation",
    formula: "DNI = G_on · 0.7^(m^0.678)  |  GHI = DNI · cos(θ_z) + DHI",
    desc: "Splits extraterrestrial solar flux (Gon ≈ 1367 W/m²) into Direct Normal Irradiance (DNI) and Diffuse Horizontal Irradiance (DHI) caused by Rayleigh scattering and atmospheric aerosols."
  },
  {
    id: "poa",
    title: "3. Plane of Array (POA) Integration",
    formula: "I_poa = I_beam + I_diffuse + I_ground_reflected",
    desc: "Transforms horizontal solar vectors onto tilted roof planes using roof tilt angle (tr) and surface azimuth angle (az). Factors in Perez sky diffuse models and albedo ground reflections."
  },
  {
    id: "citygml",
    title: "4. CityGML 3D Normal Extraction",
    formula: "N = (V_2 - V_1) × (V_3 - V_1)  |  Tilt = arccos(N_z / |N|)",
    desc: "Parses Level-of-Detail 2 (LOD2) CityGML polygons, computing cross-product surface normals to accurately derive roof pitch, orientation, and obstruction shadows."
  }
];

const PhysicsBreakdown = () => {
  const [activeTab, setActiveTab] = useState("airmass");
  const active = TABS.find((t) => t.id === activeTab);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div>
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
          SOLAR PHYSICS &amp; GEOMETRIC METHODOLOGY
        </span>
        <h3 className="text-2xl font-extrabold font-sans text-white">
          Mathematical Formulations
        </h3>
      </div>

      <div className="flex flex-wrap gap-2 font-mono text-[12px]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl transition-all font-bold border ${
              activeTab === t.id
                ? "bg-amber-400 text-black border-amber-400 shadow-md"
                : "bg-white/[0.02] text-zinc-400 hover:text-white border-white/5 hover:border-white/20"
            }`}>
            {t.title}
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-4 font-mono">
        <div className="p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-center">
          <span className="text-[11px] text-zinc-500 block mb-1">EQUATION</span>
          <code className="text-amber-300 font-bold text-[14px] sm:text-[16px] tracking-wide">
            {active.formula}
          </code>
        </div>
        <p className="text-[13px] text-zinc-300 leading-relaxed font-sans">
          {active.desc}
        </p>
      </div>
    </div>
  );
};

export default PhysicsBreakdown;
