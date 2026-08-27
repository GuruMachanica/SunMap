import React, { useRef, useState } from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, FaVideo, FaCube, FaBolt } from "react-icons/fa";

const SimulationVideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
              HIGH-FIDELITY SIMULATION SHOWCASE
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-sans text-white">
            3D Celestial Diurnal Cycle &amp; Ray-Tracing Demo
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10">
            60 FPS WebGL Recording
          </span>
        </div>
      </div>

      {/* Video Container Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.8)] group bg-black">
        <video
          ref={videoRef}
          src="/animation.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto max-h-[540px] object-cover mx-auto cursor-pointer"
          onClick={togglePlay}
        />

        {/* Live Spatial Telemetry Overlay Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none font-mono text-[10px]">
          <div className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-lg">
            <FaBolt className="w-2.5 h-2.5" />
            <span>RAY-TRACED OCCLUSION ON</span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10 flex items-center gap-1.5 shadow-lg">
            <FaCube className="w-2.5 h-2.5" />
            <span>LOD2 CITYGML FACET EXTRACTION</span>
          </div>
        </div>

        {/* Video Control Bar Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2.5 font-mono text-[12px]">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black text-white transition-all backdrop-blur-sm border border-white/10">
              {isPlaying ? <FaPause className="w-3.5 h-3.5" /> : <FaPlay className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10">
              {isMuted ? <FaVolumeMute className="w-3.5 h-3.5" /> : <FaVolumeUp className="w-3.5 h-3.5" />}
            </button>

            <span className="text-zinc-400 text-[11px] hidden sm:inline">
              SunMap Spatial Engine 3D Capture
            </span>
          </div>

          <button
            onClick={handleFullscreen}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10 font-mono text-[11px] flex items-center gap-1.5">
            <FaExpand className="w-3 h-3" />
            <span className="hidden sm:inline">FULLSCREEN</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationVideoPlayer;
