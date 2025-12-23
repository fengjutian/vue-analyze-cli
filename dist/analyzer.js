import fs from 'fs-extra';
import { globSync } from 'glob';
import { parse as parseSFC } from '@vue/compiler-sfc';
import { baseParse, NodeTypes } from '@vue/compiler-dom';
function traverseAST(node, info) {
    if (!node)
        return;
    if (node.type === NodeTypes.INTERPOLATION)
        info.interpolations.push(node.content.content.trim());
    if (node.type === NodeTypes.ELEMENT && node.props) {
        node.props.forEach((prop) => {
            if (prop.type === NodeTypes.DIRECTIVE) {
                if (prop.name === 'for' && prop.exp)
                    info.vFors.push(prop.exp.content.trim());
                if (prop.name === 'if' && prop.exp)
                    info.vIfs.push(prop.exp.content.trim());
            }
        });
    }
    if (node.children)
        node.children.forEach((child) => traverseAST(child, info));
}
export function analyzeVueFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const { descriptor } = parseSFC(code);
    const info = { file: filePath, interpolations: [], vFors: [], vIfs: [] };
    if (descriptor.template?.content) {
        const ast = baseParse(descriptor.template.content);
        traverseAST(ast, info);
    }
    return info;
}
export function analyzeProject(projectPath) {
    const files = globSync('**/*.vue', { cwd: projectPath, absolute: true, ignore: 'node_modules/**' });
    return files.map(analyzeVueFile);
}
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
  `;
    fs.writeFileSync(outputPath, html);
}
//# sourceMappingURL=analyzer.js.map