import fs from 'fs'
import path from 'path'

/**
 * 旧接口守卫脚本
 * - 从《变更记录.md》提取“旧 → 新”接口映射
 * - 扫描仓库中的代码与文档，若发现仍存在“旧接口”字符串则退出并给出替换建议
 * - 目的：防止旧路径再次被引入，保证接口统一与一致性
 */
;(async function main() {
  const projectRoot = process.cwd()
  const changeLogPath = path.join(projectRoot, '变更记录.md')
  const scanDirs = [
    path.join(projectRoot, 'src'),
    path.join(projectRoot, 'docs'),
  ]

  /**
   * 读取变更记录，解析出旧→新映射
   * 格式示例：- 旧: `POST /playlists/list-playlists` → 新: `POST /playlists/list`
   */
  const content = fs.readFileSync(changeLogPath, 'utf-8')
  const lines = content.split(/\r?\n/)
  const mappings: Array<{ old: string; nu: string }> = []
  const lineRe =
    /旧:\s*`(?:GET|POST|PUT|DELETE)\s+([^`]+)`\s*→\s*新:\s*`(?:GET|POST|PUT|DELETE)\s+([^`]+)`/i
  for (const line of lines) {
    const m = lineRe.exec(line)
    if (m) {
      mappings.push({ old: m[1].trim(), nu: m[2].trim() })
    }
  }
  if (!mappings.length) {
    console.log('未在《变更记录.md》解析到任何旧→新接口映射，跳过守卫')
    process.exit(0)
  }

  /**
   * 扫描指定目录，查找旧接口字符串残留
   * - 跳过变更记录文件自身
   * - 仅检查文本文件（简单按扩展名白名单过滤）
   */
  const exts = new Set([
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.md',
    '.json',
    '.yaml',
    '.yml',
    '.txt',
  ])
  const offenders: Array<{
    file: string
    line: number
    snippet: string
    matchedOld: string
    suggestion: string
  }> = []

  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      const abs = path.join(dir, e.name)
      if (e.isDirectory()) {
        walk(abs)
        continue
      }
      const ext = path.extname(e.name)
      if (!exts.has(ext)) continue
      if (abs.endsWith('变更记录.md')) continue
      let text: string
      try {
        text = fs.readFileSync(abs, 'utf-8')
      } catch {
        continue
      }
      const lines = text.split(/\r?\n/)
      mappings.forEach((mp) => {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          const idx = line.indexOf(mp.old)
          if (idx >= 0) {
            const nextChar = line[idx + mp.old.length]
            // 旧路径命中但紧跟着 '/' 的情况大概率是“新路径的前缀”（如 /downloaders/categories/list），需忽略
            if (nextChar === '/') continue
            offenders.push({
              file: abs,
              line: i + 1,
              snippet: line.trim(),
              matchedOld: mp.old,
              suggestion: mp.nu,
            })
          }
        }
      })
    }
  }
  for (const d of scanDirs) {
    if (fs.existsSync(d)) walk(d)
  }

  if (offenders.length) {
    console.error('检测到旧接口残留：')
    offenders.forEach((o) => {
      console.error(
        `- ${path.relative(projectRoot, o.file)}:${o.line} 命中旧路径 "${o.matchedOld}"，建议替换为 "${o.suggestion}"\n  片段：${o.snippet}`,
      )
    })
    process.exit(1)
  } else {
    console.log('守卫通过：未发现旧接口残留')
  }
})()
