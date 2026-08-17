# Risks and technical debt

| Priority | Risk | Mitigation |
| --- | --- | --- |
| P1 | First DSH turn can race MCP discovery | `failOnStartupError: false` + reconnect; README tells users to wait or send a second prompt |
| P2 | `npx -y memtrace mcp` is slow cold | Document `npm i -g memtrace` and `MEMTRACE_BIN` |
| P3 | Skills snapshot can drift from the Memtrace installer | `npm run sync-skills` from the product monorepo |
