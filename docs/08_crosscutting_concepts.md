# Cross-cutting concepts

- **Effects:** every `ctx.skills.register` disposer is returned from `ctx.effect`.
- **Config isolation:** this bundle never patches another plugin's `config` keys.
- **Tool naming:** public names are `mcp__memtrace__<raw>` from the official client.
- **Errors:** invalid SKILL.md fails the load loudly during apply.
