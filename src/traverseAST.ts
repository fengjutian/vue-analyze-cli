/**
 * Vue 3 模板 AST 遍历器
 * 用于递归遍历 Vue 模板的抽象语法树，收集模板中的各种信息
 */
import { NodeTypes } from '@vue/compiler-dom'
import type { TemplateInfo } from './type.d.ts'

/**
 * 遍历 Vue 模板 AST 并收集模板信息
 * @param node 当前 AST 节点
 * @param info 模板信息对象，用于存储收集到的各种信息
 */
export function traverseAST(node: any, info: TemplateInfo): void {
  // 如果节点不存在，直接返回
  if (!node) return

  // 处理插值表达式 {{ xxx }}
  if (node.type === NodeTypes.INTERPOLATION) {
    // 提取插值内容并添加到信息对象中
    info.interpolations.push(node.content.content.trim())
  }

  // 处理元素节点
  if (node.type === NodeTypes.ELEMENT) {
    // 记录组件标签（大写开头的标签被视为组件）
    if (/^[A-Z]/.test(node.tag)) {
      info.components.push(node.tag)
    }

    // 遍历元素的属性
    if (node.props) {
      node.props.forEach((prop: any) => {
        // 处理指令属性
        if (prop.type === NodeTypes.DIRECTIVE) {
          switch (prop.name) {
            // 处理 v-for 指令
            case 'for':
              if (prop.exp) {
                info.vFors.push(prop.exp.content.trim())
              }
              break
            
            // 处理 v-if 指令
            case 'if':
              if (prop.exp) {
                info.vIfs.push(prop.exp.content.trim())
              }
              break
            
            // 处理 v-else-if 指令
            case 'else-if':
              if (prop.exp) {
                info.vElseIfs.push(prop.exp.content.trim())
              }
              break
            
            // 处理 v-else 指令（无表达式）
            case 'else':
              info.vElses += 1
              break
            
            // 处理 v-bind 指令
            case 'bind':
              if (prop.arg) {
                info.vBinds.push(prop.arg.content.trim())
              }
              break
            
            // 处理 v-on 指令
            case 'on':
              if (prop.arg) {
                info.vOns.push(prop.arg.content.trim())
              }
              break
            
            // 处理 v-model 指令
            case 'model':
              if (prop.exp) {
                info.vModels.push(prop.exp.content.trim())
              }
              break
            
            // 处理自定义指令
            default:
              info.customDirectives.push(prop.name)
          }
        } 
        // 处理普通属性形式的 v-model
        else if (prop.type === NodeTypes.ATTRIBUTE && prop.name === 'v-model') {
          info.vModels.push('')
        }
      })
    }

    // 处理 slot 标签
    if (node.tag === 'slot') {
      // 查找 name 属性
      const nameProp = node.props?.find((p: any) =>
        p.type === NodeTypes.ATTRIBUTE && p.name === 'name'
      )
      // 如果有 name 属性则使用指定名称，否则使用默认名称
      if (nameProp) {
        info.slots.push(nameProp.value?.content || 'default')
      } else {
        info.slots.push('default')
      }
    }
  }

  // 递归处理子节点
  if (node.children) {
    node.children.forEach((child: any) => traverseAST(child, info))
  }
}