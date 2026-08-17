# Solution strategy

1. **Compose, don't reimplement.** MCP tools come from `@deepseek-ai/dsh-mcp-client` pointed at `memtrace mcp`.
2. **Register skills at runtime.** `ctx.skills.register()` avoids the wholesale-config trap on the filesystem skill provider.
3. **Plain ESM, no build.** Git installs work without a `prepare` script.
4. **npx fallback.** A machine without a global `memtrace` still gets the server via `npx -y memtrace mcp`.
