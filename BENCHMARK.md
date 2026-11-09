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

## Round 9: real token traces (opencode, open-design/deepseek-v4.1-flash)

Task: vague bug-fix brief on the shop lib (`task4.txt`), 4 bugs + 3 missing features, hidden accept tests. Each run is a fresh session with the variant as `AGENTS.md`. Tokens come from the run's step records, so reasoning is counted. "Fresh" = in + out + reasoning (cache reads excluded). Runs with provider errors are dropped. Time is inflated by up to 10 parallel runs; compare rows, not absolutes. Spread is large (±5 to ±23k), n is small.

| variant | n | pass | in | out | reasoning | fresh | cache read | steps | tools | time s |
|---|---|---|---|---|---|---|---|---|---|---|
| no prompt | 8 | 8/8 | 32.0k | 5.6k | 10.1k | 47.7k | 666k | 25 | 28 | 272 |
| previous AGENTS.md | 4 | 4/4 | 23.0k | 4.3k | 5.7k | 33.0k | 251k | 15 | 22 | 113 |
| A: 280B "think little" | 7 | 7/7 | 12.7k | 2.9k | 3.4k | 19.1k | 130k | 11 | 13 | 101 |
| B: A + do it yourself | 3 | 3/3 | 16.1k | 4.0k | 5.5k | 25.7k | 159k | 12 | 18 | 141 |
| M: old + terse edits | 4 | 4/4 | 23.6k | 4.3k | 5.2k | 33.2k | 338k | 17 | 24 | 158 |
| Q: M without ADHD | 4 | 4/4 | 17.0k | 5.0k | 7.2k | 29.3k | 327k | 21 | 25 | 192 |
| R: Q without skills line | 4 | 4/4 | 25.2k | 5.5k | 9.5k | 40.2k | 519k | 23 | 24 | 194 |
| T: slim 0.9KB (now AGENTS.md) | 4 | 4/4 | 16.2k | 3.5k | 5.9k | 25.5k | 164k | 12 | 16 | 128 |

Reading:
- Quality equal: every kept run passed all tests.
- Short prompts use fewer tokens, fewer reasoning tokens and fewer steps than none or the long one. A is best (-60% fresh vs no prompt, -42% vs previous) but has no routing or questions rules. T keeps them: -47% vs no prompt, -23% vs previous.
- Adding terse wording to the long prompt (M, Q, R) did not help. Prompt length seems to matter more than wording.
- ADHD and Engineering sections dropped from the shipped `AGENTS.md` (T). Tested on their own in round 10.
- Round 8 and the big-task runs (3 modules): delegating small and mid tasks was slower with no gain.
- Not tested: other models, much bigger tasks. Savings are on this task only.

Raw data and scripts: `.mocks/` (ignored).

## Round 10: shipped prompt re-run, and the dropped sections tested alone

Same task, model and method as round 9. 9 sessions in parallel; failed provider runs dropped.

| variant | n | pass | in | out | reasoning | fresh | cache read | steps | tools | time s |
|---|---|---|---|---|---|---|---|---|---|---|
| T (shipped), re-run | 3 | 3/3 | 14.1k | 3.2k | 7.2k | 24.4k | 156k | 12 | 12 | 128 |
| T + ADHD section | 3 | 3/3 | 28.0k | 6.1k | 9.8k | 43.9k | 565k | 23 | 28 | 180 |
| T + Engineering section | 2 | 2/2 | 30.8k | 4.7k | 8.0k | 43.4k | 454k | 22 | 27 | 166 |

Reading: the shipped prompt holds (24-25k, same as round 9, n=7 total). Each dropped section made the run use about 75-80% more fresh tokens, about 2x steps, and slower, with the same pass rate. Both stay out. Small n; ADHD spread is wide (±21k). Not tested: other models, bigger tasks.

## Round 11: bigger task with exact spec (3 modules: LRU, CSV, semver)

Same model and method. Spec is precise, 3 independent modules, hidden accept tests. 9 sessions in parallel.

| variant | n | pass | in | out | reasoning | fresh | cache read | steps | tools | time s |
|---|---|---|---|---|---|---|---|---|---|---|
| no prompt | 3 | 3/3 | 13.7k | 4.5k | 4.1k | 22.4k | 121k | 10 | 11 | 110 |
| A (280B) | 3 | 3/3 | 14.0k | 3.7k | 3.2k | 20.8k | 84k | 7 | 9 | 93 |
| T (shipped) | 3 | 3/3 | 14.6k | 5.3k | 3.5k | 23.3k | 129k | 10 | 10 | 84 |

