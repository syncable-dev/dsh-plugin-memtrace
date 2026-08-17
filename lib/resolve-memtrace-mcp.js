const NPX_MEMTRACE_MCP = Object.freeze({
  command: 'npx',
  args: Object.freeze(['-y', 'memtrace', 'mcp']),
})

export function resolveMemtraceMcpLaunch({ env, memtraceOnPath }) {
  const override = env.MEMTRACE_BIN?.trim()
  if (override) {
    return { command: override, args: ['mcp'] }
  }
  if (memtraceOnPath) {
    return { command: 'memtrace', args: ['mcp'] }
  }
  return {
    command: NPX_MEMTRACE_MCP.command,
    args: [...NPX_MEMTRACE_MCP.args],
  }
}
