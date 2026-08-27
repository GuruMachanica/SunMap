import React from "react";
import { FaSun } from "react-icons/fa";

const Footer = ({ setActiveTab, onOpenReport }) => {
  return (
    <footer className="border-t border-white/10 bg-[#080808] text-white pt-12 pb-8 px-4 sm:px-8 font-mono text-[12px]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <FaSun className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-white font-bold text-[16px] font-sans">SunMap 3D</span>
          </div>
          <p className="text-zinc-500 max-w-sm font-sans">
            Enterprise spatial solar potential ray-tracing, CityGML building normal analysis, and bankable financial ROI simulation.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-zinc-400">
          <button onClick={() => setActiveTab("home")} className="hover:text-white transition-colors">OVERVIEW</button>
          <button onClick={() => setActiveTab("studio")} className="hover:text-amber-400 transition-colors">3D STUDIO</button>
          <button onClick={onOpenReport} className="hover:text-white transition-colors">AUDIT REPORT</button>
          <a href="https://github.com/GuruMachanica/SunMap" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GITHUB REPO</a>
          <a href="https://github.com/mohnishgupta602-netizen/SunMap_Final/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">DEPLOYMENT ORIGIN</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-[11px] gap-4">
        <span>© 2026 Mohammad Huzaifa &amp; Mohnish Gupta. CodeStorm’25 Winner.</span>
        <span>Proprietary - Strict Private Use &amp; Inspection License</span>
      </div>
    </footer>
  );
};

export default Footer;
