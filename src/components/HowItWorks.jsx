import React from "react";
import { FaLayerGroup, FaCompass, FaSun, FaBatteryFull } from "react-icons/fa";

const STEPS = [
  {
    number: "01",
    icon: FaLayerGroup,
    title: "3D Rooftop Facet Extraction",
    desc: "Our spatial engine parses Level-of-Detail 2 (LOD2) CityGML polygons, computing exact surface normal vectors, roof pitches, and unobstructed rooftop plane areas."
  },
  {
    number: "02",
    icon: FaCompass,
    title: "Ray-Traced Shadow Occlusion",
    desc: "Simulates 8,760 hourly celestial sun vectors across all seasons, projecting PCF soft shadow maps against neighboring skyscrapers, chimneys, and trees."
  },
  {
    number: "03",
    icon: FaSun,
    title: "POA Solar Irradiance Integration",
    desc: "Executes PVLib clear-sky and Perez transposition models to compute Plane of Array (POA) direct, diffuse, and ground-reflected radiation flux (kWh/m²)."
  },
  {
    number: "04",
    icon: FaBatteryFull,
    title: "Bankable ROI & Feasibility Blueprint",
    desc: "Synthesizes 25-year cash-flow forecasts, utility inflation rates, net metering revenue, and automated OSHA/Permitting engineering audit reports."
  }
];

const HowItWorks = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
          ENGINEERING METHODOLOGY
        </span>
        <h3 className="text-3xl font-extrabold font-sans text-white">
          How SunMap Works: The 4-Step Simulation Pipeline
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4 group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[18px] font-black text-amber-400 font-sans">{s.number}</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <h4 className="text-[15px] font-bold text-white group-hover:text-amber-300 transition-colors font-sans">
                  {s.title}
                </h4>
                <p className="text-[12px] text-zinc-400 mt-2 font-sans leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;
