#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import Ajv from 'ajv'

const projectRoot = process.cwd()
const yamlPath = path.join(projectRoot, 'config', 'permissions.yaml')
const genFile = path.join(projectRoot, 'src', 'permissions', 'permissions.gen.ts')

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

function readYaml(file) {
  const text = fs.readFileSync(file, 'utf-8')
  return yaml.parse(text)
}

function collectCodes(doc) {
  const codes = new Set()
  const duplicates = []
  const walk = (nodes) => {
    for (const n of nodes || []) {
      if (n.code) {
        if (codes.has(n.code)) duplicates.push(n.code)
        codes.add(n.code)
      }
      if (n.actions) for (const a of n.actions) {
        if (codes.has(a.code)) duplicates.push(a.code)
        codes.add(a.code)
      }
      if (n.children) walk(n.children)
    }
  }
  walk(doc)
  return { codes: Array.from(codes), duplicates }
}

try {
  const doc = readYaml(yamlPath)
  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(buildSchema())
  if (!validate(doc)) {
    console.error('YAML 结构校验失败:', validate.errors)
    process.exit(1)
  }
  const { duplicates } = collectCodes(doc)
  if (duplicates.length) {
    console.error('权限 code 重复:', duplicates)
    process.exit(1)
  }
  if (!fs.existsSync(genFile)) {
    console.error('未找到生成文件:', path.relative(projectRoot, genFile))
    process.exit(1)
  }
  console.log('permissions.yaml 与生成文件校验通过')
  process.exit(0)
} catch (err) {
  console.error('测试失败:', err?.stack || err)
  process.exit(1)
}

