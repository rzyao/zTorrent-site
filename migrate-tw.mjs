import fs from 'node:fs';
import path from 'node:path';

// --- 配置区 ---
const TARGET_DIRS = ['src']; // 需要扫描的目录
const FILE_EXTS = ['.html', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']; // 匹配的文件后缀

const REPLACEMENTS = [
  // 1. Aspect Ratio: aspect-[2/3] -> aspect-2/3
  {
    pattern: /aspect-\[(\d+)\/(\d+)\]/g,
    replacement: 'aspect-$1/$2'
  },
  // 2. Linear Gradient: bg-gradient-to-t -> bg-linear-to-t
  {
    pattern: /bg-gradient-to-([a-z]+)/g,
    replacement: 'bg-linear-to-$1'
  },
  // 3. Flex Shrink: flex-shrink(-0) -> shrink(-0)
  {
    pattern: /flex-shrink(-0|-1|)?(?=\s|"|'|`)/g,
    replacement: (match, p1) => `shrink${p1 || ''}`
  },
  // 4. Flex Grow: flex-grow(-0) -> grow(-0)
  {
    pattern: /flex-grow(-0|-1|)?(?=\s|"|'|`)/g,
    replacement: (match, p1) => `grow${p1 || ''}`
  },
  // 5. Z Index: z-[1000] -> z-1000
  {
    pattern: /z-\[(\d+)\]/g,
    replacement: 'z-$1'
  }
];

// --- 核心逻辑 ---
function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory() && file !== 'node_modules' && file !== '.git') {
      walk(filepath, callback);
    } else if (stats.isFile() && FILE_EXTS.includes(path.extname(filepath))) {
      callback(filepath);
    }
  });
}

console.log('🚀 开始扫描并修复 Tailwind CSS v4 类名...');

let modifiedCount = 0;

TARGET_DIRS.forEach(dir => {
  const absoluteDir = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(absoluteDir)) return;

  walk(absoluteDir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanged = false;

    REPLACEMENTS.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已修复: ${path.relative(process.cwd(), filePath)}`);
      modifiedCount++;
    }
  });
});

console.log(`\n✨ 完成！共修改了 ${modifiedCount} 个文件。`);