import React, { useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import StudioPage from "./pages/StudioPage";
import ReportModal from "./components/ReportModal";

const App = () => {
  // Navigation: "home" | "studio"
  const [activeTab, setActiveTab] = useState("home");

  // Solar Trajectory State
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
    const maxElev = season === "summer" ? 72 : season === "equinox" ? 50 : 28;
    const hourDelta = timeOfDay - 12.0;
    const rawElev = Math.max(0, maxElev * Math.cos((hourDelta / 6.5) * (Math.PI / 2)));
    const rawAzim = 180 + (hourDelta / 6.5) * 85;
    const rad = (rawElev * Math.PI) / 180;
    const baseIrr = Math.round(1000 * Math.sin(rad));

    return {
      elevation: rawElev,
      azimuth: rawAzim,
      baseIrradiance: Math.max(0, baseIrr)
    };
  }, [timeOfDay, season]);

  const handleLaunchStudio = (preset = "commercial") => {
    setScenePreset(preset);
    setActiveTab("studio");
  };

  return (
    <div className="relative w-screen h-screen bg-[#080808] text-white overflow-hidden flex flex-col font-sans">
      {/* Top Universal Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setReportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {activeTab === "home" ? (
          <LandingPage
            onLaunchStudio={handleLaunchStudio}
            onOpenReport={() => setReportModalOpen(true)}
          />
        ) : (
          <StudioPage
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
            baseIrradiance={baseIrradiance}
            meshStats={meshStats}
            setMeshStats={setMeshStats}
            onBackToHome={() => setActiveTab("home")}
          />
        )}
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
