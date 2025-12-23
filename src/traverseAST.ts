import { NodeTypes } from '@vue/compiler-dom'
import type { TemplateInfo } from './type.d.ts'

export function traverseAST(node: any, info: TemplateInfo) {
  if (!node) return

  // 处理插值表达式 {{ xxx }}
  if (node.type === NodeTypes.INTERPOLATION) {
    info.interpolations.push(node.content.content.trim())
  }

  // 处理元素节点
  if (node.type === NodeTypes.ELEMENT) {
    // 记录组件标签（大写开头）
    if (/^[A-Z]/.test(node.tag)) {
      info.components.push(node.tag)
    }

    // 遍历属性
    if (node.props) {
      node.props.forEach((prop: any) => {
        if (prop.type === NodeTypes.DIRECTIVE) {
          switch (prop.name) {
            case 'for':
              if (prop.exp) {
                info.vFors.push(prop.exp.content.trim())
              }
              break
            case 'if':
              if (prop.exp) {
                info.vIfs.push(prop.exp.content.trim())
              }
              break
            case 'else-if':
              if (prop.exp) {
                info.vElseIfs.push(prop.exp.content.trim())
              }
              break
            case 'else':
              info.vElses += 1
              break
            case 'bind':
              if (prop.arg) {
                info.vBinds.push(prop.arg.content.trim())
              }
              break
            case 'on':
              if (prop.arg) {
                info.vOns.push(prop.arg.content.trim())
              }
              break
            case 'model':
              if (prop.exp) {
                info.vModels.push(prop.exp.content.trim())
              }
              break
            default:
              // 处理自定义指令
              info.customDirectives.push(prop.name)
          }
        } else if (prop.type === NodeTypes.ATTRIBUTE && prop.name === 'v-model') {
          // 处理不带参数的v-model
          info.vModels.push('')
        }
      })
    }

    // 处理slot名称
    if (node.tag === 'slot') {
      const nameProp = node.props?.find((p: any) => 
        p.type === NodeTypes.ATTRIBUTE && p.name === 'name'
      )
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