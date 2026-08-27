import React from "react";
import { FaBolt, FaDollarSign, FaLeaf, FaChartLine, FaRulerCombined } from "react-icons/fa";

const AnalyticsPanel = ({
  irradiance = 850,
  rooftopArea = 142.5,
  panelsCount = 84,
  elevation = 45
}) => {
  // Physical and economic calculations
  // System size in kWp (assume standard 400W panels)
  const systemSizeKw = (panelsCount * 0.4).toFixed(1);

  // Instantaneous Power Output (Watts / m^2)
  const instantPowerW = Math.max(0, Math.round(irradiance * Math.sin((elevation * Math.PI) / 180)));

  // Annual Generation (kWh / year)
  // Base formula: Area * Avg Annual Solar Insolation (1550 kWh/m2/yr) * PR factor (0.82)
  const annualEnergyKwh = Math.round(rooftopArea * 1550 * 0.20 * 0.82);

  // Monthly Savings (assuming $0.15 / kWh utility rate)
  const monthlySavings = Math.round((annualEnergyKwh * 0.15) / 12);
  const annualSavings = monthlySavings * 12;

  // 25-Year Net Present Value (NPV)
  const npv25Year = "$" + (annualSavings * 18.5).toLocaleString();

  // Carbon Offset (0.85 lbs CO2 / kWh -> Metric Tons CO2 / year)
  const co2Tons = ((annualEnergyKwh * 0.85) / 2204.62).toFixed(1);

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-3xl space-y-4 text-white">
      <div>
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1 font-bold">
          PREDICTIVE REVENUE &amp; ENERGY METRICS
        </span>
        <h3 className="text-[18px] font-extrabold font-sans text-white tracking-tight">
          Solar Potential Analytics
        </h3>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Instantaneous Irradiance */}
        <div className="p-3.5 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-300">
            <span>INSTANT IRRADIANCE</span>
            <FaBolt className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-[22px] sm:text-[26px] font-extrabold font-mono text-white">
              {instantPowerW}
            </span>
            <span className="text-[11px] font-mono text-zinc-400 ml-1">W/m²</span>
          </div>
        </div>

        {/* Estimated Monthly Savings */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>EST. MONTHLY VALUE</span>
            <FaDollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-[22px] sm:text-[26px] font-extrabold font-mono text-emerald-400">
              ${monthlySavings.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-zinc-400 ml-1">/mo</span>
          </div>
        </div>
      </div>

      {/* Detailed Technical Telemetry Grid */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 font-mono text-[12px] space-y-2.5">
        <div className="flex items-center justify-between text-zinc-300">
          <span className="text-zinc-500">Usable Rooftop Area:</span>
          <span className="text-white font-bold">{rooftopArea} m²</span>
        </div>

        <div className="flex items-center justify-between text-zinc-300">
          <span className="text-zinc-500">Solar Array Capacity:</span>
          <span className="text-white font-bold">{systemSizeKw} kWp ({panelsCount} Panels)</span>
        </div>

        <div className="flex items-center justify-between text-zinc-300">
          <span className="text-zinc-500">Annual Generation:</span>
          <span className="text-white font-bold">{annualEnergyKwh.toLocaleString()} kWh/yr</span>
        </div>

        <div className="flex items-center justify-between text-zinc-300 pt-2 border-t border-white/5">
          <span className="text-zinc-500">25-Yr Net Present Value:</span>
          <span className="text-amber-400 font-bold">{npv25Year}</span>
        </div>

        <div className="flex items-center justify-between text-zinc-300">
          <span className="text-zinc-500 flex items-center gap-1">
            <FaLeaf className="w-3 h-3 text-emerald-400" />
            Carbon Offset:
          </span>
          <span className="text-emerald-400 font-bold">{co2Tons} Tons CO₂/yr</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
