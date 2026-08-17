import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const packageRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))

describe('DSH bundle contract', () => {
  it('declares dsh.bundle.patch so dsh plugin add activates a layer', () => {
    const manifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'))
    assert.equal(manifest.name, 'dsh-plugin-memtrace')
    assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
    assert.ok(manifest.keywords.includes('dsh-plugin'))
    assert.ok(manifest.bin['dsh-plugin-memtrace-mcp'])
  })

  it('inserts the skill plugin and the official MCP client under stable ids', () => {
    const patch = readFileSync(join(packageRoot, 'cordis.patch.yml'), 'utf8')
    assert.match(patch, /id:\s*dsh-plugin-memtrace/)
    assert.match(patch, /name:\s*dsh-plugin-memtrace/)
    assert.match(patch, /id:\s*mcp-memtrace/)
    assert.match(patch, /name:\s*'@deepseek-ai\/dsh-mcp-client'/)
    assert.match(patch, /serverName:\s*memtrace/)
    assert.match(patch, /transport:\s*stdio/)
  })
})
