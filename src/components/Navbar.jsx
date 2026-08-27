import React from "react";
import { FaSun, FaCube, FaHome, FaFileAlt, FaGithub, FaChartPie } from "react-icons/fa";

const Navbar = ({ activeTab, setActiveTab, onOpenReport }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-none">
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab("home")}
        className="flex items-center gap-3 pointer-events-auto glass-panel px-4 py-2 rounded-2xl cursor-pointer hover:border-amber-500/40 transition-colors">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
          <FaSun className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-white font-extrabold text-[16px] tracking-tight font-sans">
              SunMap
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              3D PLATFORM
            </span>
          </div>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="pointer-events-auto hidden md:flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono text-[12px] font-bold transition-all ${
            activeTab === "home"
              ? "bg-white text-black shadow-md"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}>
          <FaHome className="w-3.5 h-3.5" /> OVERVIEW
        </button>

        <button
          onClick={() => setActiveTab("studio")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono text-[12px] font-bold transition-all ${
            activeTab === "studio"
              ? "bg-amber-400 text-black shadow-md"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}>
          <FaCube className="w-3.5 h-3.5" /> 3D SOLAR STUDIO
        </button>
      </nav>

      {/* Right Action Buttons */}
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

export default Navbar;
