# Bolt's Journal

## 2024-05-24 - D3 Dashboard Resize Thrashing
**Learning:** The application renders complex D3 dashboards containing SVGs that recalculate entirely on resize events. This acts as a severe codebase-specific anti-pattern because the destruction and recreation of D3 SVG nodes on every resize tick blocks the main thread completely.
**Action:** When implementing new charts or dashboards using D3 in this codebase, ALWAYS debounce window resize listeners by at least 250ms to prevent SVG recreation thrashing.
