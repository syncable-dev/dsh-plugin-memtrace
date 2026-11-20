# Risks and technical debt

| Priority | Risk | Mitigation |
| --- | --- | --- |
| P1 | First DSH turn can race MCP discovery | `failOnStartupError: false` + reconnect; README tells users to wait or send a second prompt |
| P2 | `memtrace` missing from PATH: the MCP server never starts and its tools silently don't appear (`failOnStartupError: false`) | Document `npm i -g memtrace` and `MEMTRACE_BIN` |
| P2 | A stock dsh ignores `perWorkingDirectory`, so calls fail with "no workspace owner" | Restate the `mcp-memtrace` row with `cwd: <repo root>`; ship the option upstream in dsh-mcp-client |
| P3 | Skills snapshot can drift from the Memtrace installer | `npm run sync-skills` from the product monorepo |
