const FRONTMATTER = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
const KEBAB_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function parseSkillMarkdown(raw) {
  const match = raw.match(FRONTMATTER)
  if (!match) {
    throw new Error('skill markdown is missing YAML frontmatter')
  }

  const meta = match[1]
  const body = match[2].replace(/^\n+/, '')
  const name = unwrapQuotes(scalarField(meta, 'name'))
  const description = unwrapQuotes(scalarField(meta, 'description'))

  if (!name || !KEBAB_NAME.test(name)) {
    throw new Error(`skill name must be kebab-case, got ${JSON.stringify(name)}`)
  }
  if (!description) {
    throw new Error(`skill ${name} is missing a description`)
  }

  return { name, description, body }
}

function scalarField(meta, key) {
  const pattern = new RegExp(`^${key}:\\s*(.+)$`, 'm')
  const match = pattern.exec(meta)
  return match?.[1]?.trim()
}

function unwrapQuotes(value) {
  if (!value) return value
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }
  return value
}
