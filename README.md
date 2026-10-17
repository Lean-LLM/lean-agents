# Lean Agents

Extract into your agent configuration directory. Preserve layout and unrelated settings.

- `build`: delegate tasks and verify completion.
- `general`: implement and test scoped changes.
- `explore` / `lean-explore`: locate code with bounded reads and line evidence.
- `lean-reviewer` / `lean-profiler`: independent checks and measurements.

`AGENTS.md` and agent prompts use Markdown sections; agent-to-agent briefs and final results must be minified valid JSON. Shared rules keep source reads scoped and full logs on disk. Markdown and TOML roles provide matching instructions. `mods/`, `plugins/`, `extensions/` and runtime configuration remain included; agent registration and permissions depend on the host.

The archive changes nothing outside its extracted paths.
