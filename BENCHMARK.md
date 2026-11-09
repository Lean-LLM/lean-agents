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

## Round 2: harder task

**Task:** small shop lib, 4 files, 8 tests (4 failing: float math, negative stock, mutated input, bad sort comparator). Fix src without editing tests, add `applyCoupon` feature with new tests. Scored by a hidden acceptance test. 2 runs per variant, same model, run in parallel.

| Variant | Prompt | Tokens (run 1 / run 2) | Avg tokens | Avg time | Hidden tests |
| --- | --- | --- | --- | --- | --- |
| A | none | 48,596 / 45,461 | 47,029 | 45.0s | pass |
| C | current `AGENTS.md` | 49,374 / 48,264 | 48,819 | 50.6s | pass |
| D | 5-line coder prompt | 47,827 / 47,755 | 47,791 | 59.2s | pass |

**Reading:** all 6 runs correct. Spread inside a variant (up to 3k tokens, 21s) is as big as the gap between variants. No prompt beat no prompt. Agents did the work themselves, so delegation savings were not tested. Only proven saving: `AGENTS.md` is 25% smaller than before (4,891 → 3,665 bytes), which is a per-session input saving, not a task saving.
