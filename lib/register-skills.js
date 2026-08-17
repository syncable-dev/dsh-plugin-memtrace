import { loadSkillsFrom } from './load-skills.js'

export function createApply(packageRoot) {
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
  }
}
