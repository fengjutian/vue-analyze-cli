import fs from 'fs-extra'
import type { TemplateInfo } from './type.d.ts'

export function generateHtmlReport(report: TemplateInfo[], outputPath: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
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
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/></svg>');
  opacity: 0.1;
}

.header-content {
  position: relative;
  z-index: 2;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.header h1::before {
  content: '📊';
  font-size: 2rem;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
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
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
}

th:last-child, td:last-child {
  border-right: none;
}

th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

th:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

tbody tr {
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

tbody tr:hover {
  background-color: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

tbody tr:last-child td {
  border-bottom: none;
}

/* 列表样式 */
.list {
  max-height: 120px;
  overflow-y: auto;
  font-size: 0.85rem;
  background-color: #ffffff;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  line-height: 1.4;
}

.list:empty {
  background-color: #f8fafc;
  color: #94a3b8;
  text-align: center;
  line-height: 3;
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
@media (max-width: 1200px) {
  .table-container {
    padding: 20px;
  }
  
  th, td {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
  
  .list {
    max-height: 100px;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  body {
    padding: 5px;
    font-size: 0.9rem;
  }
  
  .container {
    border-radius: 8px;
    padding: 0;
  }
  
  .header {
    padding: 20px 15px;
  }
  
  .header h1 {
    font-size: 1.8rem;
  }
  
  .header p {
    font-size: 1rem;
  }
  
  .summary {
    grid-template-columns: repeat(2, 1fr);
    padding: 20px 15px;
    gap: 12px;
  }
  
  .summary-item {
    padding: 15px;
  }
  
  .summary-item .count {
    font-size: 1.8rem;
  }
  
  .table-container {
    padding: 15px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  table {
    min-width: 1000px;
  }
  
  th, td {
    padding: 8px 6px;
    font-size: 0.8rem;
  }
  
  th {
    font-size: 0.7rem;
    letter-spacing: 0.3px;
  }
  
  .list {
    max-height: 80px;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .summary {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
  
  .table-container {
    padding: 10px;
  }
  
  table {
    min-width: 900px;
  }
  
  th, td {
    padding: 6px 4px;
  }
  
  .summary-item {
    padding: 12px;
  }
  
  .summary-item h3 {
    font-size: 0.8rem;
  }
  
  .summary-item .count {
    font-size: 1.6rem;
  }
}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="header-content">
      <h1>Vue AST 分析报告</h1>
      <p>分析时间: ${new Date().toLocaleString()}</p>
    </div>
  </div>
  
  <div class="summary">
    <div class="summary-item">
      <h3>总文件数</h3>
      <span class="count">${report.length}</span>
    </div>
    <div class="summary-item">
      <h3>总插值表达式</h3>
      <span class="count">${report.reduce((sum, item) => sum + item.interpolations.length, 0)}</span>
    </div>
    <div class="summary-item">
      <h3>总v-for指令</h3>
      <span class="count">${report.reduce((sum, item) => sum + item.vFors.length, 0)}</span>
    </div>
    <div class="summary-item">
      <h3>总v-if指令</h3>
      <span class="count">${report.reduce((sum, item) => sum + item.vIfs.length, 0)}</span>
    </div>
    <div class="summary-item">
      <h3>总v-else-if指令</h3>
      <span class="count">${report.reduce((sum, item) => sum + item.vElseIfs.length, 0)}</span>
    </div>
    <div class="summary-item">
      <h3>总v-else指令</h3>
      <span class="count">${report.reduce((sum, item) => sum + item.vElses, 0)}</span>
    </div>
    <div class="summary-item">
      <h3>总v-bind指令</h3>
      <span class="count">${report.reduce((sum, item) => sum + item.vBinds.length, 0)}</span>
    </div>
    <div class="summary-item">
      <h3>总v-on指令</h3>
      <span class="count">${report.reduce((sum, item) => sum + item.vOns.length, 0)}</span>
    </div>
    <div class="summary-item">
      <h3>总v-model指令</h3>
      <span class="count">${report.reduce((sum, item) => sum + item.vModels.length, 0)}</span>
    </div>
    <div class="summary-item">
      <h3>总组件</h3>
      <span class="count">${new Set(report.flatMap(item => item.components)).size}</span>
    </div>
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

function formatList(items) {
  if (!items || items.length === 0) {
    return '<span style="color: #94a3b8; font-style: italic;">-</span>';
  }
  return items.map(item => {
    const encoded = item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<div style="padding: 2px 0; border-bottom: 1px solid #f1f5f9;">' + encoded + '</div>';
  }).join('');
}

data.forEach(item => {
  const tr = document.createElement('tr');
  tr.innerHTML = '<td style="font-weight: 500; color: #475569;">' + item.file + '</td>' +
    '<td class="list">' + formatList(item.interpolations) + '</td>' +
    '<td class="list">' + formatList(item.vFors) + '</td>' +
    '<td class="list">' + formatList(item.vIfs) + '</td>' +
    '<td class="list">' + formatList(item.vElseIfs) + '</td>' +
    '<td style="text-align: center; font-weight: 600; color: #667eea;">' + item.vElses + '</td>' +
    '<td class="list">' + formatList(item.vBinds) + '</td>' +
    '<td class="list">' + formatList(item.vOns) + '</td>' +
    '<td class="list">' + formatList(item.vModels) + '</td>' +
    '<td class="list">' + formatList(item.components) + '</td>' +
    '<td class="list">' + formatList(item.slots) + '</td>' +
    '<td class="list">' + formatList(item.customDirectives) + '</td>';
  tbody.appendChild(tr);
});
</script>
</body>
</html>
  `
  
  fs.writeFileSync(outputPath, html)
}