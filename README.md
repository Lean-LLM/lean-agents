# Lean Agents

Copy the archive contents into your agent configuration directory, preserving the layout. Merge existing settings rather than overwriting unrelated configuration.

## Workflow

- `build` delegates and consolidates complete objectives.
- `explore` investigates source and returns evidence-backed answers.
- `general` inspects, plans, implements and tests cohesive changes.
- `lean-reviewer` checks results independently; `lean-profiler` measures performance.
- Follow up when evidence is missing, findings conflict, or checks fail; avoid redundant microtasks.

The bundled legacy plugin filename is retained as a no-op to replace older tool-interception code. Existing model and reasoning choices stay with the runtime, apart from the bundled worker defaults.

Bundled skills: `code-fixing`, `code-optimization`, `java-reflection-optimization`. Load those relevant to the task.
