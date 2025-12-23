import fs from 'fs-extra';
export function generateHtmlReport(report, outputPath) {
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Vue AST 分析报告</title>
<style>
body { font-family: Arial; padding: 20px; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
th { background: #f0f0f0; }
tr:hover { background: #f9f9f9; }
.container { max-width: 1200px; margin: 0 auto; }
.header { text-align: center; margin-bottom: 20px; }
.summary { background: #e8f4f8; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
.summary-item { display: inline-block; margin: 0 15px; }
.list { max-height: 100px; overflow-y: auto; font-size: 12px; }
.count { font-weight: bold; }
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
  `;
    fs.writeFileSync(outputPath, html);
}
//# sourceMappingURL=generateHtmlReport.js.map