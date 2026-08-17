# Runtime view

## Startup

1. Profile lists `dsh-plugin-memtrace` in `dsh.profile.bundles`.
2. Cordis applies `cordis.patch.yml`.
3. Skill plugin `apply()` registers every `skills/*/SKILL.md`.
4. MCP client spawns `npx -y memtrace mcp` (or `MEMTRACE_BIN mcp`).
5. Tools appear as `mcp__memtrace__find_symbol`, `mcp__memtrace__get_impact`, …

## Unload

Fiber disposal unregisters skills and stops the MCP child.
