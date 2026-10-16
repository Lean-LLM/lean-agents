---
name: java-reflection-optimization
description: Cache Java reflection lookups and failures. Use when writing or optimizing reflection code.
---

# Java Reflection Optimization

- Prefer direct calls over reflection when possible.
- Always cache `Class.forName` results, including failures.
- Cache classes, methods, fields, constructors, method handles, var handles, and reflection scans.
- Resolve each lookup once. Every later access must use the cache, never reflection again.
- Cache failed lookups permanently. Never retry missing, inaccessible, or incompatible members.
- Store explicit success/failure results. Never use `null` or thrown exceptions as uncached failures.
- Initialize caches atomically and thread-safely. Concurrent calls must not repeat the same lookup.
- Key caches by classloader, class, member name, and signature where applicable.
- Check and configure access once. Never repeat `setAccessible` or equivalent access setup.
- Keep lookup failures separate from exceptions thrown by invoked code.
- Record each failure once. Repeated calls use the cached failure without repeated logs.
- Scope caches to the owning classloader and avoid classloader leaks.
- Keep reflection out of hot loops. Reuse cached `MethodHandle` or `VarHandle` when appropriate.
