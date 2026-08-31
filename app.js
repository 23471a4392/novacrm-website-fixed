
const KEY='novacrm_data_v1';
const seed={
contacts:[
{id:1,name:'Aarav Sharma',company:'Acme Technologies',email:'aarav@acme.example',phone:'+91 98765 10001',status:'Active',owner:'Priya',source:'Website',tags:['Enterprise','Hot']},
{id:2,name:'Diya Reddy',company:'BlueSky Retail',email:'diya@bluesky.example',phone:'+91 98765 10002',status:'Active',owner:'Rahul',source:'Referral',tags:['Retail']},
{id:3,name:'Kabir Khan',company:'Vertex Labs',email:'kabir@vertex.example',phone:'+91 98765 10003',status:'Lead',owner:'Priya',source:'LinkedIn',tags:['SaaS']},
{id:4,name:'Meera Nair',company:'GreenLeaf Foods',email:'meera@greenleaf.example',phone:'+91 98765 10004',status:'Inactive',owner:'Arjun',source:'Campaign',tags:['SMB']}
],
deals:[
{id:11,name:'Acme Expansion',company:'Acme Technologies',value:125000,stage:'Proposal',owner:'Priya',close:'2026-09-20'},
{id:12,name:'BlueSky Renewal',company:'BlueSky Retail',value:82000,stage:'Negotiation',owner:'Rahul',close:'2026-09-12'},
{id:13,name:'Vertex Starter',company:'Vertex Labs',value:45000,stage:'Qualified',owner:'Priya',close:'2026-10-05'},
{id:14,name:'GreenLeaf CRM',company:'GreenLeaf Foods',value:60000,stage:'Lead',owner:'Arjun',close:'2026-10-20'}
],
tasks:[
{id:21,title:'Call Acme decision maker',owner:'Priya',due:'2026-09-02',priority:'High',status:'Open'},
{id:22,title:'Send renewal proposal',owner:'Rahul',due:'2026-09-03',priority:'Medium',status:'Open'},
{id:23,title:'Product demo',owner:'Arjun',due:'2026-09-05',priority:'High',status:'In Progress'}
],
activities:[
{id:31,text:'Priya updated Acme Expansion',time:'10 minutes ago'},
{id:32,text:'Rahul added a new task',time:'45 minutes ago'},
{id:33,text:'New lead: Kabir Khan',time:'2 hours ago'}
],
settings:{company:'NovaCRM',currency:'₹',theme:'light'}
};
let db=JSON.parse(localStorage.getItem(KEY)||'null')||seed;
let state={page:'dashboard',search:'',editId:null};

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const save=()=>localStorage.setItem(KEY,JSON.stringify(db));
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n||0);
const initials=n=>n.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
const toast=msg=>{const x=document.querySelector('.toast');x.textContent=msg;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)};
function addActivity(text){db.activities.unshift({id:Date.now(),text,time:'Just now'});db.activities=db.activities.slice(0,12);save()}

function shell(){
document.querySelector('#app').innerHTML=`
<aside class="sidebar"><div class="brand">Nova<span>CRM</span></div><nav class="nav">
${[['dashboard','▦ Dashboard'],['contacts','◎ Contacts'],['deals','◇ Deals'],['tasks','✓ Tasks'],['activities','◷ Activities'],['reports','▥ Reports'],['settings','⚙ Settings']].map(([p,l])=>`<button class="${state.page===p?'active':''}" onclick="go('${p}')">${l}</button>`).join('')}
</nav></aside>
<main class="main"><header class="topbar"><div class="top-actions"><button class="btn mobile-menu" onclick="document.querySelector('.sidebar').style.display='block'">☰</button><input class="search" placeholder="Search CRM..." value="${esc(state.search)}" oninput="state.search=this.value;render()"></div><div class="top-actions"><button class="btn" onclick="exportData()">Export</button><button class="btn primary" onclick="quickAdd()">+ Add</button></div></header><section class="container" id="page"></section></main>
<div class="modal-bg" id="modal"><div class="modal" id="modalBody"></div></div><div class="toast"></div>`;
renderPage();
}
function go(p){state.page=p;state.search='';shell()}
function render(){renderPage()}
function renderPage(){
const p=document.querySelector('#page');if(!p)return;
const map={dashboard:dashboard,contacts:contacts,deals:deals,tasks:tasks,activities:activities,reports:reports,settings:settings};
p.innerHTML=map[state.page]();
}

