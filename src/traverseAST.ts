import { NodeTypes } from '@vue/compiler-dom'

export interface TemplateInfo {
  interpolations: string[]        // {{ xxx }}
  vFors: string[]                 // v-for 表达式
  vIfs: string[]                  // v-if 条件
  vElseIfs: string[]              // v-else-if 条件
  vElses: number                  // v-else 出现次数
  vBinds: string[]                // v-bind / : 属性
  vOns: string[]                  // v-on / @ 事件
  vModels: string[]               // v-model
  components: string[]            // 使用的组件标签名
  slots: string[]                 // slot 名称
  customDirectives: string[]      // 自定义指令
}

export function traverseAST(node: any, info: TemplateInfo) {
  if (!node) return

  // 插值 {{ xxx }}
  if (node.type === NodeTypes.INTERPOLATION) {
    info.interpolations.push(node.content.content.trim())
  }

  // 元素节点
  if (node.type === NodeTypes.ELEMENT) {
    // 记录组件标签（大写开头）
    if (/^[A-Z]/.test(node.tag)) info.components.push(node.tag)

    // 遍历 props
    if (node.props) {
      node.props.forEach((prop: any) => {
        if (prop.type === NodeTypes.DIRECTIVE) {
          switch (prop.name) {
            case 'for':
              if (prop.exp) info.vFors.push(prop.exp.content.trim())
              break
            case 'if':
              if (prop.exp) info.vIfs.push(prop.exp.content.trim())
              break
            case 'else-if':
              if (prop.exp) info.vElseIfs.push(prop.exp.content.trim())
              break
            case 'else':
              info.vElses += 1
              break
            case 'bind':
              if (prop.arg) info.vBinds.push(prop.arg.content.trim())
              break
            case 'on':
              if (prop.arg) info.vOns.push(prop.arg.content.trim())
              break
            case 'model':
              if (prop.exp) info.vModels.push(prop.exp.content.trim())
              break
            default:
              // 自定义指令
              info.customDirectives.push(prop.name)
          }
        }
      })
    }

    // slot 名称
    if (node.tag === 'slot') {
      const nameProp = node.props?.find((p: any) => p.type === NodeTypes.ATTRIBUTE && p.name === 'name')
      if (nameProp) info.slots.push(nameProp.value?.content || 'default')
    }
  }

  // 递归子节点
  if (node.children) {
    node.children.forEach((child: any) => traverseAST(child, info))
  }
}
