import React from "react";
import { Zap, DollarSign, Leaf, ShieldAlert, Cpu } from "lucide-react";

const AnalyticsPanel = ({ irradiance = 850, rooftopArea = 210, panelsCount = 120, elevation = 45 }) => {
  const isNight = elevation <= 0;
  const currentIrradiance = isNight ? 0 : irradiance;
  const kwCapacity = (panelsCount * 0.4).toFixed(1);
  const annualKwh = Math.round(rooftopArea * 1850 * 0.20 * 0.82);
  const annualSavings = Math.round(annualKwh * 0.16);
  const co2Offset = ((annualKwh * 0.85) / 2204.62).toFixed(1);

  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.85)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      borderRadius: "24px",
      padding: "20px",
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
      fontFamily: "monospace"
    }}>
      <div>
        <span style={{ fontSize: "0.68rem", color: "#f59e0b", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", fontWeight: 700 }}>
          LIVE SPATIAL ANALYTICS
        </span>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, fontFamily: "sans-serif" }}>
          Predictive Solar Telemetry
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <span style={{ color: "#64748b", fontSize: "0.68rem", display: "block" }}>INSTANT FLUX</span>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f59e0b" }}>{currentIrradiance} <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>W/m²</span></span>
        </div>

        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <span style={{ color: "#64748b", fontSize: "0.68rem", display: "block" }}>SYSTEM SIZE</span>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff" }}>{kwCapacity} <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>kWp</span></span>
        </div>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "14px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem" }}><Zap size={14} color="#f59e0b" /> Annual Energy Yield</span>
          <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.9rem" }}>{annualKwh.toLocaleString()} kWh/yr</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem" }}><DollarSign size={14} color="#10b981" /> Utility Bill Offset</span>
          <span style={{ color: "#10b981", fontWeight: 800, fontSize: "0.9rem" }}>${annualSavings.toLocaleString()} /yr</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem" }}><Leaf size={14} color="#10b981" /> Carbon Abatement</span>
          <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.9rem" }}>{co2Offset} Tons CO₂/yr</span>
        </div>
      </div>

      <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)", padding: "10px", borderRadius: "12px", fontSize: "0.72rem", color: "#fbbf24" }}>
        Hardware ray-traced shadow occlusion active. 60 FPS WebGL pipeline.
      </div>
    </div>
  );
};

export default AnalyticsPanel;
