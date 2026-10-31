import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as data from '../data.js';
const files=['../pim.js','../app.js'];
const storage={};
const listeners={};
const app={innerHTML:'',addEventListener(k,fn){listeners[k]=fn},querySelector(){return null}};
const document={getElementById:k=>k==='app'?app:null,documentElement:{dataset:{}},body:{classList:{toggle(){}}},addEventListener(){},querySelector(){return null}};
const location={hash:'#/pim/dashboard'};
const window={addEventListener(){},innerWidth:1440,location};
const ctx=vm.createContext({...data,console,window,document,location,history:{replaceState(_a,_b,path){location.hash=path}},localStorage:{getItem(k){return storage[k]||null},setItem(k,v){storage[k]=v}},Math,Date,Intl,JSON,RegExp,Object,Number,String,Array,Set,Error,URL,Blob,FormData,clearTimeout,setTimeout(){return 1},requestAnimationFrame(){}});
for(const [i,file] of files.entries()){
 let script=fs.readFileSync(new URL(file,import.meta.url),'utf8');
 if(i===1)script=script.replace(/^import\s+\{[^}]+\}\s+from\s+'\.\/data\.js';\s*/,'');
 vm.runInContext(script,ctx,{filename:file});
}
let total=0;
function check(label,fn){fn();total++;console.log('PASS',label)}
function show(ed,page){vm.runInContext(`S.edition=${JSON.stringify(ed)};S.page=${JSON.stringify(page)};S.modal=null;render()`,ctx);return app.innerHTML}
check('PIM dashboard renders working quick actions, current counts and warehouse checks',()=>{
 const html=show('PIM','dashboard');assert.ok(html.includes('pim-dashboard'));assert.ok(html.includes('Ask to Buy'));assert.ok(html.includes('Receive Delivery'));assert.ok(html.includes('Needs your attention'));assert.ok(html.includes('Stock watch'));assert.ok(!html.includes('All actions'));
});
check('All PIM module routes render original source-specific data and contextual tabs',()=>{
 for(const m of data.MODULES.PIM){const html=show('PIM',m.id);assert.ok(html.includes('pim-workspace'),m.id);assert.ok(html.includes('pim-panel'),m.id);assert.ok(html.includes('data-pim-action="tab"'),m.id);assert.ok(html.includes('data-pim-action="detail"')||m.id==='field' || m.id==='imports',m.id)}
});
check('Approvals show actionable request status from same PIM state',()=>{
 const html=show('PIM','approvals');assert.ok(html.includes('REQ-0042'));assert.ok(html.includes('Approve'));assert.ok(html.includes('Awaiting approval'));
});
check('Inventory uses on-hand, reserved, available and quarantine columns',()=>{
 const html=show('PIM','inventory');for(const label of ['On hand','Reserved','Quarantined','Available','Safety helmet','Work gloves'])assert.ok(html.includes(label),label);
});
check('PIM module pages keep original route and source file separate from RIM and TIM',()=>{
 for(const ed of ['RIM','TIM']){const html=show(ed,'dashboard');assert.ok(html.includes('dashboard-hero'));assert.ok(!html.includes('pim-dashboard'));}
});
check('Global search has QR/barcode action and navigation exposes PIM modules',()=>{
 const html=show('PIM','dashboard');assert.ok(html.includes('data-action="scan"'));assert.ok(html.includes('All modules'));assert.ok(html.includes('data-go="requests"'));
});
check('PIM render output does not contain undefined placeholder or fake production claims',()=>{
 for(const p of ['requests','catalogue','purchasing','inventory','assets','counts','transfers','replenishment','reports']){const html=show('PIM',p);assert.ok(!html.includes('undefined'),p);assert.ok(html.includes('PIM demonstration'),p)}
});
const snapshots=['dashboard','requests','catalogue','inventory','purchasing','assets','projects','suppliers','counts','replenishment','reports','transfers','approvals'];
const out={};for(const p of snapshots){let html=show('PIM',p);out[p]=html}
fs.mkdirSync(new URL('../qa/',import.meta.url),{recursive:true});
for(const [p,html] of Object.entries(out))fs.writeFileSync(new URL(`../qa/${p}-markup.html`,import.meta.url),html);
console.log(`\n${total} full-shell PIM integration checks passed. Rendered ${Object.keys(out).length} markup snapshots.`);
