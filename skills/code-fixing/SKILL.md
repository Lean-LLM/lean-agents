---
name: code-fixing
description: Load for errors, crashes, regressions or incorrect behavior.
---

# Code fixing

`build` delegates; workers execute their assigned work directly, never spawn agents. Explore actual versus expected behavior, reproduce when possible, locate the first wrong state and apply the smallest root-cause fix. Add focused regression tests and verify. Split independent issues. Repeat only with new evidence. Never mask failures or weaken tests.
