#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { memtraceOnPath, resolveMemtraceLaunch } from '../lib/resolve-memtrace-mcp.js'

const launch = resolveMemtraceLaunch({
  env: process.env,
  memtraceOnPath: memtraceOnPath(),
})

const child = spawn(launch.command, [...launch.args, 'mcp'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: process.env,
  shell: process.platform === 'win32',
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})