function dashboard(){
const revenue=db.deals.filter(d=>d.stage==='Won').reduce((a,d)=>a+d.value,0);
const pipeline=db.deals.filter(d=>d.stage!=='Won').reduce((a,d)=>a+d.value,0);
return `<div class="page-head"><div><h1>Dashboard</h1><p>Customer relationship overview</p></div><button class="btn primary" onclick="openContact()">+ New Contact</button></div>
<div class="grid stats">
${stat('Total Contacts',db.contacts.length,'+12% this month')}${stat('Open Deals',db.deals.filter(d=>d.stage!=='Won').length,'+8% this month')}${stat('Pipeline',money(pipeline),'+18% this month')}${stat('Won Revenue',money(revenue),'+24% this month')}
</div><br><div class="grid two"><div class="card"><h3>Revenue Trend</h3><div class="chart">${[42,55,49,72,66,88,79,96,83,110,101,124].map((v,i)=>`<div style="flex:1;height:100%;display:flex;flex-direction:column;justify-content:end"><div class="bar" style="height:${v*1.7}px"></div><div class="bar-label">${['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'][i]}</div></div>`).join('')}</div></div>
<div class="card"><h3>Recent Activity</h3><div class="activity">${db.activities.slice(0,5).map(a=>`<div class="activity-item"><span class="dot"></span><div>${esc(a.text)}<br><small>${esc(a.time)}</small></div></div>`).join('')}</div></div></div>
<br><div class="card"><h3>Upcoming Tasks</h3>${taskTable(db.tasks.slice(0,5))}</div>`;
}
function stat(a,b,c){return `<div class="card"><div class="stat-label">${a}</div><div class="stat-value">${b}</div><div class="trend">${c}</div></div>`}
function contacts(){
let rows=db.contacts.filter(x=>JSON.stringify(x).toLowerCase().includes(state.search.toLowerCase()));
return `<div class="page-head"><div><h1>Contacts</h1><p>Manage people and customer records</p></div><button class="btn primary" onclick="openContact()">+ New Contact</button></div>
<div class="card"><div class="toolbar"><input placeholder="Filter contacts..." value="${esc(state.search)}" oninput="state.search=this.value;render()"><select onchange="filterStatus(this.value)"><option value="">All status</option><option>Active</option><option>Lead</option><option>Inactive</option></select><button class="btn" onclick="resetDemo()">Reset Demo</button></div>
<div class="table-wrap"><table class="table"><thead><tr><th>Contact</th><th>Company</th><th>Email</th><th>Phone</th><th>Status</th><th>Owner</th><th>Actions</th></tr></thead><tbody>
${rows.length?rows.map(c=>`<tr><td><div class="person"><span class="avatar">${initials(c.name)}</span>${esc(c.name)}</div></td><td>${esc(c.company)}</td><td>${esc(c.email)}</td><td>${esc(c.phone)}</td><td>${badge(c.status)}</td><td>${esc(c.owner)}</td><td><button class="btn" onclick="openContact(${c.id})">Edit</button> <button class="btn danger" onclick="remove('contacts',${c.id})">Delete</button></td></tr>`).join(''):`<tr><td colspan="7" class="empty">No contacts found</td></tr>`}
</tbody></table></div></div>`;
}
function deals(){
const stages=['Lead','Qualified','Proposal','Negotiation','Won'];
return `<div class="page-head"><div><h1>Sales Pipeline</h1><p>Track opportunities from lead to close</p></div><button class="btn primary" onclick="openDeal()">+ New Deal</button></div>
<div class="pipeline">${stages.map(s=>`<div class="stage"><h3>${s} <span style="float:right">${db.deals.filter(d=>d.stage===s).length}</span></h3>${db.deals.filter(d=>d.stage===s&&JSON.stringify(d).toLowerCase().includes(state.search.toLowerCase())).map(d=>`<div class="deal"><div class="deal-title">${esc(d.name)}</div><small>${esc(d.company)}</small><strong>${money(d.value)}</strong><small>Close: ${esc(d.close)}</small><small>${esc(d.owner)}</small><div style="margin-top:9px"><button class="btn" onclick="openDeal(${d.id})">Edit</button> <button class="btn danger" onclick="remove('deals',${d.id})">×</button></div></div>`).join('')}</div>`).join('')}</div>`;
}
function tasks(){
let rows=db.tasks.filter(x=>JSON.stringify(x).toLowerCase().includes(state.search.toLowerCase()));
return `<div class="page-head"><div><h1>Tasks</h1><p>Keep follow-ups and actions organized</p></div><button class="btn primary" onclick="openTask()">+ New Task</button></div><div class="card"><div class="table-wrap">${taskTable(rows,true)}</div></div>`;
}
function taskTable(rows,actions=false){
return `<table class="table"><thead><tr><th>Task</th><th>Owner</th><th>Due</th><th>Priority</th><th>Status</th>${actions?'<th>Actions</th>':''}</tr></thead><tbody>${rows.map(t=>`<tr><td>${esc(t.title)}</td><td>${esc(t.owner)}</td><td>${esc(t.due)}</td><td>${badge(t.priority)}</td><td>${badge(t.status)}</td>${actions?`<td><button class="btn" onclick="openTask(${t.id})">Edit</button> <button class="btn danger" onclick="remove('tasks',${t.id})">Delete</button></td>`:''}</tr>`).join('')||'<tr><td colspan="6" class="empty">No tasks</td></tr>'}</tbody></table>`;
}
function activities(){
return `<div class="page-head"><div><h1>Activities</h1><p>Timeline of CRM changes</p></div><button class="btn" onclick="addActivity('Manual activity added')">+ Log Activity</button></div><div class="card"><div class="activity">${db.activities.map(a=>`<div class="activity-item"><span class="dot"></span><div><strong>${esc(a.text)}</strong><br><small>${esc(a.time)}</small></div></div>`).join('')}</div></div>`;
}
function reports(){
const total=db.deals.reduce((a,d)=>a+d.value,0),won=db.deals.filter(d=>d.stage==='Won').reduce((a,d)=>a+d.value,0);
return `<div class="page-head"><div><h1>Reports</h1><p>Sales and customer analytics</p></div><button class="btn" onclick="exportData()">Download Data</button></div>
<div class="grid stats">${stat('Pipeline Value',money(total),'All opportunities')}${stat('Won Value',money(won),'Closed revenue')}${stat('Win Rate',db.deals.length?Math.round(db.deals.filter(d=>d.stage==='Won').length/db.deals.length*100)+'%':'0%','Across deals')}${stat('Contacts / Deals',db.deals.length?(db.contacts.length/db.deals.length).toFixed(1):'0','Average ratio')}</div><br>
<div class="grid two"><div class="card"><h3>Deals by Stage</h3>${['Lead','Qualified','Proposal','Negotiation','Won'].map(s=>{let n=db.deals.filter(d=>d.stage===s).length;return `<p><strong>${s}</strong><span style="float:right">${n}</span></p><div style="height:8px;background:#eef2ff;border-radius:5px"><div style="height:8px;width:${Math.min(100,n*22)}%;background:#6366f1;border-radius:5px"></div></div>`}).join('')}</div><div class="card"><h3>Team Owners</h3>${['Priya','Rahul','Arjun'].map(o=>`<p>${o}<span style="float:right">${db.deals.filter(d=>d.owner===o).length} deals</span></p>`).join('')}</div></div>`;
}
function settings(){
return `<div class="page-head"><div><h1>Settings</h1><p>Customize your CRM workspace</p></div><button class="btn primary" onclick="saveSettings()">Save Changes</button></div>
<div class="card"><div class="form-grid"><div class="field"><label>Company Name</label><input id="setCompany" value="${esc(db.settings.company)}"></div><div class="field"><label>Currency</label><select id="setCurrency"><option ${db.settings.currency==='₹'?'selected':''}>₹</option><option ${db.settings.currency==='$'?'selected':''}>$</option><option ${db.settings.currency==='€'?'selected':''}>€</option></select></div><div class="field"><label>Theme</label><select id="setTheme"><option value="light">Light</option><option value="dark">Dark</option></select></div><div class="field"><label>Data</label><button class="btn" onclick="exportData()">Export JSON</button></div></div></div>`;
}
function badge(x){let cls={'Active':'green','Lead':'blue','Inactive':'gray','High':'red','Medium':'yellow','Low':'green','Open':'blue','In Progress':'yellow','Done':'green','Won':'green','Proposal':'yellow','Negotiation':'red','Qualified':'blue'}[x]||'gray';return `<span class="badge ${cls}">${esc(x)}</span>`}

