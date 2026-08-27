import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQS = [
  {
    q: "How does SunMap calculate ray-traced shadow occlusion?",
    a: "SunMap renders 3D building geometries inside a hardware-accelerated Three.js WebGL canvas. A directional sunlight source positioned by celestial equations projects PCF soft shadow maps (2048x2048). Surfaces obstructed by neighboring towers or parapets have their direct beam irradiance attenuated to diffuse levels."
  },
  {
    q: "What is the optimal rooftop solar panel tilt angle?",
    a: "Generally, the optimal fixed tilt angle equals the local geographic latitude (e.g., ~28° in New Delhi, ~33° in Phoenix). Sloping panels south maximizes annual kilowatt-hour output by aligning surface normals with solar noon rays."
  },
  {
    q: "How are annual energy yields (kWh/year) forecasted?",
    a: "We integrate hourly Plane of Array (POA) irradiance over 8,760 hours of the year using PVLib algorithms, factoring in temperature coefficients, inverter conversion efficiency (96%), and system performance ratio (PR ≈ 82.4%)."
  },
  {
    q: "Can SunMap ingest custom CityGML building files?",
    a: "Yes. SunMap includes backend Python parsers (SunMap.py, polygon3dmodule.py) capable of reading Level-of-Detail (LOD2) CityGML XML datasets and extracting roof normal polygons into web-ready JSON geometries."
  }
];

const FaqSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto my-12">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
          KNOWLEDGE HUB
        </span>
        <h3 className="text-3xl font-extrabold font-sans text-white">
          Frequently Asked Questions
        </h3>
      </div>

      <div className="space-y-3 font-mono">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all">
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-white text-[13px] sm:text-[14px]">
                <span>{faq.q}</span>
                <FaChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-[12px] sm:text-[13px] text-zinc-400 font-sans leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqSection;
