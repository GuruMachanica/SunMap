import React, { useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import StudioPage from "./pages/StudioPage";
import ReportModal from "./components/ReportModal";
import QuoteModal from "./components/QuoteModal";

const App = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [timeOfDay, setTimeOfDay] = useState(12.0);
  const [season, setSeason] = useState("summer");
  const [scenePreset, setScenePreset] = useState("commercial");
  const [shadingMode, setShadingMode] = useState("realistic");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [panelTilt, setPanelTilt] = useState(25);

  const [meshStats, setMeshStats] = useState({
    totalRooftopArea: 210.0,
    panelsCount: 120
  });

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
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setReportModalOpen(true)}
      />

      <main className="relative flex-1 w-full h-full overflow-hidden">
        {activeTab === "home" ? (
          <LandingPage
            onLaunchStudio={handleLaunchStudio}
            onOpenReport={() => setReportModalOpen(true)}
            onOpenQuote={() => setQuoteModalOpen(true)}
            setActiveTab={setActiveTab}
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
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            panelTilt={panelTilt}
            setPanelTilt={setPanelTilt}
          />
        )}
      </main>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        stats={meshStats}
        elevation={elevation}
        azimuth={azimuth}
        scenePreset={scenePreset}
      />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
};

export default App;
