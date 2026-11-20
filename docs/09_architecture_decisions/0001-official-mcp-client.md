# ADR-0001: Bridge Memtrace through the official DSH MCP client

Date: 2026-08-17 · Status: Accepted

## Context

Memtrace already speaks MCP (stdio `memtrace mcp`) for Claude, Cursor, Codex, and others. Re-registering 80+ tools with `defineTool` would duplicate schemas and drift from the server.

## Decision

We will insert `@deepseek-ai/dsh-mcp-client` with `serverName: memtrace` and spawn `memtrace mcp` (npx fallback). Skills are a separate Cordis row registered via `ctx.skills.register`.

Note (0.3.0): the npx fallback was superseded — the row now runs `MEMTRACE_BIN`, else `memtrace` from PATH.

## Consequences

Tools show up as `mcp__memtrace__*`. We inherit DSH MCP reconnect and naming rules. We cannot rename tools to bare names without a second native registrar.
