import React from "react";
import SolarCanvas3D from "../components/SolarCanvas3D";
import SolarControls from "../components/SolarControls";
import AnalyticsPanel from "../components/AnalyticsPanel";
import { FaArrowLeft } from "react-icons/fa";

const StudioPage = ({
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
  baseIrradiance,
  meshStats,
  setMeshStats,
  onBackToHome,
  isPlaying,
  setIsPlaying,
  panelTilt,
  setPanelTilt
}) => {
  return (
    <div className="relative w-full h-full pt-16 flex flex-col overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <div className="relative flex-1 w-full h-full">
        <SolarCanvas3D
          elevation={elevation}
          azimuth={azimuth}
          shadingMode={shadingMode}
          scenePreset={scenePreset}
          onMeshStatsUpdate={setMeshStats}
          panelTilt={panelTilt}
        />

        {/* Back to Overview Floating Button */}
        <button
          onClick={onBackToHome}
          className="absolute top-4 left-4 z-20 glass-panel px-3.5 py-2 rounded-2xl font-mono text-[12px] font-bold text-zinc-300 hover:text-white flex items-center gap-2 hover:border-amber-500/40 transition-colors shadow-lg">
          <FaArrowLeft className="w-3 h-3 text-amber-400" />
          <span>OVERVIEW</span>
        </button>

        {/* Floating Left Celestial Control Panel */}
        <div className="absolute top-16 left-4 z-20 w-80 sm:w-96 max-w-[calc(100vw-32px)] pointer-events-auto">
          <SolarControls
            timeOfDay={timeOfDay}
            setTimeOfDay={setTimeOfDay}
            season={season}
            setSeason={setSeason}
            scenePreset={scenePreset}
            setScenePreset={setScenePreset}
            shadingMode={shadingMode}
            setShadingMode={setShadingMode}
            elevation={elevation}
            azimuth={azimuth}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            panelTilt={panelTilt}
            setPanelTilt={setPanelTilt}
          />
        </div>

        {/* Floating Right Analytics Panel */}
        <div className="absolute top-16 right-4 z-20 w-80 sm:w-96 max-w-[calc(100vw-32px)] pointer-events-auto hidden md:block">
          <AnalyticsPanel
            irradiance={baseIrradiance}
            rooftopArea={meshStats.totalRooftopArea}
            panelsCount={meshStats.panelsCount}
            elevation={elevation}
          />
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
