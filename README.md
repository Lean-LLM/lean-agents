# Lean Agents

Lean agent bundle based on OpenCode Hybrid v5.4. The five Markdown agents, two skills and OpenCode config remain compatible. Primary agents delegate repository work; subagents perform it using their own tools. The shared AGENTS.md distinguishes those roles explicitly. Subagents are fresh and foreground.

Workflow: read-only question → `explore` investigates → primary answers. Implementation → one `general`/Codex `worker` per cohesive objective (inspect → plan → edit → focused tests), followed by independent `lean-reviewer` checks and `lean-profiler` measurements when relevant. A separate preliminary explorer is optional, not mandatory.

Unpack the archive **contents** into the configuration directory for the CLI you use, overwriting individual files only after checking for existing local customizations:

| CLI | Destination |
|---|---|
| OpenCode V2 | `~/.config/opencode/` |
| Claude Code | `~/.claude/` |
| Codex | `~/.codex/` |
| Command Code | `~/.commandcode/` |
| Pi | `~/.pi/agent/` |

The tree is shared: `AGENTS.md`, `agents/`, `skills/`, `plugins/`, `extensions/`, `opencode.jsonc`, `README.md`. No platform-specific package folders, installer, or startup script.

## Behavior and compatibility

- **OpenCode V2:** Uses `opencode.jsonc`, Markdown agents, skills, and `plugins/foreground-subagents.js`. `build` denies direct filesystem, shell, and Code Mode `execute` operations while retaining native foreground `subagent` calls; workers retain their own permitted tools. The plugin forces foreground execution, drops continuation IDs and falls back to `general` for unknown role names. Restart after copying. Existing `opencode.jsonc` includes the optional `@slkiser/opencode-quota` dependency; merge instead of overwriting if customized.
- **Claude Code:** No `CLAUDE.md` is included, as requested. Claude must be configured to load `AGENTS.md` for the shared rules to apply; do not assume it reads that file by default. Markdown agents and skills may be used where supported. OpenCode-specific permissions and `mode` are not enforced by Claude.
- **Codex:** Native `agents/*.toml` roles adapt the OpenCode Markdown workers. Use the custom `explore` role (`explore.toml`, matching `explore.md`) for source investigation; no separate `explorer` alias is included. All Codex roles specify `model_reasoning_effort = "low"`. `worker.toml` overrides Codex’s native implementation worker, matching OpenCode’s `general.md` behavior. The duplicate Codex `general.toml` has been removed. Codex's primary is not literally named `build`, and OpenCode-specific restrictions are not enforced. No `config.toml` is overwritten. If previously installed, remove the old `~/.codex/agents/general.toml` manually; extraction does not delete older files.
- **Command Code:** Reads `AGENTS.md`, Markdown agents and skills. Its built-in `Explore` and `General` agents cannot be replaced through these Markdown files; therefore the OpenCode overrides are not guaranteed to be used. No `settings.json` is overwritten.
- **Pi:** Reads `AGENTS.md` and skills. A self-contained `extensions/lean-subagents.ts` exposes a foreground `subagent` tool for `explore`, `general`, `lean-reviewer`, `lean-profiler` using the untouched Markdown bodies. Pi must be on `PATH`. This is a minimal adapter, not a substitute for a feature-complete Pi subagent package.

All platforms should discover the shared files after copying, but **identical orchestration and permission enforcement across five different runtimes is not possible from one unchanged OpenCode prompt**. In particular, Command Code's built-ins remain native, and Codex/Claude/Pi have different parent-agent semantics. No live CLI integration runs are included.

## Optional model defaults

For **Codex**, merge (do not replace your current `~/.codex/config.toml`):

```toml
[agents]
default_subagent_model = "gpt-6-luna"
default_subagent_reasoning_effort = "low"
max_concurrent_threads_per_session = 10
```

For **Claude Code**, merge into `~/.claude/settings.json` if these model IDs are supported by your configured provider (these env keys are not independently confirmed as honored by every Claude Code build):

```json
{
  "env": {
    "CLAUDE_CODE_SUBAGENT_MODEL": "claude-haiku-5-5",
    "CLAUDE_CODE_SUBAGENT_MODEL_FORCE": "1",
    "CLAUDE_CODE_EFFORT_LEVEL": "low"
  }
}
```

No automatic model changes are applied. No installer or post-extraction command is required.
