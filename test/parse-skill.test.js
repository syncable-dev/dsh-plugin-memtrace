import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseSkillMarkdown } from '../lib/parse-skill.js'

describe('parseSkillMarkdown', () => {
  it('extracts kebab-case name, quoted description, and body after frontmatter', () => {
    const parsed = parseSkillMarkdown(`---
name: memtrace-first
description: "Use the graph before grep."
---

# Memtrace First

Do not grep.
`)

    assert.equal(parsed.name, 'memtrace-first')
    assert.equal(parsed.description, 'Use the graph before grep.')
    assert.match(parsed.body, /# Memtrace First/)
    assert.doesNotMatch(parsed.body, /^---/)
  })

  it('strips wrapping quotes from an unquoted name field', () => {
    const parsed = parseSkillMarkdown(`---
name: "memtrace-search"
description: Find a symbol.
---

body
`)

    assert.equal(parsed.name, 'memtrace-search')
    assert.equal(parsed.description, 'Find a symbol.')
  })

  it('throws when frontmatter is missing a kebab-case name', () => {
    assert.throws(
      () => parseSkillMarkdown(`---
description: "orphan"
---

body
`),
      /skill name/,
    )
  })
})
