import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApply } from './lib/register-skills.js'

export const name = 'dsh-plugin-memtrace'
export const inject = ['skills']

const packageRoot = dirname(fileURLToPath(import.meta.url))

export const apply = createApply(packageRoot)
