import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { resolveMemtraceMcpLaunch } from '../lib/resolve-memtrace-mcp.js'

describe('resolveMemtraceMcpLaunch', () => {
  it('prefers MEMTRACE_BIN when set', () => {
    const launch = resolveMemtraceMcpLaunch({
      env: { MEMTRACE_BIN: '/opt/memtrace' },
      memtraceOnPath: true,
    })

    assert.deepEqual(launch, { command: '/opt/memtrace', args: ['mcp'] })
  })

  it('uses memtrace on PATH when no override is set', () => {
    const launch = resolveMemtraceMcpLaunch({
      env: {},
      memtraceOnPath: true,
    })

    assert.deepEqual(launch, { command: 'memtrace', args: ['mcp'] })
  })

  it('falls back to npx memtrace mcp so a fresh DSH install still boots the server', () => {
    const launch = resolveMemtraceMcpLaunch({
      env: {},
      memtraceOnPath: false,
    })

    assert.deepEqual(launch, { command: 'npx', args: ['-y', 'memtrace', 'mcp'] })
  })
})
