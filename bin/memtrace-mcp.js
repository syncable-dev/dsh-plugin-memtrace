#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process'
import { resolveMemtraceMcpLaunch } from '../lib/resolve-memtrace-mcp.js'

const launch = resolveMemtraceMcpLaunch({
  env: process.env,
  memtraceOnPath: memtraceOnPath(),
})

const child = spawn(launch.command, launch.args, {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: process.env,
  shell: process.platform === 'win32',
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})

function memtraceOnPath() {
  const probe = process.platform === 'win32' ? 'where' : 'which'
  const result = spawnSync(probe, ['memtrace'], { encoding: 'utf8' })
  return result.status === 0
}
