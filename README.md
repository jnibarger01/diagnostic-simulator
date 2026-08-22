# Diagnostic Decision Lab

Automotive **differential-diagnosis engine** with a causal simulator attached.

**Live:** [https://jnibarger01.github.io/diagnostic-simulator/](https://jnibarger01.github.io/diagnostic-simulator/)

- **Diagnose** — intake a complaint, rank hypotheses, log evidence, pick the next-best test.
- **Simulator** — six causal Toyota/Lexus cases on the same engine. The hidden fault never seeds the differential.
- Sessions, tools (scan / DVOM / scope), and an engine eval harness stay in the browser (`localStorage`). No account, no database.

The public GitHub Pages build is a static SPA. The case creator falls back to the local generator (no server-side AI on Pages).