function openModal(html){document.querySelector('#modalBody').innerHTML=html;document.querySelector('#modal').classList.add('show')}
function closeModal(){document.querySelector('#modal').classList.remove('show')}
function openContact(id=null){
const c=id?db.contacts.find(x=>x.id===id):{name:'',company:'',email:'',phone:'',status:'Lead',owner:'Priya',source:'Website',tags:[]};
openModal(`<h2>${id?'Edit':'New'} Contact</h2><div class="form-grid">
${field('cName','Name',c.name)}${field('cCompany','Company',c.company)}${field('cEmail','Email',c.email)}${field('cPhone','Phone',c.phone)}
${select('cStatus','Status',['Active','Lead','Inactive'],c.status)}${select('cOwner','Owner',['Priya','Rahul','Arjun'],c.owner)}${field('cSource','Source',c.source)}${field('cTags','Tags (comma separated)',c.tags.join(', '))}
</div><div class="modal-foot"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="saveContact(${id||0})">Save Contact</button></div>`)
}
function openDeal(id=null){
const d=id?db.deals.find(x=>x.id===id):{name:'',company:'',value:0,stage:'Lead',owner:'Priya',close:''};
openModal(`<h2>${id?'Edit':'New'} Deal</h2><div class="form-grid">${field('dName','Deal Name',d.name)}${field('dCompany','Company',d.company)}${field('dValue','Value',d.value,'number')}${select('dStage','Stage',['Lead','Qualified','Proposal','Negotiation','Won'],d.stage)}${select('dOwner','Owner',['Priya','Rahul','Arjun'],d.owner)}${field('dClose','Close Date',d.close,'date')}</div><div class="modal-foot"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="saveDeal(${id||0})">Save Deal</button></div>`)
}
function openTask(id=null){
const t=id?db.tasks.find(x=>x.id===id):{title:'',owner:'Priya',due:'',priority:'Medium',status:'Open'};
openModal(`<h2>${id?'Edit':'New'} Task</h2><div class="form-grid">${field('tTitle','Task',t.title)}${select('tOwner','Owner',['Priya','Rahul','Arjun'],t.owner)}${field('tDue','Due Date',t.due,'date')}${select('tPriority','Priority',['High','Medium','Low'],t.priority)}${select('tStatus','Status',['Open','In Progress','Done'],t.status)}</div><div class="modal-foot"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="saveTask(${id||0})">Save Task</button></div>`)
}
function field(id,label,val,type='text'){return `<div class="field"><label>${label}</label><input id="${id}" type="${type}" value="${esc(val)}"></div>`}
function select(id,label,opts,val){return `<div class="field"><label>${label}</label><select id="${id}">${opts.map(o=>`<option ${o===val?'selected':''}>${o}</option>`).join('')}</select></div>`}
function saveContact(id){const o={name:v('cName'),company:v('cCompany'),email:v('cEmail'),phone:v('cPhone'),status:v('cStatus'),owner:v('cOwner'),source:v('cSource'),tags:v('cTags').split(',').map(x=>x.trim()).filter(Boolean)};if(id)Object.assign(db.contacts.find(x=>x.id===id),o);else db.contacts.push({id:Date.now(),...o});save();addActivity(`${id?'Updated':'Added'} contact: ${o.name}`);closeModal();renderPage();toast('Contact saved')}
function saveDeal(id){const o={name:v('dName'),company:v('dCompany'),value:+v('dValue')||0,stage:v('dStage'),owner:v('dOwner'),close:v('dClose')};if(id)Object.assign(db.deals.find(x=>x.id===id),o);else db.deals.push({id:Date.now(),...o});save();addActivity(`${id?'Updated':'Added'} deal: ${o.name}`);closeModal();renderPage();toast('Deal saved')}
function saveTask(id){const o={title:v('tTitle'),owner:v('tOwner'),due:v('tDue'),priority:v('tPriority'),status:v('tStatus')};if(id)Object.assign(db.tasks.find(x=>x.id===id),o);else db.tasks.push({id:Date.now(),...o});save();addActivity(`${id?'Updated':'Added'} task: ${o.title}`);closeModal();renderPage();toast('Task saved')}
function v(id){return document.getElementById(id).value}
function remove(type,id){if(confirm('Delete this record?')){db[type]=db[type].filter(x=>x.id!==id);save();addActivity(`Deleted a ${type.slice(0,-1)} record`);renderPage();toast('Deleted')}}
function quickAdd(){state.page==='contacts'?openContact():state.page==='deals'?openDeal():state.page==='tasks'?openTask():openContact()}
function exportData(){const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='novacrm-export.json';a.click();URL.revokeObjectURL(a.href);toast('Exported JSON')}
function resetDemo(){if(confirm('Reset all CRM data to demo data?')){localStorage.removeItem(KEY);db=JSON.parse(JSON.stringify(seed));renderPage();toast('Demo reset')}}
function filterStatus(s){state.search=s;render()}
function saveSettings(){db.settings.company=v('setCompany');db.settings.currency=v('setCurrency');db.settings.theme=v('setTheme');save();toast('Settings saved')}
document.addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
shell();
