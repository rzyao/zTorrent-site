import fs from 'fs'
import path from 'path'

/**
 * 最小回归校验脚本
 * - 目的：验证关键新端点是否已在代码中出现（并以 POST 方法声明）
 * - 说明：静态扫描文件内容，非运行时调用；用于快速回归检查
 */
const projectRoot = process.cwd()
const scanDirs = [path.join(projectRoot, 'src')]

const targets = [
  '/playlists/admin/list',
  '/playlists/list',
  '/users/preferences/detail',
  '/users/preferences/update',
  '/movies/torrents/bind',
  '/movies/torrents/unbind',
  '/tickets/resolved/confirm',
  '/tickets/resolved/mark',
  '/tickets/todos/list',
  '/music/playlists/public/list',
  '/music/playlists/songs/add',
  '/music/playlists/songs/remove',
  '/music/songs/lyrics/detail',
  '/messages/read/mark',
  '/messages/notifications/read/mark',
  '/announcements/read/mark',
  '/api/torrents/options/list',
  '/playlists/items/list',
  '/recommendations/index/get',
  '/recommendations/content/get',
  '/recommendations/tabs/create',
  '/recommendations/tabs/update',
  '/recommendations/tabs/delete',
  '/recommendations/tabs/admin/list',
  '/recommendations/tabs/active/list',
  '/recommendations/configs/create',
  '/recommendations/configs/update',
  '/recommendations/configs/delete',
  '/recommendations/configs/admin/list',
]

const exts = new Set(['.ts', '.tsx', '.js', '.jsx'])

type Hit = { file: string; line: number; endpoint: string; hasPost: boolean }
const hits: Hit[] = []

function walk(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const abs = path.join(dir, e.name)
    if (e.isDirectory()) {
      walk(abs)
      continue
    }
    if (!exts.has(path.extname(e.name))) continue
    let text = ''
    try {
      text = fs.readFileSync(abs, 'utf-8')
    } catch {
      continue
    }
    const lines = text.split(/\r?\n/)
    lines.forEach((line, i) => {
      targets.forEach((ep) => {
        if (line.includes(ep)) {
          const hasPost =
            line.includes(`method: 'POST'`) ||
            (lines[i - 1]?.includes(`method: 'POST'`) ?? false) ||
            (lines[i + 1]?.includes(`method: 'POST'`) ?? false)
          hits.push({ file: abs, line: i + 1, endpoint: ep, hasPost })
        }
      })
    })
  }
}

scanDirs.forEach((d) => fs.existsSync(d) && walk(d))

// 计算覆盖情况
const covered = new Set(hits.map((h) => h.endpoint))
const missing = targets.filter((t) => !covered.has(t))
const nonPost = hits.filter((h) => !h.hasPost)

if (missing.length || nonPost.length) {
  if (missing.length) {
    console.error('未命中新端点：')
    missing.forEach((m) => console.error(`- ${m}`))
  }
  if (nonPost.length) {
    console.error('发现非 POST 声明的端点：')
    nonPost.forEach((h) =>
      console.error(
        `- ${path.relative(projectRoot, h.file)}:${h.line} ${h.endpoint} 附近未检测到 method: 'POST'`,
      ),
    )
  }
  process.exit(1)
} else {
  console.log(`校验通过：${targets.length} 个关键端点均已出现且声明为 POST`)
}

