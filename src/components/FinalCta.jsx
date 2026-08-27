import React, { useState } from "react";
import { FaMapMarkerAlt, FaArrowRight, FaShieldAlt, FaSun } from "react-icons/fa";

const FinalCta = ({ onOpenQuote, onLaunchStudio }) => {
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address) return;
    if (onOpenQuote) onOpenQuote({ address });
  };

  return (
    <div className="glass-panel p-8 sm:p-14 rounded-3xl border border-amber-500/30 text-center relative overflow-hidden space-y-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-[11px] text-amber-300 font-bold">
          <FaSun className="w-3.5 h-3.5 text-amber-400" />
          <span>INSTANT 3D SOLAR POTENTIAL</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold font-sans text-white tracking-tight leading-tight">
          Ready to Calculate Your Rooftop Solar Potential?
        </h2>

        <p className="text-zinc-400 font-mono text-[13px] sm:text-[14px] leading-relaxed">
          Simulate building shadow occlusions, forecast 25-year cumulative cash flows, and generate bankable engineering feasibility audit reports in seconds.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto pt-2 font-mono text-[12px]">
          <div className="relative flex-1">
            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Enter property address or city..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.06] border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-bold tracking-wide transition-all shadow-lg hover:scale-105">
            <span>CHECK ELIGIBILITY</span>
            <FaArrowRight className="w-3 h-3" />
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-zinc-500 font-mono text-[11px] pt-2">
          <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Free • Level-of-Detail 2 (LOD2) CityGML Precision • No Obligation</span>
        </div>
      </div>
    </div>
  );
};

export default FinalCta;
