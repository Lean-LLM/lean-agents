---
name: code-optimization
description: Load for optimizing CPU, memory, latency, allocations, and duplicated logic.
---

# Code optimization

- Inspect measured costs and duplicate logic.
- Make scoped small measurements on areas optimized.
- Simplify and share logic; identify repeated code and extract common utilities.
- Reduce CPU and memory cost without breaking behavior.
- Make small changes, test, and compare equivalent workloads.
- Keep small verified wins.
- No arbitrary savings threshold; disclose unmeasured gains.
- Keep benchmarks and tests fast and scoped, not massive full-app runs.
