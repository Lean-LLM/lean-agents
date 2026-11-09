# Benchmark

No speed or token savings are claimed. One small test found none.

**Task:** fix `parsePrice('$1,234.50')` (returns 1, want 1234.5), handle other currency symbols and spaces, add a regression test, run tests. Fixture: 3 small JS files + `node --test`.
**Model:** Claude Sonnet 5.5, general-purpose subagent, one run each, run in parallel.

| Variant | Prompt | Subagent tokens | Tool uses | Time |
| --- | --- | --- | --- | --- |
| A | none | 39,448 | 4 | 13.5s |
| B | previous `AGENTS.md` (with HarnessMM) | 41,220 | 5 | 15.7s |
| C | current `AGENTS.md` | 40,870 | 5 | 14.5s |

All three fixed the bug and passed tests. Same fix in each.

**Reading:** most tokens are fixed context (~39k) the prompt cannot change. C is 0.9% under B, 3.6% over A. n=1, so all differences are noise. Prompt size matters little on small tasks; any gain would need larger tasks and repeated runs.
