SunMap - 3D Solar Analysis Visualization
======================================

A small static web application that visualizes solar irradiation on simple 3D building models using Three.js. It includes interactive controls for sun elevation/azimuth, occlusion sampling (shadow-based occlusion), and a small info panel with per-building metrics.

Quick features
- 3D visualization using Three.js (local copy: `js/three.min.js`).
- Load building/solar data from JSON files (`solar_data.json` included) or use generated sample data.
- Interactive controls: sun elevation/azimuth, play/pause sun animation, occlusion toggle, occlusion sampling count, daylight hours, zoom in/out, reset view.
- Info panel for individual buildings with average irradiation, area, instantaneous/hourly/daily estimates.
- Dynamic directional light shadow frustum: the sun's shadow camera is sized to cover the loaded buildings so shadows don't clip to a small rectangle.
- Runtime error overlay (bottom-right) to show console.error and unhandled exceptions (helps debugging when running locally).

Requirements
- Modern browser (Chrome/Edge/Firefox). The app must be served over HTTP (some features may not work via `file://`).
- Python (optional) if you want a quick static server (`python -m http.server 8000`).

How to run locally
1. Start a local static file server in the project root (where `index.html` lives). Example using Python 3 (PowerShell):

```powershell
# From project root
python -m http.server 8000
```

2. Open your browser and navigate to:

http://localhost:8000

3. Use the left UI panel to change sun elevation/azimuth, toggle occlusion (shadow checks), or load your own `*.json`/`*.gml` data files.

Important files
- `index.html` — main UI and page layout.
- `app.js` — main visualization logic (Three.js scene, controls, building creation, sun/irradiation logic).
- `js/three.min.js` — local Three.js library (bundled).
- `solar_data.json` / `solar_data_real.json` — sample data used by the app.

Tuning shadows
- The directional light shadow camera is configured in `app.js` and the frustum is sized dynamically when buildings are loaded.
- If shadows still appear clipped or you want to change quality/performance, edit these values in `setupLighting()` in `app.js`:
  - `this.sunLight.shadow.mapSize.width/height` (higher = sharper shadows, more GPU cost)
  - `shadow camera extents` (the code computes these automatically; you can tweak margin or defaults in `updateSunShadowFrustum()`)

Troubleshooting
- "Three.js failed to load": ensure `js/three.min.js` exists and is accessible. The page will show a message if Three.js is missing.
- Runtime errors: an error overlay appears in the bottom-right on runtime exceptions or console.error calls. Click "Clear" or "Close" to dismiss.
- If the app shows an alert like "Error initializing 3D visualizer", open DevTools (F12) and check the Console. The overlay will also capture messages.

Notes and next steps
- Unit conversions (kW vs kWh): the app currently treats `surface.currentIrradiation` as an hourly kWh/m² approximation for display. If you have annual kWh/m² input, I can add conversion utilities to calculate instantaneous kW (W/m²) using a chosen time base (e.g., effective daylight hours).
- Performance: the app uses a high shadow map size (4096) by default — reduce to 2048 or 1024 on lower-end GPUs.
- I can add a small UI control to adjust the shadow extent or shadow map size live for experimentation.

If you'd like me to add any of the follow-ups (shadow tuning UI, auto-frustum on camera move, or accurate unit conversions), tell me which one and I'll implement it next.