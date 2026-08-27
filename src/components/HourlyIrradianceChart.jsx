import React, { useState } from "react";

const HourlyIrradianceChart = () => {
  const [selectedSeason, setSelectedSeason] = useState("summer");

  const maxElev = selectedSeason === "summer" ? 72 : selectedSeason === "equinox" ? 50 : 28;
  const hours = [];
  for (let h = 6; h <= 19; h += 0.5) {
    const hd = h - 12;
    const elev = Math.max(0, maxElev * Math.cos((hd / 6.5) * (Math.PI / 2)));
    const dni = Math.round(1000 * Math.sin((elev * Math.PI) / 180));
    const dhi = Math.round(dni * 0.18);
    hours.push({
      time: (h % 12 === 0 ? 12 : Math.floor(h % 12)) + (h % 1 === 0 ? ":00" : ":30") + (h >= 12 ? " PM" : " AM"),
      rawHour: h,
      elevation: elev.toFixed(1),
      dni,
      dhi,
      totalGhi: dni + dhi
    });
  }

  const maxVal = 1200;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
            DIURNAL SOLAR FLUX SIMULATION
          </span>
          <h3 className="text-2xl font-extrabold font-sans text-white">
            24-Hour Solar Irradiance Profile (POA vs. GHI)
          </h3>
        </div>

        <div className="flex gap-1.5 font-mono text-[11px] p-1 rounded-xl bg-white/[0.04] border border-white/10">
          {["summer", "equinox", "winter"].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`px-3 py-1 rounded-lg uppercase font-bold transition-all ${
                selectedSeason === s
                  ? "bg-amber-400 text-black shadow"
                  : "text-zinc-400 hover:text-white"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-64 w-full bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-end">
        <div className="absolute inset-x-4 top-4 border-b border-white/5 text-[10px] font-mono text-zinc-600">1000 W/m² (Peak Noon)</div>
        <div className="absolute inset-x-4 top-1/2 border-b border-white/5 text-[10px] font-mono text-zinc-600">500 W/m²</div>

        <div className="flex items-end justify-between gap-1 h-44 z-10">
          {hours.map((item, idx) => {
            const heightPct = Math.min(100, (item.totalGhi / maxVal) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                <div className="absolute -top-12 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 border border-amber-500/40 px-2 py-1 rounded-lg pointer-events-none font-mono text-[10px] whitespace-nowrap shadow-xl">
                  <strong className="text-amber-400">{item.time}</strong> • {item.totalGhi} W/m²
                </div>

                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200 rounded-t-sm group-hover:brightness-125 transition-all opacity-85"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between font-mono text-[10px] text-zinc-500 pt-3 border-t border-white/10 mt-2">
          <span>06:00 AM (Dawn)</span>
          <span>09:00 AM</span>
          <span className="text-amber-400 font-bold">12:00 PM (Solar Noon Peak)</span>
          <span>03:00 PM</span>
          <span>07:00 PM (Dusk)</span>
        </div>
      </div>
    </div>
  );
};

export default HourlyIrradianceChart;
