# OpenCode

- `build` coordinates; workers perform their assigned work. Only `build` delegates. Every subagent call is **foreground** (`background: false`); wait for its result before the next action.
- Stay in the requested repository/path. Search exact locations first, then bounded paths. Avoid inventories, full-file dumps and unrelated Git history.
- Report the strongest supported findings with `path:line`. Separate code behavior, inferred impact, measured performance and unverified risks. Stop once the question is answered.
- Be concise and concrete. Quote only exact source excerpts; do not invent code, tool names, tests or benchmarks.
- Preserve unrelated work. Never claim unrun checks passed or use destructive Git operations without approval.
