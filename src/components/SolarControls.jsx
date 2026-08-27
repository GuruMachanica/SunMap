import React, { useEffect } from "react";
import { FaSun, FaClock, FaCalendarAlt, FaLayerGroup, FaCube, FaBuilding, FaHome, FaTh, FaPlay, FaPause, FaSlidersH, FaFileCsv } from "react-icons/fa";

const SCENE_PRESETS = [
  { id: "commercial", label: "Commercial", icon: FaBuilding },
  { id: "highrise", label: "Urban High-Rise", icon: FaBuilding },
  { id: "residential", label: "Residential", icon: FaHome },
  { id: "farm", label: "Solar Matrix", icon: FaTh }
];

const SHADING_MODES = [
  { id: "realistic", label: "Realistic" },
  { id: "heatmap", label: "Solar Heatmap" },
  { id: "occlusion", label: "Shadow Occlusion" },
  { id: "wireframe", label: "CAD Wireframe" }
];

const SEASONS = [
  { id: "summer", label: "Summer Solstice (Jun 21)", maxElev: 72 },
  { id: "equinox", label: "Equinox (Mar/Sep)", maxElev: 50 },
  { id: "winter", label: "Winter Solstice (Dec 21)", maxElev: 28 }
];

const SolarControls = ({
  timeOfDay,
  setTimeOfDay,
  season,
  setSeason,
  scenePreset,
  setScenePreset,
  shadingMode,
  setShadingMode,
  elevation,
  azimuth,
  isPlaying,
  setIsPlaying,
  panelTilt,
  setPanelTilt
}) => {
  // Auto-play day cycle animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeOfDay((prev) => {
        const next = prev + 0.08;
        return next > 19.0 ? 6.0 : next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying, setTimeOfDay]);

  const formatTime = (h) => {
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const padMin = minutes < 10 ? "0" + minutes : minutes;
    return `${displayHours}:${padMin} ${period}`;
  };

  const handleExportCsv = () => {
    let csv = "Hour,Time,Solar_Elevation_Deg,Solar_Azimuth_Deg,ClearSky_GHI_W_m2\n";
    for (let h = 6.0; h <= 19.0; h += 0.5) {
      const hd = h - 12.0;
      const maxElev = season === "summer" ? 72 : season === "equinox" ? 50 : 28;
      const elev = Math.max(0, maxElev * Math.cos((hd / 6.5) * (Math.PI / 2)));
      const azim = 180 + (hd / 6.5) * 85;
      const irr = Math.round(1000 * Math.sin((elev * Math.PI) / 180));
      csv += `${h.toFixed(1)},${formatTime(h)},${elev.toFixed(1)},${azim.toFixed(1)},${irr}\n`;
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `SunMap_Hourly_Irradiance_${season}.csv`;
    link.click();
  };

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-3xl space-y-4 text-white max-h-[82vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1 font-bold">
            CELESTIAL &amp; ENVIRONMENT CONTROLS
          </span>
          <h2 className="text-[18px] font-extrabold font-sans text-white tracking-tight">
            Sun Trajectory Engine
          </h2>
        </div>

        {/* Auto-Play Cycle Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold border transition-all ${
            isPlaying
              ? "bg-amber-400 text-black border-amber-400 shadow-md"
              : "bg-white/5 text-zinc-300 hover:text-white border-white/10"
          }`}>
          {isPlaying ? <FaPause className="w-2.5 h-2.5" /> : <FaPlay className="w-2.5 h-2.5" />}
          <span>{isPlaying ? "PAUSE" : "PLAY CYCLE"}</span>
        </button>
      </div>

      {/* 1. Time of Day Slider */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-[12px] font-mono">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <FaClock className="w-3 h-3 text-amber-400" />
            TIME OF DAY
          </span>
          <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
            {formatTime(timeOfDay)}
          </span>
        </div>
        <input
          type="range"
          min="6.0"
          max="19.0"
          step="0.1"
          value={timeOfDay}
          onChange={(e) => {
            setIsPlaying(false);
            setTimeOfDay(parseFloat(e.target.value));
          }}
          className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>06:00 AM (Sunrise)</span>
          <span>12:00 PM (Solar Noon)</span>
          <span>07:00 PM (Sunset)</span>
        </div>
      </div>

      {/* 2. Celestial Coordinates Readout */}
      <div className="grid grid-cols-2 gap-2 text-center font-mono text-[11px]">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-zinc-500 block text-[10px] mb-0.5">ELEVATION ANGLE</span>
          <span className="text-white font-bold text-[14px]">{elevation.toFixed(1)}°</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-zinc-500 block text-[10px] mb-0.5">AZIMUTH (SOUTH=180°)</span>
          <span className="text-white font-bold text-[14px]">{azimuth.toFixed(1)}°</span>
        </div>
      </div>

      {/* 3. Panel Tilt Slider */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-[12px] font-mono">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <FaSlidersH className="w-3 h-3 text-amber-400" />
            PV PANEL TILT ANGLE
          </span>
          <span className="text-white font-bold">{panelTilt}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="45"
          step="1"
          value={panelTilt}
          onChange={(e) => setPanelTilt(parseInt(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>0° (Flat Roof)</span>
          <span>25° (Optimal Pitch)</span>
          <span>45° (Steep)</span>
        </div>
      </div>

      {/* 4. Season Preset Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <FaCalendarAlt className="w-3 h-3 text-amber-400" />
          SOLAR POSITION PRESET
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {SEASONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSeason(s.id)}
              className={`px-3 py-2 rounded-xl text-left font-mono text-[11.5px] transition-all flex items-center justify-between border ${
                season === s.id
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                  : "bg-white/[0.02] text-zinc-400 hover:text-white border-white/5 hover:border-white/20"
              }`}>
              <span>{s.label}</span>
              <span className="text-[10px] opacity-70">Peak: {s.maxElev}°</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. 3D Architectural Scene Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <FaCube className="w-3 h-3 text-amber-400" />
          3D ARCHITECTURAL TOPOLOGY
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {SCENE_PRESETS.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setScenePreset(p.id)}
                className={`p-2.5 rounded-xl font-mono text-[11px] font-bold transition-all flex flex-col items-center gap-1.5 border ${
                  scenePreset === p.id
                    ? "bg-white text-black border-white shadow-md"
                    : "bg-white/[0.02] text-zinc-400 hover:text-white border-white/5 hover:border-white/20"
                }`}>
                <Icon className="w-4 h-4" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Shading Mode Tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <FaLayerGroup className="w-3 h-3 text-amber-400" />
          SHADING &amp; RENDER MODE
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {SHADING_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setShadingMode(mode.id)}
              className={`px-2.5 py-2 rounded-xl font-mono text-[11px] font-bold transition-all border ${
                shadingMode === mode.id
                  ? "bg-amber-400 text-black border-amber-400 shadow-md"
                  : "bg-white/[0.02] text-zinc-400 hover:text-white border-white/5 hover:border-white/20"
              }`}>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Export CSV Dataset */}
      <button
        onClick={handleExportCsv}
        className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white font-mono text-[11px] font-bold flex items-center justify-center gap-2 border border-white/10 transition-colors">
        <FaFileCsv className="w-3.5 h-3.5 text-amber-400" />
        <span>EXPORT HOURLY IRRADIANCE (.CSV)</span>
      </button>
    </div>
  );
};

export default SolarControls;
