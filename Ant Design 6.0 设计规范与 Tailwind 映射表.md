Ant Design 6.0 设计规范与 Tailwind 映射表1. 间距系统 (Spacing)AntD 遵循 8px 网格系统，而 Tailwind 的单位（1单位 = 4px）与之契合。AntD Token像素值Tailwind 类名典型用途marginXXS4pxm-1极小间距（如图标与文字）marginXS8pxm-2组件内部紧凑元素间距marginMD16pxm-4最常用的标准组件间距marginLG24pxm-6大容器内边距marginXL32pxm-8页面大区块间距2. 圆角系统 (Border Radius)AntD 6.0 默认圆角非常克制，旨在传达工业级严谨感。AntD Token像素值Tailwind 类名典型用途borderRadiusSM4pxrounded标签 (Tag)、小按钮borderRadius6pxrounded-[6px]标准按钮、输入框、卡片 (核心)borderRadiusLG8pxrounded-lg弹窗 (Modal)、卡片外框borderRadiusOuter10pxrounded-[10px]组合容器的外层包装3. 字号与行高 (Typography)AntD 的字号算法专注于阅读效率，标准阅读距离（50cm）下的最佳字号为 14px。AntD Token像素值Tailwind 类名角色fontSizeSM12pxtext-xs辅助文字、表单校验提示fontSize14pxtext-sm正文、按钮文字 (Base)fontSizeLG16pxtext-base内容区块标题fontSizeXL20pxtext-xl页面二级标题lineHeight1.5715leading-relaxed默认文本行高比例4. 色彩系统 (Color Palette)AntD 6.0 默认色彩依然维持了经典的专业感。类别AntD Token十六进制值Tailwind 配置主色colorPrimary#1677ffblue-600 (近似)成功色colorSuccess#52c41agreen-500错误色colorError#ff4d4fred-500警告色colorWarning#faad14amber-500边框色colorBorder#d9d9d9gray-300实战：在 tailwind.config.js 中完美复刻为了在项目中像使用原生类名一样调用 AntD 规范，建议在 Tailwind 配置文件中进行扩展。这样你可以写出 rounded-antd 或 text-antd 这样的类名。JavaScript/\*_ @type {import('tailwindcss').Config} _/
module.exports = {
theme: {
extend: {
spacing: {
'antd-xs': '8px',
'antd-md': '16px',
'antd-lg': '24px',
},
borderRadius: {
'antd-sm': '4px',
'antd': '6px', // AntD 核心圆角
'antd-lg': '8px',
},
fontSize: {
'antd': ['14px', '22px'], // [字号, 行高]
'antd-sm': ['12px', '20px'],
},
colors: {
'antd-primary': '#1677ff',
'antd-border': '#d9d9d9',
'antd-text': 'rgba(0, 0, 0, 0.88)',
},
boxShadow: {
'antd-low': '0 2px 8px rgba(0, 0, 0, 0.15)',
'antd-mid': '0 6px 16px 0 rgba(0, 0, 0, 0.08)',
}
},
},
}
2.0 时代的性能建议由于 Ant Design 6.0 默认开启了 Zero-runtime（零运行时）模式，你可以结合 Tailwind 获得极致的性能：减少重绘：使用 Tailwind 处理简单的布局和间距，只在需要复杂逻辑（如 Table/Tree）时调用 AntD 组件。样式层级：在 CSS 中使用 @layer 确保 Tailwind 的 Utilities 层级高于 AntD 的默认样式，从而方便覆盖。
