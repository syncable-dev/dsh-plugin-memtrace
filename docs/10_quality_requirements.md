# Quality requirements

- Skill parse/load/apply unit tests run in under two seconds on `node --test`.
- Every bundled `SKILL.md` parses to a kebab-case name and a description.
- `package.json` always carries `dsh.bundle.patch`.
- Git install needs no `prepare` / `allowBuilds` step.
