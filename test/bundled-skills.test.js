import assert from 'node:assert/strict'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { loadSkillsFrom } from '../lib/load-skills.js'

const packageRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))

describe('bundled Memtrace skills', () => {
  it('ships every Memtrace workflow as a kebab-case SKILL.md bundle', () => {
    const skills = loadSkillsFrom(packageRoot)
    const names = skills.map((skill) => skill.name)

    assert.ok(skills.length >= 20, `expected >= 20 skills, got ${skills.length}`)
    assert.ok(names.includes('memtrace-first'))
    assert.ok(names.includes('memtrace-search'))
    assert.ok(names.includes('memtrace-impact'))
    assert.equal(new Set(names).size, names.length)
    for (const skill of skills) {
      assert.ok(skill.description.length > 20, skill.name)
      assert.ok(skill.body.includes('\n'), skill.name)
      assert.equal(skill.directory, join(packageRoot, 'skills', skill.name))
    }
  })
})
