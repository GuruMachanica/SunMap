import React, { useState } from "react";
import { FaDollarSign, FaChartLine, FaCheckCircle, FaPercent } from "react-icons/fa";

const EconomicsModeler = ({ baseAnnualKwh = 36224 }) => {
  const [tariffRate, setTariffRate] = useState(0.16); // $0.16 / kWh
  const [hasTaxCredit, setHasTaxCredit] = useState(true); // 30% Federal ITC
  const [costPerWatt, setCostPerWatt] = useState(2.80); // $2.80 / watt installed

  const systemSizeKw = Math.max(5, Math.round(baseAnnualKwh / 1100));
  const grossCapex = systemSizeKw * 1000 * costPerWatt;
  const netCapex = hasTaxCredit ? grossCapex * 0.70 : grossCapex;

  const year1Savings = baseAnnualKwh * tariffRate;
  const paybackYears = (netCapex / year1Savings).toFixed(1);

  let cumulativeSolarSavings = 0;
  for (let y = 1; y <= 25; y++) {
    const inflatedTariff = tariffRate * Math.pow(1.025, y - 1);
    const yearlySolarGen = baseAnnualKwh * Math.pow(0.995, y - 1);
    cumulativeSolarSavings += yearlySolarGen * inflatedTariff;
  }
  const netProfit25Year = Math.round(cumulativeSolarSavings - netCapex);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
            BANKABLE FINANCIAL SIMULATOR
          </span>
          <h3 className="text-2xl font-extrabold font-sans text-white">
            Photovoltaic Economics &amp; Tariff Modeler
          </h3>
        </div>
        <div className="font-mono text-right">
          <span className="text-zinc-500 text-[11px] block">ESTIMATED SYSTEM CAPEX</span>
          <span className="text-2xl font-extrabold text-white">${Math.round(netCapex).toLocaleString()}</span>
          {hasTaxCredit && <span className="text-[10px] text-emerald-400 block">Includes 30% ITC Rebate</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-zinc-400">UTILITY TARIFF RATE</span>
            <span className="text-amber-400 font-bold">${tariffRate.toFixed(2)}/kWh</span>
          </div>
          <input
            type="range"
            min="0.08"
            max="0.36"
            step="0.01"
            value={tariffRate}
            onChange={(e) => setTariffRate(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-zinc-400">INSTALLED COST PER WATT</span>
            <span className="text-white font-bold">${costPerWatt.toFixed(2)}/W</span>
          </div>
          <input
            type="range"
            min="1.80"
            max="4.20"
            step="0.10"
            value={costPerWatt}
            onChange={(e) => setCostPerWatt(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>

        <div 
          onClick={() => setHasTaxCredit(!hasTaxCredit)}
          className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer hover:border-amber-500/30 transition-all select-none">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono text-zinc-400 block">FEDERAL ITC 30% CREDIT</span>
            <span className="text-[12px] font-mono font-bold text-white">
              {hasTaxCredit ? "Applied (30% Discount)" : "Disabled (Gross Capex)"}
            </span>
          </div>
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
            hasTaxCredit ? "bg-amber-400 border-amber-400 text-black" : "border-white/20 bg-white/5"
          }`}>
            {hasTaxCredit && <FaCheckCircle className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20">
          <span className="text-[11px] text-amber-300 block mb-1">SIMPLE PAYBACK PERIOD</span>
          <span className="text-2xl font-extrabold text-white">{paybackYears} <span className="text-xs text-zinc-400">Years</span></span>
          <span className="text-[10px] text-zinc-500 block mt-1">Breakeven timeline</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20">
          <span className="text-[11px] text-emerald-300 block mb-1">YEAR 1 ENERGY REVENUE</span>
          <span className="text-2xl font-extrabold text-emerald-400">${Math.round(year1Savings).toLocaleString()}</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Offset utility bill</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-[11px] text-zinc-400 block mb-1">25-YEAR CUMULATIVE NET PROFIT</span>
          <span className="text-2xl font-extrabold text-amber-400">${netProfit25Year.toLocaleString()}</span>
          <span className="text-[10px] text-zinc-500 block mt-1">After total capex recovery</span>
        </div>
      </div>
    </div>
  );
};

export default EconomicsModeler;
