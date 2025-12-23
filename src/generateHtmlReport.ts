import fs from 'fs-extra'

export interface TemplateInfo {
  file: string
  interpolations: string[]
  vFors: string[]
  vIfs: string[]
}

export function generateHtmlReport(report: TemplateInfo[], outputPath: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Vue AST 分析报告</title>
<style>
body { font-family: Arial; padding: 20px; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ccc; padding: 8px; }
th { background: #f0f0f0; }
tr:hover { background: #f9f9f9; }
</style>
</head>
<body>
<h1>Vue AST 分析报告</h1>
<table>
  <thead>
    <tr>
      <th>文件</th>
      <th>插值</th>
      <th>v-for</th>
      <th>v-if</th>
    </tr>
  </thead>
  <tbody id="table-body"></tbody>
</table>
<script>
const data = ${JSON.stringify(report)};
const tbody = document.getElementById('table-body');
data.forEach(item => {
  const tr = document.createElement('tr');
  tr.innerHTML = \`
    <td>\${item.file}</td>
    <td>\${item.interpolations.join(', ')}</td>
    <td>\${item.vFors.join(', ')}</td>
    <td>\${item.vIfs.join(', ')}</td>
  \`;
  tbody.appendChild(tr);
});
</script>
</body>
</html>
  `
  fs.writeFileSync(outputPath, html)
}