import React from "react";
import { FaSun, FaFileAlt, FaGithub, FaChartLine, FaLayerGroup } from "react-icons/fa";

const Header = ({ onOpenReport }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between pointer-events-none">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3 pointer-events-auto glass-panel px-4 py-2 rounded-2xl">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
          <FaSun className="w-4 h-4 text-amber-400 animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-white font-extrabold text-[15px] sm:text-[17px] tracking-tight font-sans">
              SunMap
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              3D SOLAR STUDIO
            </span>
          </div>
          <p className="text-[11px] font-mono text-zinc-400 hidden sm:block">
            Spatial Irradiance Ray-Tracing &amp; Revenue Simulation
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <button
          onClick={onOpenReport}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-black font-mono font-bold text-[12px] hover:bg-amber-400 transition-colors shadow-lg">
          <FaFileAlt className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AUDIT REPORT</span>
        </button>

        <a
          href="https://github.com/GuruMachanica/SunMap"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-white font-mono text-[12px] hover:border-white/40 transition-colors">
          <FaGithub className="w-4 h-4" />
          <span className="hidden sm:inline">GITHUB</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
