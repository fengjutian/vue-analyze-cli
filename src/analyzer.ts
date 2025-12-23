import fs from 'fs-extra'
import * as glob from 'glob'
import { parse as parseSFC } from '@vue/compiler-sfc'
import { baseParse } from '@vue/compiler-dom'
import type { TemplateInfo } from './type.d.ts'
import { traverseAST } from './traverseAST.js'

export function analyzeVueFile(filePath: string): TemplateInfo {
  const code = fs.readFileSync(filePath, 'utf-8')
  const { descriptor } = parseSFC(code)

  const info: TemplateInfo = {
    file: filePath,
    interpolations: [],
    vFors: [],
    vIfs: [],
    vElseIfs: [],
    vElses: 0,
    vBinds: [],
    vOns: [],
    vModels: [],
    components: [],
    slots: [],
    customDirectives: []
  }

  if (descriptor.template?.content) {
    const ast = baseParse(descriptor.template.content)
    traverseAST(ast, info)
  }

  return info
}

/**
 * 容错版分析整个 Vue 项目
 */
export function analyzeProject(projectPath: string): {
  files: TemplateInfo[],
  errors: { file: string, message: string, stack: string }[]
} {
  const files = glob.sync('**/*.vue', {
    cwd: projectPath,
    absolute: true,
    ignore: 'node_modules/**'
  })

  const report = {
    files: [] as TemplateInfo[],
    errors: [] as { file: string, message: string, stack: string }[]
  }

  for (const filePath of files) {
    try {
      const info = analyzeVueFile(filePath)
      report.files.push(info)
    } catch (err: any) {
      console.warn(`跳过文件 ${filePath}，解析出错: ${err.message}`)
      report.errors.push({
        file: filePath,
        message: err.message,
        stack: err.stack
      })
    }
  }

  return report
}
