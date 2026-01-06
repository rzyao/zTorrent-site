/** @type {import('tailwindcss').Config} */
export default {
  // 仅应用于 admin 目录下的组件
  content: [
    "./src/pages/Admin/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/AdminLayout/**/*.{js,ts,jsx,tsx}", // 如果有专用的 admin layout
  ],
  theme: {
    extend: {
      // --- 1. 间距系统 (Spacing) ---
      // 这里的逻辑：antd-md 刚好对应 antd 的 marginMD (16px)
      spacing: {
        "antd-xs": "4px",   // marginXXS
        "antd-sm": "8px",   // marginXS
        "antd-md": "16px",  // marginMD
        "antd-lg": "24px",  // marginLG
        "antd-xl": "32px",  // marginXL
      },

      // --- 2. 圆角系统 (Border Radius) ---
      borderRadius: {
        "antd-sm": "2px",      // borderRadiusSM
        "antd": "6px",         // borderRadius (默认)
        "antd-lg": "8px",      // borderRadiusLG
        "antd-outer": "10px",  // borderRadiusOuter
      },

      // --- 3. 字号与行高 (Typography) ---
      fontSize: {
        "antd-sm": ["12px", "20px"], // [fontSizeSM, lineHeightSM]
        "antd": ["14px", "22px"],    // [fontSize, lineHeight]
        "antd-lg": ["16px", "24px"], // [fontSizeLG, lineHeightLG]
        "antd-xl": ["20px", "28px"], // [fontSizeXL, lineHeightXL]
      },

      // --- 4. 颜色系统 (Colors) ---
      // 深度复刻 Ant Design 6.0 的色彩体系
      colors: {
        // 主色调
        "antd-primary": {
          DEFAULT: "#1677ff",
          hover: "#4096ff",
          active: "#0958d9",
          text: "#1677ff",
          border: "#91caff",
          "bg-hover": "#e6f4ff",
        },
        // 语义色
        "antd-success": "#52c41a",
        "antd-warning": "#faad14",
        "antd-error": "#ff4d4f",
        // 边框色
        "antd-border": {
          DEFAULT: "#d9d9d9",
          secondary: "rgba(0, 0, 0, 0.06)",
        },
        // 文本色
        "antd-text": {
          DEFAULT: "rgba(0, 0, 0, 0.88)",
          description: "rgba(0, 0, 0, 0.45)",
          placeholder: "rgba(0, 0, 0, 0.25)",
          disabled: "rgba(0, 0, 0, 0.25)",
        },
        // 背景色
        "antd-bg": {
          container: "#ffffff",
          layout: "#f5f5f5",
          spotlight: "rgba(0, 0, 0, 0.85)",
          mask: "rgba(0, 0, 0, 0.45)",
        },
      },

      // --- 5. 阴影系统 (Box Shadow) ---
      boxShadow: {
        "antd-low": "0 2px 8px rgba(0, 0, 0, 0.15)",
        "antd-mid": "0 6px 16px rgba(0, 0, 0, 0.08)",
        "antd-high": "0 9px 28px 8px rgba(0, 0, 0, 0.05), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12)",
      },

      // --- 6. 堆叠层级 (Z-Index) ---
      zIndex: {
        "antd-popup": "1000",
        "antd-modal": "1010",
        "antd-message": "1010",
      },

      // --- 7. 高度规范 (Height) ---
      height: {
        "antd-control-sm": "24px",
        "antd-control": "32px",
        "antd-control-lg": "40px",
      }
    },
  },
  plugins: [],
};
