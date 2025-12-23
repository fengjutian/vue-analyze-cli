import fs from 'fs-extra';
import path from 'path';
import type { TemplateInfo } from './type.d.ts';

interface Report {
  files: TemplateInfo[];
  errors: { file: string; message: string; stack?: string }[];
}

export function generateHtmlReport(report: Report, outputPath: string): void {
  const totalFiles = report.files.length + report.errors.length;
  const totalInterpolations = report.files.reduce((s, i) => s + i.interpolations.length, 0);
  const totalVFor = report.files.reduce((s, i) => s + i.vFors.length, 0);
  const totalComponents = new Set(report.files.flatMap(i => i.components)).size;

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vue AST 分析 Dashboard</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#f1f5f9; color:#1e293b; margin:0; padding:0; }
.header { background: linear-gradient(135deg,#667eea,#764ba2); color:white; padding:30px; text-align:center; }
.header h1 { font-size:2.2rem; margin-bottom:5px; }
.header p { font-size:1rem; opacity:0.85; }
.dashboard { display:grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap:20px; padding:20px; }
.card { background:#fff; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.05); padding:20px; text-align:center; transition: transform 0.2s; }
.card:hover { transform: translateY(-4px); }
.card h3 { font-size:0.9rem; font-weight:600; color:#64748b; margin-bottom:10px; }
.card .count { font-size:2.2rem; font-weight:700; color:#667eea; }
.chart-container { display:flex; flex-wrap:wrap; gap:20px; padding:20px; }
.chart-box { background:#fff; border-radius:12px; padding:20px; flex:1 1 400px; box-shadow:0 4px 6px rgba(0,0,0,0.05); }
.controls { padding:20px; display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
.controls input, .controls select { padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1; }
.table-container { padding:20px; overflow-x:auto; }
table { width:100%; border-collapse:collapse; background:#fff; border-radius:8px; min-width:1000px; box-shadow:0 4px 6px rgba(0,0,0,0.05); }
th, td { padding:10px; border-bottom:1px solid #e2e8f0; text-align:left; }
th { background:#667eea; color:white; position:sticky; top:0; }
tbody tr:hover { background:#f1f5f9; transform:translateY(-1px); }
.list { max-height:100px; overflow-y:auto; font-size:0.85rem; padding:5px; border-radius:4px; background:#f8fafc; border:1px solid #e2e8f0; }
.error-section { margin-top:30px; padding:20px; background:#fee2e2; border-radius:12px; color:#b91c1c; }
.error-section h2 { margin-bottom:15px; }
.error-list { max-height:200px; overflow-y:auto; }
.error-item { padding:8px; border-bottom:1px solid #fca5a5; font-size:0.9rem; }
.error-item:last-child { border-bottom:none; }
@media(max-width:768px){.dashboard{grid-template-columns:repeat(2,1fr);} table{min-width:800px;}}
@media(max-width:480px){.dashboard{grid-template-columns:1fr;} table{min-width:600px;}}
</style>
</head>
<body>
<div class="header">
  <h1>Vue AST 分析 Dashboard</h1>
  <p>分析时间: ${new Date().toLocaleString()}</p>
</div>

<div class="dashboard">
  <div class="card">
    <h3>成功解析文件数</h3>
    <span class="count">${report.files.length} (${((report.files.length/totalFiles)*100).toFixed(1)}%)</span>
  </div>
  <div class="card">
    <h3>解析失败文件数</h3>
    <span class="count" style="color:#ef4444;">${report.errors.length} (${((report.errors.length/totalFiles)*100).toFixed(1)}%)</span>
  </div>
  <div class="card">
    <h3>总插值表达式</h3>
    <span class="count">${totalInterpolations}</span>
  </div>
  <div class="card">
    <h3>总 v-for 指令</h3>
    <span class="count">${totalVFor}</span>
  </div>
  <div class="card">
    <h3>总组件</h3>
    <span class="count">${totalComponents}</span>
  </div>
</div>

<div class="chart-container">
  <div class="chart-box">
    <h3>文件解析比例</h3>
    <canvas id="pieChart"></canvas>
  </div>
  <div class="chart-box">
    <h3>指令总数统计</h3>
    <canvas id="barChart"></canvas>
  </div>
</div>

<div class="controls">
  <label>搜索文件名: <input type="text" id="searchInput" placeholder="输入文件名关键字"></label>
  <label>按指令过滤: 
    <select id="filterSelect">
      <option value="all">全部</option>
      <option value="interpolations">插值表达式</option>
      <option value="vFors">v-for</option>
      <option value="vIfs">v-if</option>
      <option value="vElseIfs">v-else-if</option>
      <option value="vElses">v-else</option>
      <option value="vBinds">v-bind</option>
      <option value="vOns">v-on</option>
      <option value="vModels">v-model</option>
      <option value="components">组件</option>
    </select>
  </label>
</div>

<div class="table-container">
  <h2>文件解析详情</h2>
  <table>
    <thead>
      <tr>
        <th>文件名</th>
        <th>插值</th>
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
    <tbody id="file-table-body"></tbody>
  </table>
</div>

<div class="error-section">
  <h2>解析失败文件列表</h2>
  <div class="error-list" id="error-list"></div>
</div>

<script>
const files = ${JSON.stringify(report.files)};
const errors = ${JSON.stringify(report.errors)};

function formatList(items){ 
  if(!items||items.length===0) return '<span style="color:#94a3b8;font-style:italic;">-</span>'; 
  return items.map(i=>i.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')).map(i=>'<div>'+i+'</div>').join(''); 
}

function renderTable(filteredFiles){
  const tbody = document.getElementById('file-table-body');
  tbody.innerHTML='';
  filteredFiles.forEach(item=>{
    const tr=document.createElement('tr');
    tr.innerHTML=
      '<td>'+item.file+'</td>'+
      '<td class="list">'+formatList(item.interpolations)+'</td>'+
      '<td class="list">'+formatList(item.vFors)+'</td>'+
      '<td class="list">'+formatList(item.vIfs)+'</td>'+
      '<td class="list">'+formatList(item.vElseIfs)+'</td>'+
      '<td>'+item.vElses+'</td>'+
      '<td class="list">'+formatList(item.vBinds)+'</td>'+
      '<td class="list">'+formatList(item.vOns)+'</td>'+
      '<td class="list">'+formatList(item.vModels)+'</td>'+
      '<td class="list">'+formatList(item.components)+'</td>'+
      '<td class="list">'+formatList(item.slots)+'</td>'+
      '<td class="list">'+formatList(item.customDirectives)+'</td>';
    tbody.appendChild(tr);
  });
}

// 初始渲染
renderTable(files);

// 搜索 + 过滤
document.getElementById('searchInput').addEventListener('input', ()=>applyFilter());
document.getElementById('filterSelect').addEventListener('change', ()=>applyFilter());

function applyFilter(){
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const filter = document.getElementById('filterSelect').value;
  let filtered = files.filter(f=>f.file.toLowerCase().includes(keyword));
  if(filter!=='all'){
    filtered = filtered.filter(f=>{
      if(filter==='vElses') return f.vElses>0;
      if(filter==='components') return f.components.length>0;
      return f[filter] && f[filter].length>0;
    });
  }
  renderTable(filtered);
}

// 渲染失败文件
const elist = document.getElementById('error-list');
errors.forEach(err=>{
  const div=document.createElement('div');
  div.className='error-item';
  div.textContent=err.file+' → '+err.message;
  elist.appendChild(div);
});

// 文件比例饼图
new Chart(document.getElementById('pieChart').getContext('2d'),{
  type:'doughnut',
  data:{
    labels:['成功文件','失败文件'],
    datasets:[{ data:[files.length, errors.length], backgroundColor:['#34d399','#f87171'], hoverOffset:10 }]
  },
  options:{ responsive:true, plugins:{ tooltip:{ callbacks:{ label: context=> context.label + ': '+context.raw+' ('+((context.raw/totalFiles)*100).toFixed(1)+'%)' }}}}
});

// 指令总数柱状图
const directiveCounts = [
  files.reduce((s,i)=>s+i.interpolations.length,0),
  files.reduce((s,i)=>s+i.vFors.length,0),
  files.reduce((s,i)=>s+i.vIfs.length,0),
  files.reduce((s,i)=>s+i.vElseIfs.length,0),
  files.reduce((s,i)=>s+i.vElses,0),
  files.reduce((s,i)=>s+i.vBinds.length,0),
  files.reduce((s,i)=>s+i.vOns.length,0),
  files.reduce((s,i)=>s+i.vModels.length,0),
  new Set(files.flatMap(i=>i.components)).size
];
const maxCount = Math.max(...directiveCounts);
const barColors = directiveCounts.map(v=>'rgba(102,126,234,'+((v/maxCount)*0.9+0.1)+')');

new Chart(document.getElementById('barChart').getContext('2d'),{
  type:'bar',
  data:{
    labels:['插值','v-for','v-if','v-else-if','v-else','v-bind','v-on','v-model','组件'],
    datasets:[{ label:'总数', data:directiveCounts, backgroundColor:barColors }]
  },
  options:{ responsive:true, scales:{ y:{ beginAtZero:true } }, plugins:{ tooltip:{ callbacks:{ label: context=> context.label + ': '+context.raw }}}}
});
</script>
</body>
</html>
`;

  const outputDir = path.dirname(outputPath);
  if(!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, html);
}
