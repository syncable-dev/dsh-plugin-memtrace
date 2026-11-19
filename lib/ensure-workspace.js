import { spawn } from 'node:child_process'
import { memtraceOnPath, resolveMemtraceLaunch } from './resolve-memtrace-mcp.js'

/** The named workspace the DSH MCP row anchors on (keep in sync with cordis.patch.yml). */
export const DSH_WORKSPACE_NAME = 'dsh'

/** Build the argv for one `memtrace workspace <verb> <workspace>` call. */
export function workspaceLaunchArgs({ env, memtraceOnPath: onPath, workspace }, verb) {
  const launch = resolveMemtraceLaunch({ env, memtraceOnPath: onPath })
  return { command: launch.command, args: [...launch.args, 'workspace', verb, workspace] }
}

function defaultRun(launch) {
  return new Promise((resolve) => {
    const child = spawn(launch.command, launch.args, {
      stdio: 'ignore',
      env: process.env,
      shell: process.platform === 'win32',
    })
    child.on('error', (error) => resolve({ status: null, error }))
    child.on('exit', (status) => resolve({ status }))
  })
}

/**
 * Ensure the DSH named workspace exists so `memtrace mcp --workspace dsh`
 * resolves a scope and can take the workspace-owner lease (without it the
 * server exits 2 and every graph tool stays dead). Fire-and-forget safe:
 * every failure resolves with a diagnostic instead of rejecting.
 * @returns {Promise<{existed: boolean, error?: string}>}
 */
export async function ensureWorkspace(
  workspace = DSH_WORKSPACE_NAME,
  { env = process.env, memtraceOnPath: onPath = memtraceOnPath(), run = defaultRun, log = () => {} } = {},
) {
  const show = await run(workspaceLaunchArgs({ env, memtraceOnPath: onPath, workspace }, 'show'))
  if (show.status === 0) return { existed: true }
  const create = await run(workspaceLaunchArgs({ env, memtraceOnPath: onPath, workspace }, 'create'))
  if (create.status === 0) return { existed: false }
  const error = create.error === undefined ? `exit ${create.status}` : String(create.error.message ?? create.error)
  log(
    `dsh-plugin-memtrace: memtrace workspace create ${workspace} failed (${error});`
      + ` run \`memtrace workspace create ${workspace}\` once so the MCP row can start`,
  )
  return { existed: false, error }
}
