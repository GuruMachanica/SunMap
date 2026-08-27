import React, { useState } from "react";
import { FaTimes, FaCalculator, FaCheckCircle } from "react-icons/fa";

const QuoteModal = ({ isOpen, onClose }) => {
  const [monthlyBill, setMonthlyBill] = useState(250);
  const [includeBattery, setIncludeBattery] = useState(true);

  if (!isOpen) return null;

  const estKw = (monthlyBill / 28).toFixed(1);
  const panels = Math.round(estKw / 0.4);
  const grossCost = estKw * 2800 + (includeBattery ? 9500 : 0);
  const netCost = grossCost * 0.70;
  const annualSavings = monthlyBill * 12 * 0.95;
  const payback = (netCost / annualSavings).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#0e0e0e] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.95)] relative text-white max-h-[90vh] overflow-y-auto font-mono">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors border border-white/10">
          <FaTimes className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <FaCalculator className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 uppercase tracking-widest block font-bold">
              INSTANT ESTIMATE
            </span>
            <h2 className="text-[22px] font-extrabold font-sans text-white tracking-tight">
              Solar Feasibility &amp; Sizing Quote
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-[12px]">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-400">Current Monthly Electric Bill:</span>
              <span className="text-emerald-400 font-bold text-[14px]">${monthlyBill}/mo</span>
            </div>
            <input
              type="range"
              min="80"
              max="1200"
              step="10"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(parseInt(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>

          <div
            onClick={() => setIncludeBattery(!includeBattery)}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer hover:border-amber-500/30 transition-all select-none">
            <div>
              <span className="text-white font-bold block">Include 13.5 kWh Smart Battery Backup</span>
              <span className="text-[11px] text-zinc-500 font-sans">Enables 100% grid independence and blackout protection</span>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
              includeBattery ? "bg-amber-400 border-amber-400 text-black" : "border-white/20 bg-white/5"
            }`}>
              {includeBattery && <FaCheckCircle className="w-3.5 h-3.5" />}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-400">Recommended Array Sizing:</span>
              <span className="text-white font-bold">{estKw} kWp ({panels} Premium Panels)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Net Estimated Cost (After 30% Tax Credit):</span>
              <span className="text-amber-300 font-bold">${Math.round(netCost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Estimated Annual Bill Savings:</span>
              <span className="text-emerald-400 font-bold">${Math.round(annualSavings).toLocaleString()}/yr</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-amber-500/20">
              <span className="text-zinc-400">Estimated Simple Payback:</span>
              <span className="text-white font-bold">{payback} Years</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-[12px] transition-all">
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
