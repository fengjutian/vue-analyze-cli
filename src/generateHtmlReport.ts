import fs from 'fs-extra'
import path from 'path'
import type { TemplateInfo } from './type.d.ts'

interface Report {
  files: TemplateInfo[]
  errors: { file: string; message: string; stack: string }[]
}

/**
 * 生成 Vue 模板分析的 HTML 报告（支持显示错误文件列表）
 * @param report 容错版分析报告对象
 * @param outputPath 报告输出路径
 */
export function generateHtmlReport(report: Report, outputPath: string): void {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vue AST 分析报告</title>
<style>
/* （省略原有样式，保持原来的 CSS 样式即可） */
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #333; padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);}
.header { text-align: center; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.header h1::before { content: '📊 '; }
.summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 20px; padding: 20px; background: #f8fafc; }
.summary-item { background: #fff; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);}
.count { font-size: 2rem; font-weight: 700; color: #667eea; display: block; margin-top: 8px; }
.table-container { padding: 20px; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 1000px; }
th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; position: sticky; top: 0; }
.list { max-height: 120px; overflow-y: auto; font-size: 0.85rem; background: #fff; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0; line-height: 1.4;}
.list:empty { background-color: #f8fafc; color: #94a3b8; text-align: center; line-height: 3; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Vue AST 分析报告</h1>
    <p>分析时间: ${new Date().toLocaleString()}</p>
  </div>

  <div class="summary">
    <div class="summary-item">
      <h3>成功解析文件数</h3>
      <span class="count">${report.files.length}</span>
    </div>
    <div class="summary-item">
      <h3>解析失败文件数</h3>
      <span class="count">${report.errors.length}</span>
    </div>
    <div class="summary-item">
      <h3>总插值表达式</h3>
      <span class="count">${report.files.reduce((sum, item) => sum + item.interpolations.length, 0)}</span>
    </div>
    <div class="summary-item">
      <h3>总 v-for 指令</h3>
      <span class="count">${report.files.reduce((sum, item) => sum + item.vFors.length, 0)}</span>
    </div>
    <div class="summary-item">
      <h3>总组件</h3>
      <span class="count">${new Set(report.files.flatMap(item => item.components)).size}</span>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>文件路径</th>
          <th>插值表达式</th>
          <th>v-for</th>
          <th>v-if</th>
          <th>v-else-if</th>
          <th>v-else</th>
          <th>v-bind</th>
          <th>v-on</th>
          <th>v-model</th>
          <th>组件</th>
          <th>Slots</th>
          <th>自定义指令</th>
        </tr>
      </thead>
      <tbody id="table-body"></tbody>
    </table>
  </div>

  <div class="table-container">
    <h2>解析失败文件列表</h2>
    <table>
      <thead>
        <tr>
          <th>文件路径</th>
          <th>错误信息</th>
        </tr>
      </thead>
      <tbody id="error-body"></tbody>
    </table>
  </div>
</div>

<script>
const data = ${JSON.stringify(report.files)};
const errors = ${JSON.stringify(report.errors)};

function formatList(items) {
  if (!items || items.length === 0) return '<span style="color:#94a3b8;font-style:italic;">-</span>';
  return items.map(i => i.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')).map(i => '<div>'+i+'</div>').join('');
}

const tbody = document.getElementById('table-body');
data.forEach(item => {
  const tr = document.createElement('tr');
  tr.innerHTML =
    '<td>' + item.file + '</td>' +
    '<td class="list">' + formatList(item.interpolations) + '</td>' +
    '<td class="list">' + formatList(item.vFors) + '</td>' +
    '<td class="list">' + formatList(item.vIfs) + '</td>' +
    '<td class="list">' + formatList(item.vElseIfs) + '</td>' +
    '<td style="text-align:center;">' + item.vElses + '</td>' +
    '<td class="list">' + formatList(item.vBinds) + '</td>' +
    '<td class="list">' + formatList(item.vOns) + '</td>' +
    '<td class="list">' + formatList(item.vModels) + '</td>' +
    '<td class="list">' + formatList(item.components) + '</td>' +
    '<td class="list">' + formatList(item.slots) + '</td>' +
    '<td class="list">' + formatList(item.customDirectives) + '</td>';
  tbody.appendChild(tr);
});

const etbody = document.getElementById('error-body');
errors.forEach(err => {
  const tr = document.createElement('tr');
  tr.innerHTML =
    '<td>' + err.file + '</td>' +
    '<td class="list">' + err.message + '</td>';
  etbody.appendChild(tr);
});
</script>
</body>
</html>
`

  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(outputPath, html)
}
