import React from "react";
import { FaFileCode, FaArrowRight } from "react-icons/fa";

const DATASETS = [
  {
    name: "solar_data_real.json",
    type: "Level-of-Detail 2 (LOD2) CityGML",
    size: "48 KB",
    features: "Real-world urban building normal vectors, multi-tier roof facets, and azimuth orientation factors."
  },
  {
    name: "realistic_buildings.json",
    type: "Multi-Zone Building Matrix",
    size: "32 KB",
    features: "Commercial office towers with rooftop HVAC shadow obstacles and solar canopy coverage."
  },
  {
    name: "sample_building-solar.gml",
    type: "OpenGIS CityGML XML",
    size: "112 KB",
    features: "Enriched CityGML schema containing precomputed yearly irradiation and TOF values."
  }
];

const DataFileInspector = ({ onLaunchStudio }) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
            OPEN SPATIAL DATASETS
          </span>
          <h3 className="text-2xl font-extrabold font-sans text-white">
            Preloaded CityGML &amp; Solar JSON Schemas
          </h3>
        </div>
        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
          3 BUNDLED DATASETS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {DATASETS.map((d, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4 group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <FaFileCode className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] text-zinc-500">{d.size}</span>
              </div>
              <h4 className="text-[14px] font-bold text-white group-hover:text-amber-300 transition-colors">
                {d.name}
              </h4>
              <span className="text-[11px] text-zinc-400 block mt-0.5">{d.type}</span>
              <p className="text-[12px] text-zinc-500 mt-2.5 font-sans leading-relaxed">
                {d.features}
              </p>
            </div>

            <button
              onClick={() => onLaunchStudio("commercial")}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all">
              <span>LOAD IN 3D STUDIO</span>
              <FaArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataFileInspector;
