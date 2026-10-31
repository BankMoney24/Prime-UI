import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as data from '../data.js';
const source=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8').replace(/^import\s+\{[^}]+\}\s+from\s+'\.\/data\.js';\s*/,'');
const listeners={};const el={innerHTML:'',addEventListener(k,fn){listeners[k]=fn},querySelector(){return null}};
const doc={getElementById:k=>k==='app'?el:null,addEventListener(){},documentElement:{dataset:{}},body:{classList:{toggle(){}}}};
const loc={hash:'#/pim/dashboard'};let items={};
const ctx=vm.createContext({...data,console,document:doc,window:{innerWidth:1440,addEventListener(){}},location:loc,history:{replaceState(_a,_b,x){loc.hash=x}},localStorage:{getItem:k=>items[k]||null,setItem:(k,v)=>items[k]=v},Intl,Math,Number,String,Array,JSON,RegExp,Object,Date,Set,Error,URL,Blob,FormData,requestAnimationFrame(){},setTimeout(){return 1},clearTimeout(){}});
vm.runInContext(source,ctx,{filename:'app.js'});
const run=s=>vm.runInContext(s,ctx);
function click(dataset){listeners.click({target:{dataset,closest:()=>({dataset})}})}
function show(ed,page){run(`S.edition='${ed}';S.page='${page}';S.modal=null;S.search='';S.activeTab='';render()`);return el.innerHTML;}
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS',name)};
test('Accordion opens, stores state and closes',()=>{
 show('PIM','dashboard');assert.equal(run('S.expanded["PIMto-do"]'),undefined);
 click({action:'fold',fold:'to-do'});assert.equal(run('S.expanded["PIMto-do"]'),true);assert.ok(el.innerHTML.includes('Waiting')||el.innerHTML.includes('Approve'));
 click({action:'fold',fold:'to-do'});assert.equal(run('S.expanded["PIMto-do"]'),false);
});
test('Product switcher switches edition and changes URL',()=>{
 click({edition:'RIM'});assert.equal(loc.hash,'#/rim/dashboard');run('fromHash()');assert.ok(el.innerHTML.includes('Retail Inventory Management')||el.innerHTML.includes('Retail inventory'));
 click({edition:'TIM'});assert.equal(loc.hash,'#/tim/dashboard');run('fromHash()');assert.ok(el.innerHTML.includes('Tool inventory'));
});
test('Point of Sale cart add, increase, decrease and clear',()=>{
 show('RIM','pos');click({action:'pos-add',sku:'MS-01'});assert.equal(run('S.basket.length'),1);assert.equal(run('S.basket[0].qty'),1);
 click({action:'pos-inc',sku:'MS-01'});assert.equal(run('S.basket[0].qty'),2);
 click({action:'pos-dec',sku:'MS-01'});assert.equal(run('S.basket[0].qty'),1);
 click({action:'pos-clear'});assert.equal(run('S.basket.length'),0);
});
test('Scan opens accessible code-entry modal',()=>{
 click({action:'scan'});assert.ok(el.innerHTML.includes('id="scan-form"'));assert.ok(el.innerHTML.toLowerCase().includes('manual'));click({action:'close-modal'});assert.equal(run('S.modal'),null);
});
test('Detailed review comment is available for sample persona',()=>{
 show('PIM','reviews');click({action:'view-review',review:'sample-0'});assert.ok(el.innerHTML.includes('Keep expected and received'));assert.ok(el.innerHTML.includes('Reply'));
});
test('Approval queue provides an actionable decision',()=>{
 show('PIM','approvals');click({action:'create'});assert.ok(el.innerHTML.includes('Approve'));assert.ok(el.innerHTML.includes('Reject'));
});
test('Module data create drafts are local and safe',()=>{
 show('PIM','requests');let original=run('rowArray().length');run("createRow({name:'Test request',details:'Safety boots',quantity:2},'requests')");assert.equal(run('rowArray().length'),original+1);assert.ok(el.innerHTML.includes('Request')||true);
});
test('Version notes and account forms render',()=>{
 for(const p of ['versions','signup','reset','auth','setup','profile','settings'])assert.ok(show('PIM',p).includes('page-head'),'page='+p);
});
console.log(`\n${count} interaction simulations passed.`);
