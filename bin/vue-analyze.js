#!/usr/bin/env node

import path from 'path'
import { fileURLToPath } from 'url'
import { Command } from 'commander'
import fs from 'fs-extra'
import { analyzeProject } from '../dist/analyzer.js'
import { generateHtmlReport } from '../dist/generateHtmlReport.js'

// 获取当前文件路径 (ES模块替代__dirname)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 默认JSON报告存储目录
const DEFAULT_JSON_DIR = path.resolve(__dirname, '../ast-json')

// 生成带时间戳的文件名
// function getFileNameWithTimestamp(filePath) {
//   const dir = path.dirname(filePath)
//   const ext = path.extname(filePath)
//   const base = path.basename(filePath, ext)
//   const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19)
//   return path.join(dir, `${base}-${timestamp}${ext}`)
// }

// 如果文件已存在，则直接删除
function ensureUniqueFileName(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
  return filePath
}

const DEFAULT_JSON_FILE = path.join(DEFAULT_JSON_DIR, 'vue-analysis-report.json')

const program = new Command()

program
  .name('vue-analyze')
  .description('Vue 3 AST 分析 CLI 工具')
  .option('-p, --project <path>', 'Vue 项目路径', './src')
  .option('-o, --output <path>', 'HTML 报告输出路径', './vue-analysis-report.html')
  .option('-j, --json <path>', 'JSON 报告输出路径', DEFAULT_JSON_FILE)
  .parse(process.argv)

const options = program.opts()
const projectPath = path.resolve(process.cwd(), options.project)
const outputHtmlPath = path.resolve(process.cwd(), options.output)
const outputJsonPath = path.resolve(process.cwd(), options.json)

if (!fs.existsSync(projectPath)) {
  console.error(`指定路径不存在: ${projectPath}`)
  process.exit(1)
}

console.log(`开始分析项目: ${projectPath}`)
const report = analyzeProject(projectPath)

// 生成 HTML 报告
const finalHtmlPath = ensureUniqueFileName(outputHtmlPath)
generateHtmlReport(report, finalHtmlPath)
console.log(`分析完成，HTML 报告生成: ${finalHtmlPath}`)

// 同时生成 JSON 报告
// 确保JSON输出目录存在
const jsonOutputDir = path.dirname(outputJsonPath)
if (!fs.existsSync(jsonOutputDir)) {
  fs.mkdirSync(jsonOutputDir, { recursive: true })
}
const finalJsonPath = ensureUniqueFileName(outputJsonPath)
fs.writeFileSync(finalJsonPath, JSON.stringify(report, null, 2), 'utf-8')
console.log(`JSON 报告生成: ${finalJsonPath}`)
