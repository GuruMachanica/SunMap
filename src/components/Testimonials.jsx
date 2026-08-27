import React from "react";
import { FaStar } from "react-icons/fa";

const TESTIMONIALS = [
  {
    name: "The Harris Family",
    location: "Sydney, Australia",
    system: "10.4 kW Solar + 13.5 kWh Smart Battery",
    savings: "$31,920 Saved Over 7 Yrs",
    quote: "We were skeptical about the 7-year zero bill guarantee until our first quarterly bill arrived: exactly $0.00. The 3D solar model predicted our output down to the kilowatt-hour.",
    installed: "Installed May 2024"
  },
  {
    name: "David & Claire Vance",
    location: "Melbourne, Australia",
    system: "8.8 kW Solar + Smart Controller",
    savings: "$2,850 / year",
    quote: "Our roof has odd shadows from two large gum trees. SunMap's ray-tracer accurately placed the panels only where full sunlight hits.",
    installed: "Installed August 2024"
  },
  {
    name: "Apex Solar Commercial",
    location: "Phoenix, USA",
    system: "120.0 kW Commercial Grid",
    savings: "$38,400 / year",
    quote: "Using SunMap before bidding allowed us to present institutional investors with bankable 25-year financial models backed by CityGML spatial ray-tracing.",
    installed: "Installed January 2025"
  }
];

const Testimonials = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
          CLIENT EXPERIENCES
        </span>
        <h3 className="text-3xl font-extrabold font-sans text-white">
          Trusted by Property Owners &amp; Enterprise Engineers
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-400 text-[11px] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500">{t.installed}</span>
              </div>

              <p className="text-[12.5px] text-zinc-300 font-sans leading-relaxed">
                "{t.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-white/5">
              <div className="text-[13px] font-bold text-white font-sans">{t.name}</div>
              <div className="text-[11px] text-amber-400 font-bold">{t.savings}</div>
              <div className="text-[10px] text-zinc-500">{t.system} • {t.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
