# Building block view

C4 Level 2 — deployables inside this bundle.

```mermaid
C4Container
    title Container diagram — dsh-plugin-memtrace
    Container(skills, "Skill registrar", "index.js", "Registers every bundled SKILL.md on ctx.skills")
    Container(patch, "Bundle patch", "cordis.patch.yml", "Inserts skill row + MCP client row")
    Container_Ext(mcpClient, "dsh-mcp-client", "Official DSH plugin", "Discovers tools as mcp__memtrace__*")
    Container_Ext(server, "memtrace mcp", "stdio", "Graph tools")
    Rel(patch, skills, "loads", "Cordis row")
    Rel(patch, mcpClient, "loads", "Cordis row")
    Rel(mcpClient, server, "spawns", "stdio")
```

C4 Level 3 — folders in this package, matching screaming architecture:

| Folder | Responsibility |
| --- | --- |
| `lib/` | Skill parse/load, Cordis apply factory |
| `skills/` | One Memtrace workflow per directory |
| `references/` | Shared MCP parameter spec for skill bodies |
| `assets/` | Icon, hero, social preview |
| `docs/` | arc42 |
| `test/` | Fast node:test suite |
