import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { createApply } from '../lib/register-skills.js'

function fakeContext() {
  const registered = []
  const effects = []
  return {
    registered,
    skills: {
      register(skill) {
        registered.push(skill)
        return () => {
          const index = registered.indexOf(skill)
          if (index >= 0) registered.splice(index, 1)
        }
      },
    },
    effect(run) {
      const dispose = run()
      effects.push(dispose)
      return dispose
    },
    unload() {
      for (const dispose of effects.splice(0).reverse()) {
        if (typeof dispose === 'function') dispose()
      }
    },
  }
}

describe('createApply', () => {
  it('registers each bundled skill, ensures the dsh workspace, and unregisters on unload', async () => {
    const root = mkdtempSync(join(tmpdir(), 'dsh-memtrace-apply-'))
    const skillDir = join(root, 'skills', 'memtrace-first')
    mkdirSync(skillDir, { recursive: true })
    writeFileSync(
      join(skillDir, 'SKILL.md'),
      `---
name: memtrace-first
description: "Graph first."
---

Body.
`,
    )

    const ensureCalls = []
    const ctx = fakeContext()
    createApply(root, {
      ensureWorkspace: async (...args) => {
        ensureCalls.push(args)
        return { existed: true }
      },
    })(ctx)

    assert.equal(ctx.registered.length, 1)
    assert.equal(ctx.registered[0].name, 'memtrace-first')
    assert.equal(ctx.registered[0].source, 'bundled')
    assert.deepEqual(ctx.registered[0].resourceBase, {
      kind: 'directory',
      path: root,
    })
    assert.match(ctx.registered[0].content, /Body/)

    await new Promise((resolve) => setImmediate(resolve))
    assert.deepEqual(ensureCalls.map((args) => args[0]), ['dsh'])

    ctx.unload()
    assert.equal(ctx.registered.length, 0)
  })
})
