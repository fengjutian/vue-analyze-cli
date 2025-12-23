#!/usr/bin/env node

import path from 'path'
import { Command } from 'commander'
import fs from 'fs-extra'
import { analyzeProject, generateHtmlReport } from '../dist/analyzer.js'

const program = new Command()

program
  .name('vue-analyze')
  .description('Vue 3 AST 分析 CLI 工具')
  .option('-p, --project <path>', 'Vue 项目路径', './src')
  .option('-o, --output <path>', '报告输出路径', './vue-analysis-report.html')
  .parse(process.argv)

const options = program.opts()
const projectPath = path.resolve(process.cwd(), options.project)
const outputPath = path.resolve(process.cwd(), options.output)

if (!fs.existsSync(projectPath)) {
  console.error(`指定路径不存在: ${projectPath}`)
  process.exit(1)
}

console.log(`开始分析项目: ${projectPath}`)
const report = analyzeProject(projectPath)
generateHtmlReport(report, outputPath)
console.log(`分析完成，HTML 报告生成: ${outputPath}`)