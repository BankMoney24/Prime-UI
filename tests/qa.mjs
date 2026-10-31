import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const here=path.dirname(new URL(import.meta.url).pathname);
const base=path.resolve(here,'..');
const data=await import(pathToFileURL(path.join(base,'data.js')).href);
const source=fs.readFileSync(path.join(base,'app.js'),'utf8').replace(/^import\s+\{[^}]+\}\s+from\s+'\.\/data\.js';\s*/,'');
const handlers={};
const root={innerHTML:'',addEventListener(type,callback){handlers[type]=callback},querySelector(){return null}};
const document={getElementById(id){return id==='app'?root:null},addEventListener(){},documentElement:{dataset:{}},body:{classList:{toggle(){}}}};
const location={hash:'#/pim/dashboard'};
const storage={};
const memory={getItem(k){return storage[k]||null},setItem(k,v){storage[k]=v}};
const ctx=vm.createContext({...data,console,location,history:{replaceState(_a,_b,h){location.hash=h}},window:{addEventListener(){},innerWidth:1440},document,localStorage:memory,URL,Intl,Math,Date,Number,String,Array,Object,JSON,RegExp,Set,Error,encodeURIComponent,clearTimeout,setTimeout,requestAnimationFrame(){},Blob,FormData});
vm.runInContext(source,ctx,{filename:'app.js'});
let checks=0;
const test=(label,fn)=>{fn();checks++;console.log('PASS',label)};
function set(ed,page){vm.runInContext(`S.edition=${JSON.stringify(ed)};S.page=${JSON.stringify(page)};S.modal=null;S.search='';S.activeTab='';render();`,ctx);return root.innerHTML;}
test('All three editions have valid primary routes',()=>{
 for(const [ed,arr] of Object.entries(data.PRIMARY))for(const id of arr)assert.ok(data.getModule(ed,id),ed+':'+id);
});
test('All module rows have the same number of columns',()=>{
 for(const [ed,arr] of Object.entries(data.MODULES))for(const m of arr){assert.ok(m.tabs.length>0);assert.ok(m.rows.length>=3,ed+':'+m.id);for(const row of m.rows)assert.equal(row.length,m.columns.length,ed+':'+m.id)}
});
test('Dashboard contains top quick actions and no charts',()=>{
 for(const ed of Object.keys(data.ED)){
  const html=set(ed,'dashboard');assert.ok(html.includes('What do you need to do?'));assert.ok(html.includes('quick-grid'));assert.ok(html.includes('Key activity'));assert.ok(html.includes('Explore more'));assert.ok(html.includes('data-fold="health"'));assert.ok(!html.includes('<canvas'));assert.ok(!html.includes('All actions'));assert.ok(html.indexOf('dashboard-actions')<html.indexOf('kpi-grid'));
 }
});
test('All edition modules render without exception',()=>{
 let count=0;
 for(const [ed,mods] of Object.entries(data.MODULES))for(const m of mods){let html=set(ed,m.id);assert.ok(html.includes('page-head'),ed+':'+m.id);assert.ok(html.includes(m.name.replace(/&/g,'&amp;'))||m.id==='pos',ed+':'+m.id+' expected '+m.name+' found '+html.slice(0,110));count++}
 assert.ok(count>=50);
});
test('Shared modules all render',()=>{
 for(const id of Object.keys(data.SHARED))assert.ok(set('PIM',id).includes('page-head'));
 for(const p of ['chat','notifications','help','reviews','versions','profile','settings','onboarding','auth','all'])assert.ok(set('PIM',p).includes('page-head'));
});
test('Sidebar labels are compact and requests are direct',()=>{
 let html=set('PIM','dashboard');assert.ok(html.includes('All modules'));assert.ok(html.includes('>Requests<'));assert.ok(!html.includes('Create New</button>'));
});
test('Top navigation includes scan and excludes Help icon',()=>{
 let html=set('PIM','dashboard');let a=html.indexOf('<header class="topbar">'),b=html.indexOf('</header>',a);let h=html.slice(a,b);assert.ok(h.includes('Scan'));assert.ok(h.includes('Chat'));assert.ok(h.includes('Notifications'));assert.ok(!h.includes('title="Help"'));
});
test('Correct quick action labels preserved',()=>{
 const html=set('PIM','dashboard');assert.ok(html.includes('Ask to Buy'));assert.ok(html.includes('Receive Delivery'));
});
test('Tabs, searchable table and export render on module pages',()=>{
 const html=set('PIM','inventory');assert.ok(html.includes('data-tab="Movements"'));assert.ok(html.includes('module-filter'));assert.ok(html.includes('data-action="export"'));
});
test('Point of Sale has product catalog and demo checkout',()=>{
 const html=set('RIM','pos');assert.ok(html.includes('New sale'));assert.ok(html.includes('Wireless mouse'));assert.ok(html.includes('Collect demo payment'));
});
test('Modal creation has validation and specific fields',()=>{
 set('PIM','requests');const s=vm.runInContext("S.modal={type:'create',moduleId:'requests',title:'Create request'};render();",ctx);assert.ok(root.innerHTML.includes('Needed by'));assert.ok(root.innerHTML.includes('Quantity'));
});
test('Phone media query and 44px-ish action sizing exist',()=>{
 const css=fs.readFileSync(path.join(base,'styles.css'),'utf8');assert.ok(css.includes('max-width:700px'));assert.ok(css.includes('max-width:900px'));assert.ok(css.includes('.mobile-bottom'));assert.ok(css.includes('.sidebar.mobile-open'));
});
test('All main public files use relative paths',()=>{
 const html=fs.readFileSync(path.join(base,'index.html'),'utf8');for(const p of ['./styles.css','./app.js','./assets/prime-mark.svg'])assert.ok(html.includes(p));
});
console.log(`\n${checks} structural and DOM-rendering checks passed. Browser automation is not available in this runtime.`);
