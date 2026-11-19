import { loadSkillsFrom } from './load-skills.js'
import { DSH_WORKSPACE_NAME, ensureWorkspace } from './ensure-workspace.js'

export function createApply(packageRoot, dependencies = {}) {
  const ensure = dependencies.ensureWorkspace ?? ensureWorkspace
  return function apply(ctx) {
    const skills = loadSkillsFrom(packageRoot)
    ctx.effect(() => {
      const disposers = skills.map((skill) =>
        ctx.skills.register({
          name: skill.name,
          description: skill.description,
          content: skill.body,
          source: 'bundled',
          path: skill.path,
          resourceBase: { kind: 'directory', path: packageRoot },
        }),
      )
      return () => {
        for (const dispose of disposers) dispose()
      }
    })
    // The MCP row anchors on the named workspace; make sure it exists so the
    // child can take the workspace-owner lease instead of exiting with no
    // scope. Async and non-fatal: reconnect retries cover the delay.
    void ensure(DSH_WORKSPACE_NAME, {
      env: process.env,
      log: (message) => {
        if (typeof ctx.logger?.warn === 'function') ctx.logger.warn(message)
        else console.warn(message)
      },
    })
  }
}
