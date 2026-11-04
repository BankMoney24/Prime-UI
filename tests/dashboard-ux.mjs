import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as data from '../data.js';
const storage = {};
const root = {innerHTML:'',addEventListener(){},querySelector(){return null}};
const document = {getElementById:id=>id==='app'?root:null,documentElement:{dataset:{}},body:{classList:{toggle(){}}},addEventListener(){},querySelector(){return null}};
const location = {hash:'#/pim/dashboard'};
const window = {addEventListener(){},innerWidth:1440};
const env = vm.createContext({...data,console,window,document,location,history:{replaceState(){}},localStorage:{getItem:key=>storage[key]||null,setItem:(key,value)=>storage[key]=value},Date,Intl,Math,JSON,RegExp,Number,String,Array,Object,URL,Blob,FormData,clearTimeout,setTimeout(){},requestAnimationFrame(){}});
vm.runInContext(fs.readFileSync(new URL('../pim.js',import.meta.url),'utf8'),env,{filename:'pim.js'});
let src=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8').replace(/^import\s+\{[^}]+\}\s+from\s+'\.\/data\.js';\s*/,'');
vm.runInContext(src,env,{filename:'app.js'});
const checks=[];
function check(name,fn){fn();checks.push(name);console.log('PASS',name)}
function show(page){vm.runInContext(`S.edition='PIM';S.page=${JSON.stringify(page)};S.modal=null;render()`,env);return root.innerHTML}
check('Quick actions match mobile wireframe labels and use consistent line icons',()=>{
 const html=show('dashboard');for(const label of ['Request stock','Request purchase','Receive stock','Add item'])assert.ok(html.includes(label),label);
 assert.ok(html.includes('class="pim-dash-action"'));assert.ok(!html.includes('Ask to Buy'));
});
check('PIM dashboard low stock and requests expose View all links',()=>{
 const html=show('dashboard');
 for(const s of ['Low stock','My requests','Needs your attention','Analytics'])assert.ok(html.includes(s),s);
 assert.ok(html.includes('data-pim-action="dashboard-view-list" data-id="replenishment" data-tab="Low stock"'));
 assert.ok(html.includes('data-pim-action="dashboard-view-list" data-id="requests" data-tab="My requests"'));
});
check('Dashboard controls are chevrons with accessible expanded state',()=>{
 const html=show('dashboard');for(const t of ['Recent stock movements','Workspace setup','Inventory settings','Stock health'])assert.ok(html.includes(t));
 assert.ok(html.includes('aria-expanded="false"'));assert.ok(html.includes('pim-fold-chevron'));
 assert.ok(!html.includes('pim-dash-fold-head" data-pim-action="dashboard-fold" data-fold="dashSetup" aria-expanded="false"><strong'));
});
check('Analytics period filter uses correct options',()=>{
 const html=show('dashboard');for(const t of ['Today','Weekly','Monthly','Annually'])assert.ok(html.includes(`<option value="${t}"`),t)
});
check('Notification centre supports products and read filters',()=>{
 const html=show('notifications');assert.ok(html.includes('data-action="notif-filter"'));assert.ok(html.includes('data-change="notif-product"'));assert.ok(html.includes('Mark all as read'));assert.ok(html.includes('7 unread'));
});
check('RIM and TIM still render',()=>{
 for(const edition of ['RIM','TIM']){vm.runInContext(`S.edition='${edition}';S.page='dashboard';render()`,env);assert.ok(root.innerHTML.includes('dashboard-hero'),edition)}
});
console.log(`\n${checks.length} dashboard UX checks passed.`);
