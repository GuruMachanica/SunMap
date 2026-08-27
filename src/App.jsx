import React, { useState, useMemo } from "react";
import Header from "./components/Header";
import SolarCanvas3D from "./components/SolarCanvas3D";
import SolarControls from "./components/SolarControls";
import AnalyticsPanel from "./components/AnalyticsPanel";
import ReportModal from "./components/ReportModal";

const App = () => {
  // State for Solar Trajectory Engine
  const [timeOfDay, setTimeOfDay] = useState(12.0); // 12:00 PM
  const [season, setSeason] = useState("summer"); // "summer", "equinox", "winter"
  const [scenePreset, setScenePreset] = useState("commercial");
  const [shadingMode, setShadingMode] = useState("realistic");
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Mesh stats updated dynamically from 3D viewport
  const [meshStats, setMeshStats] = useState({
    totalRooftopArea: 142.5,
    panelsCount: 84
  });

  // Calculate Elevation & Azimuth from Time of Day and Season
  const { elevation, azimuth, baseIrradiance } = useMemo(() => {
    // Peak elevation based on season
    const maxElev = season === "summer" ? 72 : season === "equinox" ? 50 : 28;

    // Normalize time (6 AM = -6 hrs from solar noon, 12 PM = 0, 6 PM = +6)
    const hourDelta = timeOfDay - 12.0;

    // Solar Elevation: Sine curve peaking at solar noon
    const rawElev = Math.max(0, maxElev * Math.cos((hourDelta / 6.5) * (Math.PI / 2)));

    // Solar Azimuth: Sweeps from East (90 deg) at sunrise to South (180 deg) at noon to West (270 deg) at sunset
    const rawAzim = 180 + (hourDelta / 6.5) * 85;

    // Direct Normal Irradiance (Clear sky formula approx)
    const rad = (rawElev * Math.PI) / 180;
    const baseIrr = Math.round(1000 * Math.sin(rad));

    return {
      elevation: rawElev,
      azimuth: rawAzim,
      baseIrradiance: Math.max(0, baseIrr)
    };
  }, [timeOfDay, season]);

  return (
    <div className="relative w-screen h-screen bg-[#080808] text-white overflow-hidden flex flex-col font-sans select-none">
      {/* Top Header */}
      <Header onOpenReport={() => setReportModalOpen(true)} />

      {/* Main Interactive Studio Viewport */}
      <main className="relative flex-1 w-full h-full">
        {/* Fullscreen 3D WebGL Solar Simulation Canvas */}
        <SolarCanvas3D
          elevation={elevation}
          azimuth={azimuth}
          shadingMode={shadingMode}
          scenePreset={scenePreset}
          onMeshStatsUpdate={setMeshStats}
        />

        {/* Floating Left Control Panel */}
        <div className="absolute top-20 left-4 z-20 w-80 sm:w-96 max-w-[calc(100vw-32px)] pointer-events-auto">
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
          />
        </div>

        {/* Floating Right Analytics Panel */}
        <div className="absolute top-20 right-4 z-20 w-80 sm:w-96 max-w-[calc(100vw-32px)] pointer-events-auto hidden md:block">
          <AnalyticsPanel
            irradiance={baseIrradiance}
            rooftopArea={meshStats.totalRooftopArea}
            panelsCount={meshStats.panelsCount}
            elevation={elevation}
          />
        </div>
      </main>

      {/* Official Audit Summary Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        stats={meshStats}
        elevation={elevation}
        azimuth={azimuth}
        scenePreset={scenePreset}
      />
    </div>
  );
};

export default App;
