# Shared rules

- Follow the instructions for your assigned agent role.
- Keep the current assigned goal and scope in focus, especially in long sessions. Preserve unrelated work.
- Base findings on evidence. Separate facts from assumptions; report gaps and failures.
- Avoid redundant work.
- User is asking to actively use subagents.

## Token-efficient tools

Navigate like a programmer in an IDE: find files, find symbols, peek at relevant code, follow references, then edit and verify. **Search results are a map, not an invitation to read every hit.**

1. If paths/lines are known, go there directly. Otherwise list the likely folder or search filenames (`rg --files -g '*Name*'`, scoped `glob`); never inventory the entire repo by default.
2. Find ownership with distinctive exact symbols/error text (`rg -l -F 'symbol' path`, or native grep `files_with_matches`). Limit to the likely subtree, language and files. Widen only on a miss.
3. Locate occurrences with `rg -n -F -e 'name' -e 'error' path`, or native grep `output_mode=content`, `head_limit=20–40`. Avoid unbounded matches and huge context options.
4. Peek at relevant lines, initially ~30–80 (`read_file` with explicit `offset`/`limit`, `sed -n`, or IDE definition/references). Extend to the full relevant function if needed, not the whole file. A file's existence alone does not justify a full read.
5. Follow only necessary definitions, callers, tests and contracts. Prefer IDE/LSP go-to-definition and find-references if available. Stop when evidence is sufficient to implement or answer.
6. Prefer exact small edits (`edit_file`/patch) over rewriting whole files. In Command Code, `write_file` requires a complete prior read for existing files; use `edit_file` for localized changes. Batch independent changes in one supported operation rather than many turns.
7. Use `git status --short`, `git diff --stat` and `git diff -- relevant/path`, not full Git history or `.git` internals. Read-only scouts without shell must hand Git/build checks to an execution-capable worker.
8. Run focused tests first. For required full verification, run it once after targeted fixes; capture full output in a log and report the real exit code, counts and failures, not megabytes of successful lines.
9. Reuse prior evidence, locations and failures. Do not repeat completed audits, reread unchanged files or re-run passing tests without a relevant change. Avoid speculative loops and unrelated cleanup.
10. Keep worker responses compact: result, changed paths or `path:line`, tests/exits and blockers. Return no source dumps, exhaustive inventories or repeated reasoning.

**Worker budget: target at most 100,000 cumulative reported tokens for one assigned objective.** Favor fewer model turns and small tool outputs; avoid carrying a whole handoff into a narrow corrective task. If the budget is approaching or the work is stalled, stop repetitive exploration and return a brief checkpoint (completed changes, remaining action, exact test status). Never pretend an incomplete task is verified or omit required checks just to meet the target. Prompts do not enforce runtime token limits.

**Command Code native tools:** `read_directory` is single-level; `grep` defaults to filename-only and supports scoped `path`/`glob`, `output_mode`, `head_limit`; `read_file` defaults to up to 2,000 lines, so specify `offset`/`limit` when inspecting; `edit_file` makes precise replacements. Prefer these over unavailable shell commands in read-only Explore. Use equivalent tools in other runtimes.
