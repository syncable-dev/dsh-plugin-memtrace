# Architecture constraints

- DeepSeek Harness plugin contract: `package.json` → `dsh.bundle.patch` → `cordis.patch.yml`.
- Skills are Agent Skills `SKILL.md` bundles with kebab-case names.
- Official `@deepseek-ai/*` packages are peer dependencies, never bundled.
- DSH compatibility declared via `engines.dsh` `>=0.1.0-rc.6 <0.3.0-0` (decides on DSH `0.2.1-alpha.3+`); the `@deepseek-ai/dsh` peer range mirrors it for older DSH.
- Patch rows must not overwrite another plugin's `config` (no deep merge).
- Bundle patch config stays literal: the 0.2.x patch composer mangles evaluated `!!js` values that return arrays (the mcp-memtrace row is static for this reason).
- MCP child store identity: `memtrace mcp` anchors on its working directory and opens the repo's own `.memdb` (per project); per-session keying of MCP children by workspace is a pending host-side change — until then a restated row's `cwd` sets the project. No shared named-workspace store; memtrace refuses cross-store indexing.
- Node `>=22.19` (plugin floor; Harness `0.2.x` hosts themselves require `>=24.9`).
