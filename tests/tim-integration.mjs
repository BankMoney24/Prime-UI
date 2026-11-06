import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as data from '../data.js';
const store={};
const root={innerHTML:'',addEventListener(){},querySelector(){return null}};
const location={hash:'#/tim/dashboard'};
const document={getElementById:k=>k==='app'?root:null,documentElement:{dataset:{}},body:{classList:{toggle(){}}},addEventListener(){},querySelector(){return null}};
const window={addEventListener(){},innerWidth:1440};
const ctx=vm.createContext({...data,console,window,document,location,history:{replaceState(_a,_b,path){location.hash=path}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},Math,Date,Intl,JSON,RegExp,Object,Number,String,Array,Set,Error,URL,Blob,FormData,clearTimeout,setTimeout(){},requestAnimationFrame(){}});
for(let file of ['../pim.js','../tim.js','../app.js']){let source=fs.readFileSync(new URL(file,import.meta.url),'utf8');if(file.includes('app.js'))source=source.replace(/^import\s+\{[^}]+\}\s+from\s+'\.\/data\.js';\s*/,'');vm.runInContext(source,ctx,{filename:file});}
let checks=0;function test(name,fn){fn();checks++;console.log('PASS',name)}
function show(ed,page){vm.runInContext(`S.edition=${JSON.stringify(ed)};S.page=${JSON.stringify(page)};S.modal=null;render();`,ctx);return root.innerHTML}
test('TIM complete dashboard uses dedicated domain view',()=>{let s=show('TIM','dashboard');for(const token of ['tim-workspace','tim-kpis','Quick actions','Tool availability','Needs your attention','Analytics','TIM · Enterprise'])assert.ok(s.includes(token),token);});
test('TIM key operational pages use domain records and mobile cards',()=>{for(const page of ['tools','toolstore','issue','inspections','calibration','maintenance','workorders','custody']){const s=show('TIM',page);assert.ok(s.includes('tim-table-panel'),page);assert.ok(s.includes('tim-mobile-rows'),page);assert.ok(s.includes('data-tim="detail"')||page==='custody',page)}});
test('PIM approval rows put status in right side action column',()=>{const s=show('PIM','dashboard');let match=s.match(/class="pim-dash-row pim-attention-row"[\s\S]*?data-pim-action="dashboard-view-request"/);assert.ok(match);assert.ok(match[0].includes('class="pim-dash-row-end"'));assert.ok(match[0].includes('Awaiting approval'));assert.ok(!match[0].includes('pim-dash-row-title"><strong>Safety helmet</strong><span class="pim-status'));});
test('PIM analytics period and plan information render',()=>{const s=show('PIM','dashboard');for(const period of ['Today','Weekly','Monthly','Annually'])assert.ok(s.includes(`<option value="${period}"`),period);assert.ok(s.includes('pim-dash-subscription'));assert.ok(s.includes('Manage plan'));});
test('RIM retains its dashboard and stock-aware POS',()=>{let a=show('RIM','dashboard');let b=show('RIM','pos');assert.ok(a.includes('dashboard-hero'));assert.ok(b.includes('Review demo payment'));assert.ok(b.includes('in stock'));});
console.log(`\n${checks} full-shell PIM/TIM integration tests passed.`);
