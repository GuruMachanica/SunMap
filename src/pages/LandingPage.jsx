import React, { useState } from "react";
import { FaSun, FaCube, FaBolt, FaDollarSign, FaLeaf, FaArrowRight, FaAward } from "react-icons/fa";
import BackgroundParticles from "../components/BackgroundParticles";
import MetricsStrip from "../components/MetricsStrip";
import EconomicsModeler from "../components/EconomicsModeler";
import ClimateSelector from "../components/ClimateSelector";
import PhysicsBreakdown from "../components/PhysicsBreakdown";
import HourlyIrradianceChart from "../components/HourlyIrradianceChart";
import DataFileInspector from "../components/DataFileInspector";
import TechStackMatrix from "../components/TechStackMatrix";
import HowItWorks from "../components/HowItWorks";
import CaseStudies from "../components/CaseStudies";
import Testimonials from "../components/Testimonials";
import SimulationVideoPlayer from "../components/SimulationVideoPlayer";
import ProjectGenesis from "../components/ProjectGenesis";
import FaqSection from "../components/FaqSection";
import FinalCta from "../components/FinalCta";
import Footer from "../components/Footer";

const TOPOLOGIES = [
  {
    id: "commercial",
    title: "Commercial Campus",
    desc: "Multi-wing commercial office layout with flat rooftops, HVAC obstructions, and high-density solar canopies.",
    area: "210.0 m²",
    capacity: "49.6 kWp",
    yield: "53,420 kWh/yr"
  },
  {
    id: "highrise",
    title: "Urban High-Rise",
    desc: "Dense metropolitan tower core featuring perimeter railings and vertical building shadow occlusion modeling.",
    area: "145.0 m²",
    capacity: "36.0 kWp",
    yield: "36,890 kWh/yr"
  },
  {
    id: "residential",
    title: "Residential Sloped Array",
    desc: "Dual-pitch residential roof analyzing south-facing solar tilt optimization and seasonal shading angles.",
    area: "128.0 m²",
    capacity: "28.8 kWp",
    yield: "31,240 kWh/yr"
  },
  {
    id: "farm",
    title: "Utility Solar Matrix",
    desc: "Ground-mounted photovoltaic tracker grid with 20° south orientation for utility-scale energy forecasting.",
    area: "320.0 m²",
    capacity: "80.0 kWp",
    yield: "81,600 kWh/yr"
  }
];

