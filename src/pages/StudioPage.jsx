import React from "react";
import SolarCanvas3D from "../components/studio/SolarCanvas3D";
import SolarControls from "../components/studio/SolarControls";
import AnalyticsPanel from "../components/studio/AnalyticsPanel";
import { ArrowLeft } from "lucide-react";

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
    <div style={{ position: "relative", width: "100%", height: "100vh", paddingTop: "76px", overflow: "hidden", userSelect: "none" }}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <SolarCanvas3D
          elevation={elevation}
          azimuth={azimuth}
          shadingMode={shadingMode}
          scenePreset={scenePreset}
          onMeshStatsUpdate={setMeshStats}
          panelTilt={panelTilt}
        />

        <button
          onClick={onBackToHome}
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(9, 13, 22, 0.8)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            padding: "8px 16px",
            borderRadius: "14px",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: "0.8rem",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
          <ArrowLeft size={14} color="#f59e0b" />
          <span>BACK TO OVERVIEW</span>
        </button>

        <div style={{ position: "absolute", top: "70px", left: "16px", zIndex: 20, width: "380px", maxWidth: "calc(100vw - 32px)" }}>
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

        <div style={{ position: "absolute", top: "70px", right: "16px", zIndex: 20, width: "360px", maxWidth: "calc(100vw - 32px)" }}>
          <AnalyticsPanel
            irradiance={baseIrradiance}
            stats={meshStats}
            elevation={elevation}
          />
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
