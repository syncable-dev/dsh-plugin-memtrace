# Architecture constraints

- DeepSeek Harness plugin contract: `package.json` → `dsh.bundle.patch` → `cordis.patch.yml`.
- Skills are Agent Skills `SKILL.md` bundles with kebab-case names.
- Official `@deepseek-ai/*` packages are peer dependencies, never bundled.
- Patch rows must not overwrite another plugin's `config` (no deep merge).
- Node `^22.19 || >=24` (Harness runtime).
