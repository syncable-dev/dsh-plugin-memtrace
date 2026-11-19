import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { DSH_WORKSPACE_NAME, ensureWorkspace, workspaceLaunchArgs } from '../lib/ensure-workspace.js'

const verbOf = (launch) => launch.args[launch.args.length - 2]

describe('workspaceLaunchArgs', () => {
  it('builds show/create argv through the resolved memtrace launch', () => {
    assert.deepEqual(
      workspaceLaunchArgs({ env: {}, memtraceOnPath: true, workspace: 'dsh' }, 'show'),
      { command: 'memtrace', args: ['workspace', 'show', 'dsh'] },
    )
    assert.deepEqual(
      workspaceLaunchArgs({ env: { MEMTRACE_BIN: '/opt/memtrace' }, memtraceOnPath: true, workspace: 'dsh' }, 'create'),
      { command: '/opt/memtrace', args: ['workspace', 'create', 'dsh'] },
    )
    assert.deepEqual(
      workspaceLaunchArgs({ env: {}, memtraceOnPath: false, workspace: 'dsh' }, 'create'),
      { command: 'npx', args: ['-y', 'memtrace', 'workspace', 'create', 'dsh'] },
    )
  })
})

describe('ensureWorkspace', () => {
  it('skips create when the workspace already exists (show exits 0)', async () => {
    const verbs = []
    const result = await ensureWorkspace('dsh', {
      env: {},
      memtraceOnPath: true,
      run: async (launch) => {
        verbs.push(verbOf(launch))
        return { status: 0 }
      },
    })
    assert.deepEqual(verbs, ['show'])
    assert.deepEqual(result, { existed: true })
  })

  it('creates the workspace when show reports it missing (exit 2)', async () => {
    const verbs = []
    const result = await ensureWorkspace('dsh', {
      env: {},
      memtraceOnPath: true,
      run: async (launch) => {
        const verb = verbOf(launch)
        verbs.push(verb)
        return { status: verb === 'show' ? 2 : 0 }
      },
    })
    assert.deepEqual(verbs, ['show', 'create'])
    assert.deepEqual(result, { existed: false })
  })

  it('never rejects when creation fails; reports the diagnostic and the manual fix', async () => {
    const warnings = []
    const result = await ensureWorkspace(DSH_WORKSPACE_NAME, {
      env: {},
      memtraceOnPath: false,
      run: async () => ({ status: 1 }),
      log: (message) => warnings.push(message),
    })
    assert.deepEqual(result, { existed: false, error: 'exit 1' })
    assert.match(warnings[0], /workspace create dsh failed/)
    assert.match(warnings[0], /memtrace workspace create dsh/)
  })

  it('reports spawn errors instead of rejecting', async () => {
    const result = await ensureWorkspace('dsh', {
      env: {},
      memtraceOnPath: true,
      run: async () => ({ status: null, error: new Error('spawn ENOENT') }),
    })
    assert.equal(result.existed, false)
    assert.match(result.error ?? '', /spawn ENOENT/)
  })
})
