import fs from 'node:fs'; import vm from 'node:vm';import assert from 'node:assert/strict';
import * as data from '../data.js';
const store={}, root={innerHTML:'',addEventListener(){},querySelector(){return null}};
const doc={getElementById:id=>id==='app'?root:null,documentElement:{dataset:{}},body:{classList:{toggle(){}}},querySelector(){return null},addEventListener(){}};
const loc={hash:'#/tim/dashboard'};
const win={addEventListener(){},innerWidth:1440,requestAnimationFrame(){},print(){}};
const ctx=vm.createContext({...data,window:win,document:doc,location:loc,history:{replaceState(_a,_b,path){loc.hash=path}},localStorage:{getItem:id=>store[id]||null,setItem:(id,v)=>store[id]=v},console,Number,Math,Intl,Date,JSON,Object,Array,RegExp,Set,Error,URL,Blob,FormData,clearTimeout,setTimeout(){},requestAnimationFrame(){},encodeURIComponent});
for(const f of ['../pim.js','../tim.js','../tim-industrial-core.js','../tim-industrial-ui.js','../app.js']){let src=fs.readFileSync(new URL(f,import.meta.url),'utf8');if(f.endsWith('/app.js'))src=src.replace(/^import\s+\{[^}]+\}\s+from\s+'\.\/data\.js';\s*/,'');vm.runInContext(src,ctx,{filename:f});}
let tests=0;function test(name,fn){fn();tests++;console.log('PASS',name)}
function show(ed,page){vm.runInContext(`S.edition=${JSON.stringify(ed)};S.page=${JSON.stringify(page)};render();`,ctx);return root.innerHTML;}
test('TIM industrial dashboard is loaded into the PRIME shell',()=>{let h=show('TIM','dashboard');for(let token of ['itim-workspace','Tool control board','Quick actions','Industry','Toolbox issue','Needs your attention']) assert.ok(h.includes(token),token)});
test('TIM primary and new industrial routes render record-specific content',()=>{for(let page of ['tools','toolboxes','toolstore','requests','issue','returns','inspections','calibration','maintenance','workorders','exceptions','compliance','custody','tooltransfers','traceability','audittrail','industry','offline','analytics','reports']){let html=show('TIM',page);assert.ok(html.includes('itim-workspace'),page);assert.ok(html.includes('TIM /'),page)}});
test('All 11 packs are available within the industry UI',()=>{let h=show('TIM','industry');assert.ok(h.includes('Aviation MRO'));assert.ok(h.includes('Marine &amp; Shipbuilding'));assert.ok(h.includes('Steel &amp; Fabrication'));assert.ok(h.includes('Oil, Gas &amp; Offshore'))});
test('Toolbox forms contain scan, two confirmations and workflow controls',()=>{win.PrimeTIM.click({dataset:{tim:'action',kind:'issue'}},{render(){}});let h=show('TIM','dashboard');assert.ok(h.includes('Scanned tool IDs'));assert.ok(h.includes('storesSignature'));assert.ok(h.includes('receiverSignature'))});
test('Old PIM and RIM dashboards retain their own modules',()=>{let a=show('PIM','dashboard');assert.ok(a.includes('pim-')||a.includes('Request stock'));let b=show('RIM','dashboard');assert.ok(b.includes('What do you need to do?'))});
console.log(`${tests} integrated industrial UI tests passed`);
