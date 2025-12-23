import fs from 'fs-extra'
import type { TemplateInfo } from './type.d.ts'

export function generateHtmlReport(report: TemplateInfo[], outputPath: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Vue AST 分析报告</title>
<style>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 现代化字体 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8fafc;
  padding: 20px;
}

/* 容器样式 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* 头部样式 */
.header {
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

/* 摘要部分 */
.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 30px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.summary-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.summary-item h3 {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.summary-item .count {
  font-size: 2.2rem;
  font-weight: 700;
  color: #667eea;
  display: block;
}

/* 表格容器 */
.table-container {
  padding: 30px;
  overflow-x: auto;
}

/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  min-width: 1200px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

tbody tr {
  transition: background-color 0.2s ease-in-out;
}

tbody tr:hover {
  background-color: #f1f5f9;
}

tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

/* 列表样式 */
.list {
  max-height: 120px;
  overflow-y: auto;
  font-size: 0.85rem;
  background-color: #f8fafc;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

/* 滚动条样式 */
.list::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  body {
    padding: 10px;
  }
  
  .container {
    border-radius: 8px;
  }
  
  .header {
    padding: 20px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .summary {
    grid-template-columns: repeat(2, 1fr);
    padding: 20px;
  }
  
  .table-container {
    padding: 20px;
  }
  
  th, td {
    padding: 10px 8px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .summary {
    grid-template-columns: 1fr;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Vue AST 分析报告</h1>
    <p>分析时间: ${new Date().toLocaleString()}</p>
  </div>
  
  <div class="summary">
    <div class="summary-item">总文件数: <span class="count">${report.length}</span></div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>文件路径</th>
        <th>插值表达式</th>
        <th>v-for 指令</th>
        <th>v-if 指令</th>
        <th>v-else-if 指令</th>
        <th>v-else 指令</th>
        <th>v-bind 指令</th>
        <th>v-on 指令</th>
        <th>v-model 指令</th>
        <th>组件</th>
        <th>Slots</th>
        <th>自定义指令</th>
      </tr>
    </thead>
    <tbody id="table-body"></tbody>
  </table>
</div>

<script>
const data = ${JSON.stringify(report)};
const tbody = document.getElementById('table-body');

data.forEach(item => {
  const tr = document.createElement('tr');
  tr.innerHTML = '<td>' + item.file + '</td>' +
    '<td class="list">' + (item.interpolations.join(', ') || '-') + '</td>' +
    '<td class="list">' + (item.vFors.join(', ') || '-') + '</td>' +
    '<td class="list">' + (item.vIfs.join(', ') || '-') + '</td>' +
    '<td class="list">' + (item.vElseIfs.join(', ') || '-') + '</td>' +
    '<td>' + item.vElses + '</td>' +
    '<td class="list">' + (item.vBinds.join(', ') || '-') + '</td>' +
    '<td class="list">' + (item.vOns.join(', ') || '-') + '</td>' +
    '<td class="list">' + (item.vModels.join(', ') || '-') + '</td>' +
    '<td class="list">' + (item.components.join(', ') || '-') + '</td>' +
    '<td class="list">' + (item.slots.join(', ') || '-') + '</td>' +
    '<td class="list">' + (item.customDirectives.join(', ') || '-') + '</td>';
  tbody.appendChild(tr);
});
</script>
</body>
</html>
  `
  
  fs.writeFileSync(outputPath, html)
}