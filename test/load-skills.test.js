import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { loadSkillsFrom } from '../lib/load-skills.js'

describe('loadSkillsFrom', () => {
  it('loads every SKILL.md bundle under skills/', () => {
    const root = mkdtempSync(join(tmpdir(), 'dsh-memtrace-skills-'))
    const firstDir = join(root, 'skills', 'memtrace-first')
    const searchDir = join(root, 'skills', 'memtrace-search')
    mkdirSync(firstDir, { recursive: true })
    mkdirSync(searchDir, { recursive: true })
    writeFileSync(
      join(firstDir, 'SKILL.md'),
      `---
name: memtrace-first
description: "Graph first."
---

First body.
`,
    )
    writeFileSync(
      join(searchDir, 'SKILL.md'),
      `---
name: memtrace-search
description: "Find symbols."
---

Search body.
`,
    )

    const skills = loadSkillsFrom(root)

    assert.equal(skills.length, 2)
    assert.deepEqual(
      skills.map((skill) => skill.name).sort(),
      ['memtrace-first', 'memtrace-search'],
    )
  })

  it('returns an empty list when the skills directory is missing', () => {
    const root = mkdtempSync(join(tmpdir(), 'dsh-memtrace-empty-'))
    assert.deepEqual(loadSkillsFrom(root), [])
  })
})
