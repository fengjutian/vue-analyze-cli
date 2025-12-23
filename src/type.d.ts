export interface TemplateInfo {
  file: string
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