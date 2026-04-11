# Bolt's Journal

## 2024-05-24 - D3 Dashboard Resize Thrashing
**Learning:** The application renders complex D3 dashboards containing SVGs that recalculate entirely on resize events. This acts as a severe codebase-specific anti-pattern because the destruction and recreation of D3 SVG nodes on every resize tick blocks the main thread completely.
**Action:** When implementing new charts or dashboards using D3 in this codebase, ALWAYS debounce window resize listeners by at least 250ms to prevent SVG recreation thrashing.

## 2024-05-24 - D3 Force Simulation CPU Leak
**Learning:** D3 `forceSimulation` instances run an internal timer that continues executing even if their associated SVG DOM nodes are cleared or destroyed. In the `examples/dashboard/app.js` dashboard, re-rendering the network chart on window resize or data refresh caused multiple disconnected simulations to run simultaneously, compounding CPU usage and draining battery.
**Action:** Always store a reference to active `forceSimulation` instances (e.g., on their parent DOM node) and explicitly call `.stop()` on them before destroying or replacing the graph to prevent invisible CPU leaks.
