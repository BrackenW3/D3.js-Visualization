## 2025-05-20 - Build Failure with Modern Dependencies
**Vulnerability:** Ancient build tools (`rollup-plugin-ascii` v0.0.3) rely on `acorn` 3.x, which fails to parse modern JavaScript syntax used in updated `d3-*` dependencies.
**Learning:** Updating dependencies for security (even minor versions) can break builds if the build toolchain is outdated. Specifically, `rollup-plugin-ascii` is unmaintained and incompatible with modern JS syntax.
**Prevention:** Remove or replace unmaintained build plugins when updating dependencies. In this case, removing `rollup-plugin-ascii` was safe as modern environments handle UTF-8 well.

## 2025-05-20 - PNPM Migration Mandate
**Vulnerability:** Inconsistent package manager usage (Yarn vs PNPM) can lead to lockfile drift and security issues.
**Learning:** While switching package managers is a breaking change, adhering to explicit user mandates (e.g., "Use PNPM") overrides general guidelines against breaking changes in security fixes.
**Prevention:** Always check user constraints before deciding on package management strategy.
