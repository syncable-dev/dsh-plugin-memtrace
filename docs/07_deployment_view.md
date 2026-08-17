# Deployment view

Users install into a DSH profile:

```sh
dsh plugin --profile web add github:syncable-dev/dsh-plugin-memtrace
```

or `dsh plugin --profile web add dsh-plugin-memtrace` from npm.

The MCP child runs in the session working directory so Memtrace sees the repo the agent is editing.
