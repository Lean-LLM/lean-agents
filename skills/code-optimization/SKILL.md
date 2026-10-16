---
name: code-optimization
description: Load for CPU, memory, latency, allocations, simplification or duplicated logic.
---

# Code optimization

`build` delegates; workers execute their assigned work directly, never spawn agents. Explore cost and duplicate logic. `build` assigns `lean-profiler` when measurement is useful. Simplify and share logic; reduce CPU/memory cost without breaking behavior. Make small changes, test and compare equivalent workloads. Keep small verified wins. No arbitrary savings threshold; disclose unmeasured gains.
