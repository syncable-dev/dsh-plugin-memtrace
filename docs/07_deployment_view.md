# Deployment view

Users install into a DSH profile:

```sh
dsh plugin --profile web add github:syncable-dev/dsh-plugin-memtrace
```

or `dsh plugin --profile web add dsh-plugin-memtrace` from npm.

Per-Session cwd needs a dsh-mcp-client with `perWorkingDirectory`; each tool call then runs in the Session's working directory so Memtrace sees the repo the agent is editing. A stock dsh needs the row restated with `cwd`.
