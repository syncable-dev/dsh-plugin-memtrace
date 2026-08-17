#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const pluginRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const repoRoot = dirname(pluginRoot)
const skillsSource = join(repoRoot, 'installer', 'plugins', 'memtrace-skills', 'skills')
const referencesSource = join(
  repoRoot,
  'installer',
  'plugins',
  'memtrace-skills',
  'references',
)
const skillsDest = join(pluginRoot, 'skills')
const referencesDest = join(pluginRoot, 'references')

if (!existsSync(skillsSource)) {
  throw new Error(`Memtrace skills not found at ${skillsSource}`)
}

rmSync(skillsDest, { recursive: true, force: true })
rmSync(referencesDest, { recursive: true, force: true })
mkdirSync(pluginRoot, { recursive: true })
cpSync(skillsSource, skillsDest, { recursive: true })
if (existsSync(referencesSource)) {
  cpSync(referencesSource, referencesDest, { recursive: true })
}

console.log(`synced skills from ${skillsSource}`)
