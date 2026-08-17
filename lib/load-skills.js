import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { parseSkillMarkdown } from './parse-skill.js'

export function loadSkillsFrom(packageRoot) {
  const skillsRoot = join(packageRoot, 'skills')
  if (!existsSync(skillsRoot)) return []

  const skills = []
  for (const entry of readdirSync(skillsRoot)) {
    const directory = join(skillsRoot, entry)
    if (!statSync(directory).isDirectory()) continue
    const skillPath = join(directory, 'SKILL.md')
    if (!existsSync(skillPath)) continue

    const parsed = parseSkillMarkdown(readFileSync(skillPath, 'utf8'))
    skills.push({
      ...parsed,
      path: skillPath,
      directory,
      resourceDirectory: directory,
    })
  }

  return skills.sort((left, right) => left.name.localeCompare(right.name))
}
