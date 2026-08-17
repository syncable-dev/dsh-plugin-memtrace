# Introduction and goals

`dsh-plugin-memtrace` is the DeepSeek Harness bundle for [Memtrace](https://memtrace.io): a local-first code intelligence graph. It exists so a DSH agent can search, relate, and time-travel a codebase through Memtrace tools instead of grepping blindly.

## Quality goals

1. Install with one `dsh plugin add` command.
2. Register every Memtrace skill without colliding with other bundles' config rows.
3. Bridge Memtrace MCP through the official `@deepseek-ai/dsh-mcp-client`.
4. Stay build-free (plain ESM) so git installs do not need `allowBuilds`.
