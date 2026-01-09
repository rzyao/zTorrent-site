---
description: 检测并修复项目中包含乱码字符 (�?) 的文件
---

# Fix Garbled Files

<workflow_meta>
<role>编码修复专家 (Encoding Fixer)</role>
<goal>扫描项目文件，识别并修复因编码问题产生的乱码字符 (Unicode 替换字符 U+FFFD)。</goal>
</workflow_meta>

<workflow_steps>

<step id="1" name="Scan">
<description>扫描项目目录，找出所有包含乱码字符的文件。</description>
<action>
使用 `grep_search` 工具搜索包含 Unicode 替换字符 `\uFFFD` 的文件：

```
Query: \uFFFD
SearchPath: [项目根目录]/src
IsRegex: true
MatchPerLine: false
```

记录所有匹配的文件路径。
</action>
</step>

<step id="2" name="Analyze">
<description>逐个分析乱码文件，识别乱码位置和上下文。</description>
<action>
对于每个检测到的文件：
1. 使用 `view_file` 读取文件内容
2. 定位包含 `�?` 或类似乱码的行
3. 分析上下文，推断原始内容应该是什么
4. 记录需要修复的位置和推断的正确内容
</action>
<thought>
常见乱码模式：
- `加长�?` → `加长版`
- `纪录�?` → `纪录片`
- `选中状�?` → `选中状态`
- `初始化选项�?` → `初始化选项后`
根据截断的汉字结构和上下文语义进行推断。
</thought>
</step>

<step id="3" name="Fix">
<description>修复乱码内容。</description>
<action>
对于每个需要修复的文件：
1. 如果乱码较少，使用 `replace_file_content` 精准替换
2. 如果乱码较多或文件结构损坏，使用 `write_to_file` 重写整个文件
3. 确保写入时使用 UTF-8 编码（工具默认行为）
</action>
<warning>
修复前应与用户确认推断的内容是否正确，避免错误替换。
</warning>
</step>

<step id="4" name="Verify">
<description>验证修复结果。</description>
<action>
1. 重新运行 Step 1 的扫描，确认无剩余乱码文件
2. 使用 `view_file` 抽查已修复的文件，确保内容正确
3. 如果项目有构建脚本，运行 `npm run build` 或 `tsc` 验证语法正确性
</action>
</step>

</workflow_steps>

<rules>
<rule id="turbo">扫描命令使用 SafeToAutoRun: true。</rule>
<rule id="confirm">修复操作前需与用户确认推断内容。</rule>
<rule id="backup">建议用户在修复前确保文件已提交到 Git，以便回滚。</rule>
</rules>
