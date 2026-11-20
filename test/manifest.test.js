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
    assert.match(patch, /id:\s*dsh-plugin-memtrace/)
    assert.match(patch, /name:\s*dsh-plugin-memtrace/)
    assert.match(patch, /id:\s*mcp-memtrace/)
    assert.match(patch, /name:\s*'@deepseek-ai\/dsh-mcp-client'/)
    assert.match(patch, /serverName:\s*memtrace/)
    assert.match(patch, /transport:\s*stdio/)
    // Per-session working directory: the client starts one child in cwd for
    // tool discovery, then routes each call to a child in the Session's
    // directory. A static row-level cwd is not used (comments are ignored).
    assert.match(patch, /perWorkingDirectory:\s*true/)
    assert.doesNotMatch(patch.replace(/^#.*$/gm, ''), /^\s*cwd:/m)
    // The 0.2.x patch composer mangles evaluated !!js values that return
    // arrays (args became {"[object Object]": [...]}), so args stays literal
    // while the command may evaluate a scalar. Comment lines are ignored.
    assert.doesNotMatch(patch.replace(/^#.*$/gm, ''), /args:\s*!!js/)
    // Per-project model: pinned command, no workspace flag — the host keys
    // MCP children per Session working directory via perWorkingDirectory;
    // a restated row's cwd is the stock-dsh fallback.
    assert.match(patch, /command:\s*!!js process\.env\.MEMTRACE_BIN \|\| 'memtrace'/)
    assert.doesNotMatch(patch.replace(/^#.*$/gm, ''), /--workspace/)
    assert.doesNotMatch(patch, /workspace create/)
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
