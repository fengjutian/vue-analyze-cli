import fs from 'fs-extra'
import path from 'path'
import { globSync } from 'glob'
import { parse as parseSFC } from '@vue/compiler-sfc'
import { baseParse, NodeTypes } from '@vue/compiler-dom'
import type { TemplateInfo } from './type.d.ts'
import { traverseAST } from './traverseAST'

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

export function analyzeProject(projectPath: string): TemplateInfo[] {
  const files = globSync('**/*.vue', { cwd: projectPath, absolute: true, ignore: 'node_modules/**' })
  return files.map(analyzeVueFile)
}