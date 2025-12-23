# vue-analyze-cli

Vue 3 AST 分析 CLI 工具，用于分析 Vue 项目中的组件结构并生成可视化报告。

## 功能特性

- 📊 分析 Vue 组件模板中的插值表达式、v-for 和 v-if 指令
- 📋 生成详细的 HTML 报告，可视化展示分析结果
- ⚡ 快速扫描整个项目目录
- 🎯 支持自定义项目路径和输出路径

## 安装

### 全局安装

```bash
npm install -g vue-analyze-cli
```

### 本地安装

```bash
npm install --save-dev vue-analyze-cli
```

## 使用

### 基本用法

```bash
vue-analyze
```

默认分析当前目录下的 `src` 文件夹，并在当前目录生成 `vue-analysis-report.html` 报告文件。

### 自定义路径

```bash
vue-analyze -p ./my-vue-project -o ./my-report.html
```

### 命令行选项

```
Options:
  -p, --project <path>  Vue 项目路径 (默认: "./src")
  -o, --output <path>   报告输出路径 (默认: "./vue-analysis-report.html")
  -h, --help            显示帮助信息
  -V, --version         显示版本信息
```

## 项目结构

```
vue-analyze-cli/
├── bin/
│   ├── vue-analyze.js      # CLI 入口文件
│   └── vue-analyze.ts      # CLI 入口文件 (TypeScript 源文件)
├── src/
│   ├── analyzer.js         # JavaScript 编译输出
│   └── analyzer.ts         # TypeScript 源文件
├── dist/                   # TypeScript 编译输出目录
├── package.json
├── tsconfig.json
└── README.md
```

## 开发

### 克隆项目

```bash
git clone <repository-url>
cd vue-analyze-cli
```

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

### 开发模式

```bash
npm run dev
```

### 运行测试

```bash
node bin/vue-analyze.js -p ./src -o ./report.html
```

## 依赖

- [@vue/compiler-dom](https://www.npmjs.com/package/@vue/compiler-dom) - Vue 3 DOM 编译器
- [@vue/compiler-sfc](https://www.npmjs.com/package/@vue/compiler-sfc) - Vue 3 单文件组件编译器
- [commander](https://www.npmjs.com/package/commander) - 命令行参数解析库
- [fs-extra](https://www.npmjs.com/package/fs-extra) - 文件系统操作增强库
- [glob](https://www.npmjs.com/package/glob) - 文件匹配模式库

## 开发依赖

- [typescript](https://www.npmjs.com/package/typescript) - TypeScript 编译器
- [@types/node](https://www.npmjs.com/package/@types/node) - Node.js 类型定义
- [@types/fs-extra](https://www.npmjs.com/package/@types/fs-extra) - fs-extra 类型定义
- [@types/glob](https://www.npmjs.com/package/@types/glob) - glob 类型定义

## 许可证

MIT
