/**
 * Vue 文件分析器
 * 用于分析 Vue 项目中的模板文件，提取各种模板信息
 */
import fs from 'fs-extra'
import * as glob from 'glob'
import { parse as parseSFC } from '@vue/compiler-sfc'
import { baseParse } from '@vue/compiler-dom'
import type { TemplateInfo } from './type.d.ts'
import { traverseAST } from './traverseAST.js'

/**
 * 分析单个 Vue 文件的模板内容
 * @param filePath Vue 文件路径
 * @returns 包含模板信息的对象
 */
export function analyzeVueFile(filePath: string): TemplateInfo {
  // 读取 Vue 文件内容
  const code = fs.readFileSync(filePath, 'utf-8')
  
  // 解析 Vue 单文件组件
  const { descriptor } = parseSFC(code)
  
  // 初始化模板信息对象
  const info: TemplateInfo = {
    file: filePath,
    interpolations: [],    // 插值表达式集合
    vFors: [],             // v-for 指令集合
    vIfs: [],              // v-if 指令集合
    vElseIfs: [],          // v-else-if 指令集合
    vElses: 0,             // v-else 指令数量
    vBinds: [],            // v-bind 指令集合
    vOns: [],              // v-on 指令集合
    vModels: [],           // v-model 指令集合
    components: [],        // 组件标签集合
    slots: [],             // 插槽名称集合
    customDirectives: []   // 自定义指令集合
  }
  
  // 如果模板存在，解析并遍历 AST
  if (descriptor.template?.content) {
    // 解析模板内容为 AST
    const ast = baseParse(descriptor.template.content)
    
    // 遍历 AST 收集信息
    traverseAST(ast, info)
  }
  
  return info
}

/**
 * 分析整个 Vue 项目
 * @param projectPath 项目根路径
 * @returns 所有分析文件的模板信息数组
 */
export function analyzeProject(projectPath: string): TemplateInfo[] {
  // 查找项目中所有 Vue 文件（排除 node_modules）
  const files = glob.sync('**/*.vue', {
    cwd: projectPath,
    absolute: true,
    ignore: 'node_modules/**'
  })
  
  // 分析每个 Vue 文件
  return files.map(analyzeVueFile)
}