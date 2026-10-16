# Lean Agents

Extract into your agent configuration directory. Keep the folder layout and preserve unrelated settings.

## Workflow

- `build` delegates and consolidates complete objectives.
- `explore` investigates source and returns evidence-backed answers.
- `general` inspects, plans, implements and tests cohesive changes.
- `lean-reviewer` checks results independently; `lean-profiler` measures performance.
- Follow up when evidence is missing, findings conflict, or checks fail; avoid redundant microtasks.

The legacy plugin file is now a no-op; it replaces older tool restrictions. Model and reasoning settings stay with the runtime except for worker defaults.

Code fixing, optimization, and Java reflection rules are part of the worker prompts; no separate skill loading is needed.

When upgrading, manually delete old `skills/code-fixing`, `skills/code-optimization`, and `skills/java-reflection-optimization` from your agent configuration directory. Extracting an archive does not remove old folders.
