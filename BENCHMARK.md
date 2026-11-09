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

## Rounds 3-7: prompt variants for the CODER

Same fixture, 2-3 runs each, prompts pasted inline. All runs passed visible and hidden tests.

| Variant | Avg tokens | Avg time | Tool uses |
| --- | --- | --- | --- |
| No prompt | 47,770 | 43.0s | 8 |
| Old-style `AGENTS.md` | 48,079 | 44.7s | 7.5 |
| Terse thinking | 46,422 | 36.1s | 6.5 |
| Terse + max 2 calls before first edit | 45,052 | 31.9s | 2.7 |
| Ultra-terse | 49,026 | 47.0s | 13 |
| Adopted: 2-call cap, short JSON, no skills line | 47,202 | 40.3s | 5.0 |

**Reading:** the 2-call cap cut time about 25% and tokens about 6% when output was plain text. With a JSON report the gain shrinks to about 1% tokens and 6% time. Asking agents to load skills first added about 3% tokens and 12% time. Ultra-terse wording did not help. Runs are bimodal (2-3 or 10-11 tool calls), so gains under 5% are not proven. Delegation was not measured. Full notes are in the local `.mocks/docs` folder.

## Round 8: delegation (3 independent shop-lib folders, same task)

Orchestrator-reported tokens / time / tool calls. Worker tokens are not reported by the tool, so delegation totals are higher than shown.

| Setup | Tokens | Time | Tools | Result |
| --- | --- | --- | --- | --- |
| No prompt, one agent | 46-48k | 40-52s | 6-8 | 3/3 pass |
| Old AGENTS.md, delegates | 59k + workers | 118s | 21 | 3/3 pass |
| Always-delegate prompt | 50k + workers | 33 min | 8 | 3/3 pass after one worker was stopped and rerun |
| "Delegate only when big" (2 runs) | 47.6-48.0k | 57-58s | 5 | 6/6 pass, did it inline |

Reading: delegating small tasks costs more and is slower. Each worker re-pays ~40k of context. AGENTS.md now says to delegate only big tasks. Not tested: a truly big task where delegation might win. No savings claimed.
