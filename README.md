# Lean Agents

Extract into your agent configuration directory, preserving the folder layout and unrelated settings.

- `build`: primary coordinator, delegates complete tasks and verifies results.
- `explore`: targeted source investigation.
- `general`: implementation and focused tests.
- `lean-reviewer`: independent checks; `lean-profiler`: scoped measurements.

Keep `AGENTS.md` for shared rules. Orchestrator-only rules live in `agents/build.md`, not in shared memory. `mods/lean-primary.ts` is a small Command Code loader for that same prompt: it injects only when the native `agent` delegation tool is available. It does not define extra workers or block tools. In Command Code, built-in `explore`/`general` are reserved names, so those built-in workers are used instead of replacing them.

Use exact files or narrow searches, stop when evidence is sufficient, and continue with focused work if the task is not verified. No separate skills are required: code-fixing, optimization and Java-reflection guidance lives in worker prompts.

When upgrading, remove old `skills/code-fixing`, `skills/code-optimization`, and `skills/java-reflection-optimization` folders if present. Older Command Code installs may also have a duplicate `commandcode/` subtree and `lean-*` workers; they are not needed. This archive does not delete installed files.
