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
    // The 0.2.x patch composer mangles evaluated !!js values that return
    // arrays (args became {"[object Object]": [...]}), so the row keeps every
    // value literal and anchors on the static `dsh` workspace name instead.
    // Comment lines are ignored.
    assert.doesNotMatch(patch.replace(/^#.*$/gm, ''), /!!js/)
    // The child anchors on the dsh Named Workspace so it can take the
    // workspace-owner lease and self-start the MemDB sidecar.
    assert.match(patch, /-\s*'--workspace'\n\s*-\s*dsh/)
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
