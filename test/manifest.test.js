import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
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
    // No published launcher: the MCP client spawns `memtrace` directly.
    assert.equal(manifest.bin, undefined)
    assert.ok(!manifest.files.includes('bin/'))
  })

  it('inserts the skill plugin and the official MCP client under stable ids', () => {
    const patch = readFileSync(join(packageRoot, 'cordis.patch.yml'), 'utf8')
    // Comment lines are ignored. Only the scalar command may evaluate !!js,
    // because the 0.2.x composer mangles evaluated values that return arrays;
    // perWorkingDirectory routes each tool call to the Session's directory.
    const body = patch.replace(/^#.*$/gm, '')
    assert.match(body, /id:\s*dsh-plugin-memtrace/)
    assert.match(body, /name:\s*dsh-plugin-memtrace/)
    assert.match(body, /id:\s*mcp-memtrace/)
    assert.match(body, /name:\s*'@deepseek-ai\/dsh-mcp-client'/)
    assert.match(body, /serverName:\s*memtrace/)
    assert.match(body, /transport:\s*stdio/)
    assert.match(body, /perWorkingDirectory:\s*true/)
    assert.doesNotMatch(body, /^\s*cwd:/m)
    assert.doesNotMatch(body, /args:\s*!!js/)
    assert.match(body, /command:\s*!!js process\.env\.MEMTRACE_BIN \|\| 'memtrace'/)
    assert.doesNotMatch(body, /--workspace/)
    assert.doesNotMatch(body, /workspace create/)
  })

  it('declares the DSH 0.2 compatibility contract: engines.dsh mirrors the peer range', () => {
    const manifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'))
    assert.equal(manifest.dsh.manifestVersion, 1)
    assert.equal(typeof manifest.engines.dsh, 'string')
    assert.equal(manifest.engines.dsh, manifest.peerDependencies['@deepseek-ai/dsh'])
    assert.match(manifest.engines.dsh, /^>=0\.1\.0-rc\.6 <0\.3\.0-0$/)
    assert.equal(manifest.icon, './assets/icon.svg')
    assert.ok(existsSync(join(packageRoot, manifest.icon)), 'declared icon must ship in the package')
  })
})
