import { spawnSync } from 'node:child_process'

const NPX_MEMTRACE = Object.freeze({ command: 'npx', args: Object.freeze(['-y', 'memtrace']) })

/**
 * Resolve the memtrace binary launch prefix. MEMTRACE_BIN wins, then a
 * `memtrace` on PATH, then `npx -y memtrace` (which downloads on first use).
 */
export function resolveMemtraceLaunch({ env, memtraceOnPath }) {
  const override = env.MEMTRACE_BIN?.trim()
  if (override) {
    return { command: override, args: [] }
  }
  if (memtraceOnPath) {
    return { command: 'memtrace', args: [] }
  }
  return { command: NPX_MEMTRACE.command, args: [...NPX_MEMTRACE.args] }
}

/** Resolve the launch for the Memtrace MCP server. */
export function resolveMemtraceMcpLaunch({ env, memtraceOnPath }) {
  const launch = resolveMemtraceLaunch({ env, memtraceOnPath })
  return { command: launch.command, args: [...launch.args, 'mcp'] }
}

/** Whether a `memtrace` command resolves on PATH. */
export function memtraceOnPath() {
  const probe = process.platform === 'win32' ? 'where' : 'which'
  const result = spawnSync(probe, ['memtrace'], { encoding: 'utf8' })
  return result.status === 0
}
