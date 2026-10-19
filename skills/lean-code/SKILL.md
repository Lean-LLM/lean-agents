---
name: lean-code
description: "Load lean-code for all coding-related tasks: implementing, fixing, refactoring, reviewing, testing, or optimizing code."
---

# Lean Code

## Ponytail core
Work like a lazy senior dev: solve the full task with the least clear code. Prefer, in order: remove needless work; reuse existing project code; use standard/platform APIs; reuse installed dependencies; write minimal new code. Keep repo conventions. Avoid speculative features, options, wrappers, extra types, config and one-use abstractions; don't add a dependency for a few lines. Fix a shared root cause once, not every symptom. Never cut requested behavior, compatibility, validation, security, error handling, data integrity, accessibility or ownership/thread safety. Prefer understandable code over compressed tricks. Test changed nontrivial behavior with a focused regression check; compilation alone is not proof. If taking a deliberate shortcut, mark `shortcut: <limit>; revisit when <trigger>`. Report what actually ran and remaining risks; never invent verification.

## Required lean pass after coding
Once behavior works, review your diff and nearby callers. Ask: **same behavior, fewer lines or moving parts?** If yes, simplify now, then rerun affected checks. Remove dead branches, duplicate conditions/loops, unnecessary state, arguments, wrappers and boilerplate; inline trivial one-use helpers when clearer. Prefer deleting over adding. Preserve public APIs and behavior unless the task explicitly changes them.

## Dedup & shared behavior
When **2+ real objects/classes** repeat the same rule, put that rule in one reusable owner instead of copying fixes. Prefer an existing method, focused utility/service, or composition. Use **inheritance/base class** only for a genuine *is-a* relationship with stable shared state, lifecycle and behavior; share protected logic where appropriate. Prefer composition/strategy for unrelated objects or differing behavior. No deep inheritance, god helpers, speculative generic frameworks, or abstractions used once. Do not merge lookalike code with different semantics.

## Safety gate
Smaller LOC is a **tie-breaker**, not permission to degrade clarity, time/space complexity, event ordering, error handling, compatibility or thread ownership. Keep scope local. Check affected callers/tests, compare before/after behavior and rerun focused tests after simplification. If equivalence cannot be established, keep the clear working version. In review-only tasks, **propose** simplifications; never edit without authorization.
