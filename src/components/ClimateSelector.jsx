import React from "react";
import { FaSun } from "react-icons/fa";

const CITIES = [
  { id: "phoenix", name: "Phoenix, USA", lat: "33.4° N", ghi: 2240, peakHours: "6.1 hrs/day", tag: "High Solar" },
  { id: "delhi", name: "New Delhi, India", lat: "28.6° N", ghi: 1950, peakHours: "5.4 hrs/day", tag: "Sub-Tropical" },
  { id: "sydney", name: "Sydney, Australia", lat: "33.8° S", ghi: 1850, peakHours: "5.1 hrs/day", tag: "Temperate" },
  { id: "munich", name: "Munich, Germany", lat: "48.1° N", ghi: 1180, peakHours: "3.2 hrs/day", tag: "European Central" },
  { id: "london", name: "London, UK", lat: "51.5° N", ghi: 1050, peakHours: "2.9 hrs/day", tag: "Maritime Cloud" }
];

const ClimateSelector = ({ activeCity, setActiveCity }) => {
  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
          GLOBAL INSOLATION DATABASE
        </span>
        <h3 className="text-2xl font-extrabold font-sans text-white">
          Geographic Solar Climate Profiles
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
        {CITIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCity(c)}
            className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-3 ${
              activeCity?.id === c.id
                ? "bg-amber-500/20 text-white border-amber-500/50 shadow-lg"
                : "bg-white/[0.02] text-zinc-400 hover:text-white border-white/5 hover:border-white/20"
            }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-amber-300 border border-white/10">
                  {c.tag}
                </span>
                <FaSun className="w-3 h-3 text-amber-400" />
              </div>
              <h4 className="text-[14px] font-bold text-white mt-2">{c.name}</h4>
              <span className="text-[11px] text-zinc-500">{c.lat}</span>
            </div>

            <div className="pt-2 border-t border-white/5 text-[11px]">
              <span className="text-zinc-500 block">Annual GHI:</span>
              <span className="text-amber-400 font-bold text-[13px]">{c.ghi.toLocaleString()} kWh/m²</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClimateSelector;
