# Runtime view

## Startup

1. Profile lists `dsh-plugin-memtrace` in `dsh.profile.bundles`.
2. Cordis applies `cordis.patch.yml`.
3. Skill plugin `apply()` registers every `skills/*/SKILL.md`.
4. The MCP client runs `MEMTRACE_BIN`, else `memtrace` from PATH; the listing child runs in the row `cwd`, and each tool call runs in a child in the Session's working directory (`perWorkingDirectory`). On a stock dsh, restate the row with `cwd: <repo root>`.
5. Tools appear as `mcp__memtrace__find_symbol`, `mcp__memtrace__get_impact`, …

## Unload

Fiber disposal unregisters skills and stops the MCP child.
