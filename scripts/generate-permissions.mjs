#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'yaml'
import Ajv from 'ajv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const yamlPath = path.join(projectRoot, 'config', 'permissions.yaml')
const outDir = path.join(projectRoot, 'src', 'permissions')
const outFile = path.join(outDir, 'permissions.gen.ts')

function readYaml(file) {
  const text = fs.readFileSync(file, 'utf-8')
  return yaml.parse(text)
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function buildSchema() {
  return {
    type: 'array',
    items: {
      type: 'object',
      required: ['name', 'code', 'type'],
      properties: {
        name: { type: 'string', minLength: 1 },
        code: { type: 'string', pattern: '^[a-z][a-z0-9:-]*$' },
        type: { type: 'string', enum: ['menu', 'page', 'action'] },
        description: { type: 'string' },
        roles: { type: 'array', items: { type: 'string' } },
        api: { type: 'string', pattern: '^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\\s+\/.*$' },
        actions: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'code'],
            properties: {
              name: { type: 'string', minLength: 1 },
              code: { type: 'string', pattern: '^[a-z][a-z0-9:-]*$' },
              api: { type: 'string', pattern: '^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\\s+\/.*$' },
              description: { type: 'string' }
            }
          }
        },
        children: { $ref: '#' }
      }
    }
  }
}

function validateStructure(doc) {
  const ajv = new Ajv({ allErrors: true })
  const schema = buildSchema()
  const validate = ajv.compile(schema)
  const ok = validate(doc)
  if (!ok) {
    const errors = (validate.errors || []).map(e => `${e.instancePath || '/'} ${e.message}`)
    throw new Error('permissions.yaml 结构校验失败:\n' + errors.join('\n'))
  }
}

function walk(nodes, cb) {
  for (const n of nodes || []) {
    cb(n)
    if (n.actions) for (const a of n.actions) cb({ ...a, type: 'action' })
    if (n.children) walk(n.children, cb)
  }
}

function collectCodes(doc) {
  const codes = new Set()
  const duplicates = []
  walk(doc, node => {
    const code = node.code
    if (!code) return
    if (codes.has(code)) duplicates.push(code)
    codes.add(code)
  })
  if (duplicates.length) {
    throw new Error('发现重复的权限 code: ' + duplicates.join(', '))
  }
  return Array.from(codes)
}

function safeKey(segment) {
  return segment.replace(/[^a-zA-Z0-9_]/g, '_')
}

function buildNestedObject(codes) {
  const root = {}
  for (const code of codes) {
    const parts = code.split(':')
    let curr = root
    for (let i = 0; i < parts.length; i++) {
      const key = safeKey(parts[i])
      const isLast = i === parts.length - 1
      if (isLast) {
        const existing = curr[key]
        if (existing && typeof existing === 'object') {
          existing._ = code
          curr[key] = existing
        } else {
          curr[key] = code
        }
      } else {
        const existing = curr[key]
        if (!existing) {
          curr[key] = {}
        } else if (typeof existing === 'string') {
          curr[key] = { _: existing }
        }
        curr = curr[key]
      }
    }
  }
  return root
}

function generateTs(codes, nested) {
  const header = `/*
  自动生成：请勿手工修改
  来源：config/permissions.yaml
*/\n`
  const union = `export type PermissionCode = ${codes.map(c => `'${c}'`).join(' | ')}\n`
  const allList = `export const ALL_PERMISSION_CODES: PermissionCode[] = [${codes.map(c => `'${c}'`).join(', ')}]\n`
  const perms = `export const PERMS = ${JSON.stringify(nested, null, 2)} as const\n`
  return header + union + allList + perms
}

function main() {
  const doc = readYaml(yamlPath)
  if (!Array.isArray(doc)) {
    throw new Error('permissions.yaml 顶层必须为数组')
  }
  validateStructure(doc)
  const codes = collectCodes(doc)
  const nested = buildNestedObject(codes)
  ensureDir(outDir)
  const ts = generateTs(codes, nested)
  fs.writeFileSync(outFile, ts, 'utf-8')
  console.log(`[permissions] 生成完成: ${path.relative(projectRoot, outFile)} (${codes.length} 项)`) 

}

try {
  main()
} catch (err) {
  console.error('[permissions] 生成失败:\n' + (err?.stack || err))
  process.exit(1)
}