const LandingPage = ({ onLaunchStudio, onOpenReport, onOpenQuote, setActiveTab }) => {
  const [quickArea, setQuickArea] = useState(140);
  const [activeCity, setActiveCity] = useState({
    id: "phoenix",
    name: "Phoenix, USA",
    lat: "33.4° N",
    ghi: 2240,
    peakHours: "6.1 hrs/day",
    tag: "High Solar"
  });

  const estYield = Math.round(quickArea * activeCity.ghi * 0.20 * 0.82);
  const estSavings = Math.round(estYield * 0.16);
  const estCo2 = ((estYield * 0.85) / 2204.62).toFixed(1);

  return (
    <div className="relative min-h-screen bg-[#080808] text-white pt-24 overflow-y-auto">
      <BackgroundParticles />

      {/* Hero Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 1. Hero Section */}
      <section className="max-w-5xl mx-auto text-center space-y-6 pt-8 pb-12 px-4 sm:px-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[11.5px] text-zinc-300">
          <FaAward className="w-4 h-4 text-amber-400" />
          <span>CodeStorm’25 Winner • 3D Spatial Solar Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-sans tracking-tight leading-[1.08] text-white">
          3D Spatial Solar Potential <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
            &amp; Revenue Ray-Tracing
          </span>
        </h1>

        <p className="text-zinc-400 max-w-2xl mx-auto font-mono text-[13px] sm:text-[15px] leading-relaxed">
          Simulate building solar irradiance in hardware-accelerated 3D WebGL. Calculate hourly sun trajectories, ray-traced shadow occlusion, and 25-year financial ROI models.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => onLaunchStudio("commercial")}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-extrabold text-[13px] tracking-wide transition-all shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:scale-105">
            <FaCube className="w-4 h-4" /> LAUNCH 3D STUDIO
            <FaArrowRight className="w-3 h-3 ml-1" />
          </button>

          <button
            onClick={onOpenQuote}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black font-mono font-bold text-[13px] hover:bg-zinc-200 transition-all shadow-lg">
            INSTANT QUOTE ESTIMATOR
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass-panel text-white font-mono font-bold text-[13px] hover:bg-white/10 transition-all border border-white/15">
            VIEW FEASIBILITY REPORT
          </button>
        </div>
      </section>

      {/* 2. Metrics Strip */}
      <section className="relative z-10 my-4">
        <MetricsStrip />
      </section>

      {/* 3. Simulation Video Showcase */}
      <section className="max-w-5xl mx-auto my-12 px-4 sm:px-8 relative z-10">
        <SimulationVideoPlayer />
      </section>

      {/* 4. Global Climate Profiles */}
      <section className="max-w-5xl mx-auto my-12 px-4 sm:px-8 relative z-10">
        <ClimateSelector activeCity={activeCity} setActiveCity={setActiveCity} />
      </section>

      {/* 5. 24-Hour Solar Flux Diurnal Curve */}
      <section className="max-w-5xl mx-auto my-12 px-4 sm:px-8 relative z-10">
        <HourlyIrradianceChart />
      </section>

      {/* 6. Instant Solar ROI Calculator Widget */}
      <section className="max-w-5xl mx-auto my-12 px-4 sm:px-8 relative z-10">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                ESTIMATE YOUR BUILDING POTENTIAL ({activeCity.name.toUpperCase()})
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-white">
                Instant Solar ROI Calculator
              </h2>
            </div>

            <div className="font-mono text-right">
              <span className="text-zinc-500 text-[11px] block">SELECTED ROOF SURFACE</span>
              <span className="text-2xl font-extrabold text-amber-400">{quickArea} m²</span>
            </div>
          </div>

          <div className="py-6 space-y-3">
            <label className="text-[12px] font-mono text-zinc-400 flex justify-between">
              <span>Rooftop Surface Area Slider</span>
              <span className="text-white font-bold">{quickArea} m² (approx {Math.round(quickArea * 10.76)} sq ft)</span>
            </label>
            <input
              type="range"
              min="30"
              max="600"
              step="10"
              value={quickArea}
              onChange={(e) => setQuickArea(parseInt(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-1">
                <FaBolt className="w-3 h-3 text-amber-400" />
                <span>ANNUAL YIELD</span>
              </div>
              <div className="text-xl font-extrabold text-white">{estYield.toLocaleString()} <span className="text-xs font-normal text-zinc-500">kWh/yr</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-1">
                <FaDollarSign className="w-3 h-3 text-emerald-400" />
                <span>ANNUAL SAVINGS</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-400">${estSavings.toLocaleString()} <span className="text-xs font-normal text-zinc-500">/year</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-1">
                <FaLeaf className="w-3 h-3 text-emerald-400" />
                <span>CARBON OFFSET</span>
              </div>
              <div className="text-xl font-extrabold text-white">{estCo2} <span className="text-xs font-normal text-zinc-500">Tons CO₂/yr</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How It Works Pipeline */}
      <section className="max-w-5xl mx-auto my-16 px-4 sm:px-8 relative z-10">
        <HowItWorks />
      </section>

      {/* 8. Bankable Economics & Tariff Modeler */}
      <section className="max-w-5xl mx-auto my-12 px-4 sm:px-8 relative z-10">
        <EconomicsModeler baseAnnualKwh={estYield} />
      </section>

      {/* 9. Preloaded CityGML Data Schemas */}
      <section className="max-w-5xl mx-auto my-12 px-4 sm:px-8 relative z-10">
        <DataFileInspector onLaunchStudio={onLaunchStudio} />
      </section>

      {/* 10. Architectural Topologies */}
      <section className="max-w-5xl mx-auto my-16 px-4 sm:px-8 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
            PRE-CONFIGURED CAD SCENES
          </span>
          <h2 className="text-3xl font-extrabold font-sans text-white">
            Explore 3D Architectural Environments
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOPOLOGIES.map((top) => (
            <div
              key={top.id}
              className="glass-panel p-6 rounded-3xl hover:border-amber-500/40 transition-all flex flex-col justify-between group space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[18px] font-bold text-white group-hover:text-amber-400 transition-colors">
                    {top.title}
                  </h3>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10 font-bold">
                    {top.capacity}
                  </span>
                </div>
                <p className="text-[12px] font-mono text-zinc-400 leading-relaxed">
                  {top.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 font-mono text-[11px]">
                <span className="text-zinc-500">Roof Area: <strong className="text-white">{top.area}</strong></span>
                <button
                  onClick={() => onLaunchStudio(top.id)}
                  className="flex items-center gap-1.5 text-amber-400 font-bold hover:underline">
                  SIMULATE IN 3D <FaArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Case Studies */}
      <section className="max-w-5xl mx-auto my-16 px-4 sm:px-8 relative z-10">
        <CaseStudies onOpenQuote={onOpenQuote} />
      </section>

      {/* 12. Client Testimonials */}
      <section className="max-w-5xl mx-auto my-16 px-4 sm:px-8 relative z-10">
        <Testimonials />
      </section>

      {/* 13. Physics Formulations Breakdown */}
      <section className="max-w-5xl mx-auto my-12 px-4 sm:px-8 relative z-10">
        <PhysicsBreakdown />
      </section>

      {/* 14. Technology Stack Matrix */}
      <section className="max-w-5xl mx-auto my-12 px-4 sm:px-8 relative z-10">
        <TechStackMatrix />
      </section>

      {/* 15. Project Genesis & Authors */}
      <section className="max-w-5xl mx-auto my-12 px-4 sm:px-8 relative z-10">
        <ProjectGenesis />
      </section>

      {/* 16. FAQ Knowledge Hub */}
      <section className="max-w-5xl mx-auto my-12 px-4 sm:px-8 relative z-10">
        <FaqSection />
      </section>

      {/* 17. Final Call to Action */}
      <section className="max-w-5xl mx-auto my-16 px-4 sm:px-8 relative z-10">
        <FinalCta onOpenQuote={onOpenQuote} onLaunchStudio={onLaunchStudio} />
      </section>

      {/* 18. Universal Footer */}
      <Footer setActiveTab={setActiveTab} onOpenReport={onOpenReport} />
    </div>
  );
};

export default LandingPage;