Reading: with an exact spec, all three are within noise (21-23k). No variant delegated. The savings in round 9 appear on vague tasks, where no prompt wanders and reasons more. Do not expect the same savings on tasks that spell out the steps.

## Round 12: is A really better than T?

Same vague task, model and method as round 9. More runs of A, plus two new variants. Failed provider runs dropped (Y mostly failed, n=1, ignore).

| variant | n | pass | fresh | reasoning | steps | time s |
|---|---|---|---|---|---|---|
| no prompt | 8 | 8/8 | 47.7k | 10.1k | 25 | 272 |
| A (280B), now 11 runs | 11 | 11/11 | 25.2k ±12.5 | 5.7k | 13 | 113 |
| T (shipped), 7 runs | 7 | 7/7 | ~25k ±5 | ~6k | 12 | ~128 |
| U: A + questions line | 4 | 4/4 | 47.4k ±17.7 | 10.1k | 24 | 156 |

Reading: A's earlier 19k was luck. At n=11 A equals T (about 25k). So T is not worse than A and keeps the routing and questions rules. U shows one extra line can wipe out the gain, so results move a lot with small wording changes and with run luck; any claim under n~10 is weak. We stop here: the shipped prompt is about 47% below no prompt (47.7k to ~25k) on vague tasks, no gain on exact-spec tasks, quality equal.

## Round 13: delegating prompts (opencode, deepseek-v4.1-flash, vague shop task)

Orchestrator (`build`) + `general` worker. Tokens summed over the whole session tree. Fresh = in + out + reasoning. Score /100 = quality 40 + delegation kept 20 + tokens 25 + speed 15 (targets: 60% of the original's tokens and time).

| variant | n | pass | fresh | reasoning | time s | score |
|---|---|---|---|---|---|---|
| original (3.7KB) | 5 | 5/5 | 48.4k | 8.3k | 218 | 84 |
| TD: short delegating (1.1KB, now `AGENTS.md`) | 6 | 6/6 | 50.5k | 8.6k | 225 | 83 |
| Caveman-style output rules | 6 | 6/6 | 64.1k | 14.2k | 250 | 79 |
| 150-word thinking budget | 6 | 6/6 | 47.1k | 6.6k | 200 | 85 |
| 5-word drafts | 3 | 3/3 | 45.5k | 9.1k | 156 | 89 |

Reading: no tested wording beat the original beyond noise (n<=6, spread +-5 to +-27k). Early wins at n=3 flipped at n=6. The short prompt equals the original in tokens, speed and quality and is 70% smaller, with delegation kept. Reasoning is only ~15% of tokens; the rest is input, mostly the brief and the worker's own context. Not tested: other models, tasks big enough for several parallel workers.

## Round 15-16: devin CLI, deepseek-v4-1-flash-1017-low, vague shop task, delegating via run_subagent

Opencode providers were out of funds, so this round used devin. Its export counts the orchestrator only (workers not included); reasoning is trace chars/4. Fresh = prompt - cached + completion. Hidden tests: all runs passed.

| variant | n | pass | orch fresh | reasoning | delegated | time s |
|---|---|---|---|---|---|---|
| original | 10 | 10/10 | 28.2k | 2.9k | 8/10 | 64 |
| TD (previous `AGENTS.md`) | 10 | 10/10 | 22.4k | 2.5k | 4/10 | 36 |
| V7: TD + thinking budget, no re-reads, test once, no scratch scripts, act when obvious | 20 | 20/20 | 23.4k | 2.6k | 16/20 | 46 |
| W5: V7 + "verify once, do not re-read worker files" (now `AGENTS.md`) | 20 | 20/20 | 18.6k | 1.9k | 17/20 | 38 |

Reading: TD is cheap but often skips the worker (4/10). W5 keeps the worker (17/20) and uses 17% fewer orchestrator tokens than TD, 21% fewer than V7. Lost: shorter brief (delegation 2/10), worker call cap (5/10), batch line (6/10). Worker tokens not measured; the 12k target is not reached.

Output tokens over the whole devin session (all assistant messages incl. worker, from devin's session DB `num_tokens`; input side not recorded for workers): original 15.7k (n=11), TD 13.2k (10), V7 15.6k (20), W5 13.3k (20). W5 is 16% below the original; it is equal to TD within noise (spread about +-3k) but delegates far more often. Worker input tokens are still unmeasured.
