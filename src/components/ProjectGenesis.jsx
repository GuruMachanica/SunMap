import React from "react";
import { FaAward, FaGithub, FaUsers, FaHistory } from "react-icons/fa";

const ProjectGenesis = () => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6 relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FaAward className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
              CODESTORM’25 WINNER REPOSITORY
            </span>
          </div>
          <h3 className="text-2xl font-extrabold font-sans text-white">
            Project Genesis &amp; Engineering Team
          </h3>
        </div>

        <a
          href="https://github.com/mohnishgupta602-netizen/SunMap_Final/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-[11px] border border-white/10 transition-colors">
          <FaGithub className="w-3.5 h-3.5" />
          <span>VIEW DEPLOYMENT ORIGIN</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-[12px]">
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <FaUsers className="w-4 h-4 text-amber-400" />
            <span>Co-Founders &amp; Authors</span>
          </div>
          <ul className="space-y-2 text-zinc-300 font-sans">
            <li className="flex items-center justify-between">
              <span><strong>Mohammad Huzaifa</strong> (GuruMachanica)</span>
              <span className="font-mono text-[11px] text-amber-400">Lead Architecture</span>
            </li>
            <li className="flex items-center justify-between">
              <span><strong>Mohnish Gupta</strong> (mohnishgupta602)</span>
              <span className="font-mono text-[11px] text-amber-400">Co-Developer &amp; Research</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <FaHistory className="w-4 h-4 text-amber-400" />
            <span>Milestone Evolution</span>
          </div>
          <p className="text-zinc-400 font-sans leading-relaxed">
            Originally created at the CodeStorm’25 Hackathon (Shambhunath Group of Institutions) as a static CityGML shadow inspector, now upgraded to an enterprise 3D WebGL spatial solar potential &amp; bankable financial ROI platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectGenesis;
