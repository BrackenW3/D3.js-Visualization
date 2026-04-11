## 2025-05-20 - Build Failure with Modern Dependencies
**Vulnerability:** Ancient build tools (`rollup-plugin-ascii` v0.0.3) rely on `acorn` 3.x, which fails to parse modern JavaScript syntax used in updated `d3-*` dependencies.
**Learning:** Updating dependencies for security (even minor versions) can break builds if the build toolchain is outdated. Specifically, `rollup-plugin-ascii` is unmaintained and incompatible with modern JS syntax.
**Prevention:** Remove or replace unmaintained build plugins when updating dependencies. In this case, removing `rollup-plugin-ascii` was safe as modern environments handle UTF-8 well.

## 2025-05-20 - PNPM Migration Mandate
**Vulnerability:** Inconsistent package manager usage (Yarn vs PNPM) can lead to lockfile drift and security issues.
**Learning:** While switching package managers is a breaking change, adhering to explicit user mandates (e.g., "Use PNPM") overrides general guidelines against breaking changes in security fixes.
**Prevention:** Always check user constraints before deciding on package management strategy.

## 2024-05-24 - Missing Security Headers in Edge Workers
**Vulnerability:** The Cloudflare worker serving the dashboard HTML didn't set security headers (CSP, X-Frame-Options, etc.), allowing potential clickjacking, XSS, and content sniffing.
**Learning:** Even though edge workers serve simple or completely static content, they still must return full security headers. It's easy to overlook this when the application logic is fully self-contained in a single response string.
**Prevention:** Always verify that edge/serverless response headers explicitly apply best practice security controls for HTML content.

## 2025-05-20 - Missing Nonces in Edge Worker Content Security Policy
**Vulnerability:** The Cloudflare worker returning HTML included `unsafe-inline` in its Content Security Policy for `script-src` and `style-src`, which could allow Cross-Site Scripting (XSS) if any user input were reflected.
**Learning:** Even when serving mostly static HTML from an edge worker, using `unsafe-inline` negates much of the benefit of a CSP. We can dynamically inject a cryptographic nonce into the CSP header and HTML payload using `crypto.randomUUID()` in the `fetch` event handler.
**Prevention:** Avoid `unsafe-inline` completely. When returning inline scripts/styles from a serverless function/worker, generate a per-request nonce and inject it into both the CSP header and the inline tags. Use classes instead of inline `style` attributes to avoid needing `unsafe-inline` for `style-src`.
