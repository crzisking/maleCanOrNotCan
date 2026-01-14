# 行不行（maleCanOrNotCan）
行不行
一个基于 **Electron + React + Vite + TypeScript + Tailwind CSS** 构建的桌面端应用，用于男性健康自测与结果分析。

---

## 一、项目简介

**maleCanOrNotCan** 是一个完全本地运行的桌面应用，用户可通过结构化问题进行自测，并即时获得结果反馈。  
项目强调隐私安全、轻量架构与可扩展性，适合个人使用或二次开发。

---

## 二、技术栈

- Electron（桌面容器）
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Node.js / npm

---

## 三、项目结构

```text
maleCanOrNotCan/
├── electron/
│   └── main.js              # Electron 主进程
├── public/
│   └── icon.png
├── index.html
├── index.tsx
├── index.css
├── metadata.json
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md
```

---

## 四、运行环境要求

- Node.js >= 18
- npm >= 9
- Windows / macOS（已验证）

---

## 五、安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发模式

```bash
npm run dev
```

### 3. 启动桌面应用

```bash
npm run electron
```

---

## 六、构建发布版本

```bash
npm run build
```

构建产物位于 `dist/` 目录，可用于桌面打包。

---

## 七、设计原则

- **隐私优先**：不接入后端、不上传数据
- **可维护性**：TypeScript + 组件化
- **可扩展性**：便于新增问卷、算法与模块

---

## 八、可扩展方向

- 问卷配置化（JSON/Schema）
- 本地历史记录存储
- IPC 通信增强
- 自动更新机制
- 多语言支持

---

## 九、免责声明

本项目仅用于健康评估参考，不构成任何医疗建议。如有健康问题，请咨询专业医生。

---

## 十、License

Apache License
