import React from "react";
import { FaStar, FaArrowRight, FaBuilding, FaHome } from "react-icons/fa";

const CASES = [
  {
    title: "Delft Residential Villa",
    location: "South Holland, Netherlands",
    system: "9.6 kWp Solar + 13.5 kWh Storage",
    savings: "$3,180 / year",
    offset: "100% Net Zero",
    quote: "SunMap simulated our gabled roof pitch perfectly. Our electricity bill dropped to zero from day one.",
    author: "Mark van Dijk",
    icon: FaHome
  },
  {
    title: "Apex Logistics Tech Park",
    location: "Munich, Germany",
    system: "84.0 kWp Commercial Solar Canopy",
    savings: "$24,500 / year",
    offset: "92% Grid Offset",
    quote: "The 3D shadow occlusion analysis identified a 15% efficiency gain by rotating our carport array south.",
    author: "Dr. Klaus Werner",
    icon: FaBuilding
  },
  {
    title: "Summit Urban High-Rise",
    location: "Sydney, Australia",
    system: "36.0 kWp Rooftop & Facet Array",
    savings: "$12,400 / year",
    offset: "88% Daytime Peak Offset",
    quote: "SunMap proved building vertical shadow losses were negligible for our top-tier penthouse array.",
    author: "Sarah Jenkins",
    icon: FaBuilding
  }
];

const CaseStudies = ({ onOpenQuote }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
            PROVEN DEPLOYMENTS
          </span>
          <h3 className="text-3xl font-extrabold font-sans text-white">
            Real-World Case Studies
          </h3>
        </div>

        <button
          onClick={onOpenQuote}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-[12px] transition-all">
          <span>GET CUSTOM ESTIMATE</span>
          <FaArrowRight className="w-2.5 h-2.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {CASES.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10 font-bold">
                    {c.location}
                  </span>
                  <div className="flex text-amber-400 text-[11px] gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>

                <h4 className="text-[16px] font-bold text-white font-sans mt-2">{c.title}</h4>
                <span className="text-[11px] text-amber-400 block mt-0.5 font-bold">{c.system}</span>

                <p className="text-[12px] text-zinc-400 mt-3 font-sans italic leading-relaxed">
                  "{c.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Savings: <strong className="text-emerald-400">{c.savings}</strong></span>
                <span className="text-zinc-300 font-bold">— {c.author}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseStudies;
