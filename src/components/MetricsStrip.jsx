import React from "react";
import { FaDollarSign, FaSun, FaBuilding, FaLeaf } from "react-icons/fa";

const METRICS = [
  {
    icon: FaDollarSign,
    value: "$4.2M+",
    label: "Cumulative Energy Savings",
    sub: "Across 250+ audited client sites"
  },
  {
    icon: FaSun,
    value: "98.4%",
    label: "POA Irradiance Accuracy",
    sub: "Validated against NREL PVLib data"
  },
  {
    icon: FaBuilding,
    value: "14,500+",
    label: "3D CityGML Buildings",
    sub: "Indexed across urban CAD registries"
  },
  {
    icon: FaLeaf,
    value: "18,200",
    label: "Tons CO₂ Offset Annually",
    sub: "Clean renewable power generated"
  }
];

const MetricsStrip = () => {
  return (
    <div className="w-full py-8 border-y border-white/10 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-4 p-3 font-mono">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-sans leading-none">{item.value}</div>
                  <div className="text-[12px] font-bold text-zinc-300 mt-1">{item.label}</div>
                  <div className="text-[10px] text-zinc-500">{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MetricsStrip;
